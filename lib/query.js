(function () {
    "use strict";

    var $ = require("node-class"),
        array = require("array-enhancements"),
        __class = $.class,
        Query,
        escapeId = require("mysql").escapeId,
        escapeVal = require("mysql").escape,
        debug;

    function arEscapeId(combo) {
        if (Array.isArray(combo)) {
            if (combo.length !== 2) {
                throw new Error("wtf!?");
            }
            return escapeId(combo[0]) + "." + escapeId(combo[1]);
        }
        return escapeId(combo);
    }

    Query = __class("norm/query", {
        mode: null,

        parts: {
            select: [],
            set: [],
            joins: [],
            where: [],
            offset: 0,
            limit: 0,
            order: [],
            group: []
        },
        options: {
            cachekey: [],
        },
        root: null,
        alias: null,
        current: null,

        norm: null,

        initialize: function () {
            this.norm = require("./norm.js");
        },

        reset: function (part) {
            switch (part) {
            case "select":
            case "set":
            case "joins":
            case "where":
            case "group":
                this.parts[part] = [];
                break;
            case "offset":
            case "limit":
                this.parts[part] = 0;
                break;
            case "from":
                this.root = null;
                this.alias = null;
                break;
            default:
                throw new Error("unkown query part");
            }

            return this;
        },

        //
        // utils
        //
        setRoot: function (root, alias) {
            this.root = root;
            this.alias = alias || "root";

            this.use(this.root, this.alias);

            return this;
        },
        use: function (entity, as) {
            this.current = entity;
            this.current_alias = as === null ? as : (as || "root");

            return this;
        },
        setOption: function (key, value) {
            this.options[key] = value;

            return this;
        },
        setOptions: function (obj, defs) {
            var i;

            for (i in defs) {
                this.options[i] = defs[i];
            }

            for (i in obj) {
                if ("cachekey" === i) {
                    if (Array.isArray(obj[i])) {
                        array.combine(this.options.cachekey, obj.cachekey);
                    } else {
                        this.options.cachekey.push(obj.cachekey);
                    }

                } else {
                    this.options[i] = obj[i];
                }
            }

            return this;
        },
        _column: function (k) {
            // array means it was a literal!
            if (Array.isArray(k)) {
                return k.join(" ");
            }

            // if it's not a string, means literal number
            if ("string" !== typeof k) {
                return k;
            }

            if (!this.current) {
                return escapeId(k);
            }

            var p = this.current.$table.prefix;
            if (this.current_alias && "select" === this.mode) {
                return escapeId(this.current_alias) + "." + escapeId(p + k);
            }

            return escapeId(p + k);
        },

        _operation: function (k, op, v) {
            if (this.root && this.root.$table.columns.indexOf(v) !== -1) {
                return [this._column(k), op, this._column(v)];
            }

            return [this._column(k), op, escapeVal(v, false, "local")];
        },
        eq: function (k, v) {
            return this._operation(k, "=", v);
        },
        neq: function (k, v) {
            return this._operation(k, "!=", v);
        },

        lt: function (k, v) {
            return this._operation(k, "<", v);
        },
        lte: function (k, v) {
            return this._operation(k, "<=", v);
        },

        gt: function (k, v) {
            return this._operation(k, ">", v);
        },
        gte: function (k, v) {
            return this._operation(k, ">=", v);
        },

        and: function () {
            var i,
                max = arguments.length,
                out = [];
            for (i = 0; i < max; ++i) {
                out.push();
                if (i < max - 1) {
                    out.push(" AND ");
                }
            }
            return out;
        },
        or: function () {
            var i,
                max = arguments.length,
                out = [];
            for (i = 0; i < max; ++i) {
                out.push();
                if (i < max - 1) {
                    out.push(" OR ");
                }
            }
            return out;
        },


        singleResult: function () {
            this.options.result = 1;

            return this;
        },
        min: function (v) {
            return ["MIN(", this._column(v), ")"];
        },
        max: function (v) {
            return ["MAX(", this._column(v), ")"];
        },
        avg: function (v) {
            return ["AVG(", this._column(v), ")"];
        },
        sum: function (a, b) {
            return [this._column(a), "+", this._column(b)];
        },
        sub: function (a, b) {
            return [this._column(a), "-", this._column(b)];
        },
        decrement: function (a, number) {
            a = this._column(a);
            return [a, "=", a, "-", number];
        },
        increment: function (a, number) {
            a = this._column(a);
            return [a, "=", a, "+", number];
        },

        // first: tell me what are the operation
        // - select
        // - update
        // - delete

        select: function (v, as) {
            this.parts.select = [];
            return this.andSelect(v, as);
        },
        andSelect: function (v, as) {
            // select can be called many times
            if (this.mode !== null && this.mode !== "select") {
                throw new Error("mode cannot be changed");
            }

            this.mode = "select";

            this.parts.select.push(this._column(v) + (as ? " AS " + escapeId(as) : ""));

            return this;
        },
        delete: function () {
            if (this.mode !== null) {
                throw new Error("mode cannot be changed");
            }

            this.mode = "delete";

            return this;
        },
        update: function () {
            if (this.mode !== null) {
                throw new Error("mode cannot be changed");
            }

            this.mode = "update";

            return this;
        },

        joinLeft: function (target, alias, left_size, right_size) {
            if (this.mode !== "select") {
                throw new Error("for security reasons, joins are select only");
            }

            this.parts.joins.push(["LEFT JOIN", target, "AS", alias, "ON", left_size, "=", right_size]);

            return this;
        },
        joinRight: function (target, alias, left_size, right_size) {
            if (this.mode !== "select") {
                throw new Error("for security reasons, joins are select only");
            }

            this.parts.joins.push(["RIGHT JOIN", target, "AS", alias, "ON", left_size, "=", right_size]);

            return this;
        },
        joinInner: function (target, alias, left_size, right_size) {
            if (this.mode !== "select") {
                throw new Error("for security reasons, joins are select only");
            }

            this.parts.joins.push(["INNER JOIN", target, "AS", alias, "ON", left_size, "=", right_size]);

            return this;
        },

        // second and a half, set (update only)
        set: function (k, v) {
            if (arguments.length === 2) {
                this.parts.set.push(this._column(k) + " = " + escapeVal(v));
            } else {
                this.parts.set.push(Array.isArray(k) ? k.join(" ") : k);
            }

            return this;
        },

        // third: filters

        andWhere: function (where) {
            if (this.parts.where.length) {
                this.parts.where.push("AND");
            }

            this.parts.where.push(where);

            return this;
        },
        orWhere: function (where) {
            if (this.parts.where.length) {
                this.parts.where.push("OR");
            }

            this.parts.where.push(where);

            return this;
        },

        // fourth: group, order, limits

        offset: function (v) {
            this.parts.offset = v;
        },
        limit: function (v) {
            this.parts.limit = v;
        },
        order: function (v, asc) {
            this.parts.order.push(this._column(v) + (asc ? "ASC" : "DESC"));
        },
        group: function (v) {
            this.parts.group.push(this._column(v));
        },

        //
        // query composition
        //

        _getSelect: function (p) {
            return "SELECT " + p.select.join((debug ? ",\n" : ","));
        },
        _getDelete: function () {
            return "DELETE ";
        },
        _getUpdate: function () {
            return "UPDATE ";
        },
        _getSet: function () {
            return "\nSET " + this.parts.set.join(", ");
        },
        _getFrom: function (p) {
            var table = this.root.$table.tableName;

            switch (this.mode) {
            case "select":
                return "\nFROM " + escapeId(table) + " AS " + escapeId(this.alias) +
                    (p.joins.length ?
                        ((debug ? "\n " : "")
                            + p.joins.map(function (v) {
                            v[1] = escapeId(v[1]);
                            v[3] = escapeId(v[3]);
                            v[5] = arEscapeId(v[5]);
                            v[7] = arEscapeId(v[7]);
                            return v.join(" ");
                        }).join((debug ? " \n" : " "))
                    ) : "");
            case "update":
                return escapeId(table);
            case "delete":
                return "\nFROM " + escapeId(table);
            }
        },
        _getWhere: function (p) {
            function flattern(lit) {
                var i,
                    max,
                    cpy = [];

                for (i = 0, max = lit.length; i < max; ++i) {
                    if (Array.isArray(lit[i])) {
                        cpy[i] = flattern(lit[i]);
                    } else {
                        cpy[i] = lit[i];
                    }
                }

                return cpy.join(" ");
            }


            return "\nWHERE " +
                (p.where.length ? flattern(p.where) : "1");
        },
        _getGroup: function (p) {
            if (!p.group.length) {
                return "";
            }
            return " GROUP BY " + p.group.join(", ") + " ";
        },
        _getLimit: function (p) {
            return (p.limit !== 0 ? (" LIMIT " + p.offset + ", " + p.limit) : "");
        },
        _getOrder: function (p) {
            return (p.order.length !== 0 ? (" ORDER BY " + p.order.join(", ")) : "");
        },

        getSql: function () {
            if (this.mode === null) {
                throw new Error("mode is not set");
            }

            var p = this.parts;

            switch (this.mode) {
            case "select":
                return [
                    this._getSelect(p),
                    this._getFrom(p),
                    this._getWhere(p),
                    this._getGroup(p),
                    this._getOrder(p),
                    this._getLimit(p)
                ].join(" ");
            case "update":
                return [
                    this._getUpdate(p),
                    this._getFrom(p),
                    this._getSet(p),
                    this._getWhere(p)
                ].join(" ");
            case "delete":
                return [
                    this._getDelete(p),
                    this._getFrom(p),
                    this._getWhere(p)
                ].join(" ");
            }
        },

        //
        // cache
        //

        setCacheKey: function (key, concat) {
            this.options.cachekey = [key + (Buffer.isBuffer(concat) ? concat.toString("hex") : (concat || ""))];

            return this;
        },
        addCacheKey: function (key, concat) {
            var ck = key + (Buffer.isBuffer(concat) ? concat.toString("hex") : (concat || ""));

            if (Array.isArray(this.options.cachekey)) {
                this.options.cachekey.push(ck);
            } else {
                this.options.cachekey = [ck];
            }

            return this;
        },
        exec: function (con, callback) {
            if (con.$class !== "norm/connection") {
                throw new Error("invalid connection argument");
            }

            var self = this;

            if (self.options.pagination) {
                this.paginate(self.options.pagination[0], self.options.pagination[1]);
            }

            con.exec(this, callback);

            return this;
        },
        paginate: function (offset, limit) {
            this.options.pagination = true;

            this.limit(limit);
            this.offset(offset);

            this.parts.select[0] = "SQL_CALC_FOUND_ROWS " + this.parts.select[0];

            return this;
        }
    });

    module.exports = Query;
}());