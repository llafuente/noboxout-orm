(function () {
    "use strict";

    var $ = require("node-class"),
        array = require("array-enhancements"),
        __class = $.class,
        Query,
        util = require("./util.js"),
        escapeId = require("mysql").escapeId,
        escapeVal = require("mysql").escape,
        debug,
        norm = require("./norm.js");

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
            from: [],
            set: [],
            joins: [],
            where: [],
            offset: 0,
            limit: 0,
            group: []
        },
        options: {
            cachekey: [],
        },
        root: null,
        current: null,

        reset: function(part) {
            switch(part) {
            case "select":
            case "from":
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
            default:
                throw new Error("unkown query part");
            }

            return this;
        },

        //
        // utils
        //
        getRootAlias: function () {
            return this.parts.from[1];
        },
        setRoot: function (root) {
            this.root = root;

            return this;
        },
        use: function(entity, as) {
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
        _column: function(k) {
            if (!this.current) {
                return escapeId(k);
            }

            var p = this.current.$table.prefix;
            if (this.current_alias) {
                return escapeId(this.current_alias) + "." + escapeId(p + k);
            }

            return escapeId(p + k);
        },

        _operation: function (k, op, v) {
            return [this._column(k), op, escapeVal(v, false, 'local')];
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

        and: function() {
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
        or: function() {
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


        singleResult: function() {
            this.options.result = 1;

            return this;
        },
        min: function (v) {},
        max: function (v) {},
        avg: function (v) {},
        sum: function (v) {},

        // first: tell me what are the operation
        // - select
        // - update
        // - delete

        select: function (v, is_literal, as) {
            this.parts.select = [];
            return this.andSelect(v, is_literal, as);
        },
        andSelect: function (v, is_literal, as) {
            // select can be called many times
            if (this.mode !== null && this.mode !== "select") {
                throw new Error("mode cannot be changed");
            }

            this.mode = "select";

            this.parts.select.push((is_literal ? v : this._column(v)) + (as ? " AS " + escapeId(as) : ""));

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

        // second: target(s)
        // tableName or entity
        from: function (table, alias) {
            if (table && table.$class && table.$table) {
                this.setRoot(table);
                table = table.$table.tableName;
            }

            alias = alias || "root";

            this.parts.from = [table, alias];

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
            // prefix!
            if (this.root) {
                if (this.root.$table.columns.indexOf(k) !== -1) {
                    k = this.root.$table.prefix + k;
                }
            }
            this.parts.set.push([k, v]);

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

        // fourth: group, order, limits

        offset: function (v) {
            this.parts.offset = v;
        },
        limit: function (v) {
            this.parts.limit = v;
        },
        order: function (v, asc) {

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

            return "\nSET " + this.parts.set.map(function (v) {
                return escapeId(v[0]) + " = " + escapeVal(v[1]);
            }).join(", ");
        },
        _getFrom: function (p) {
            switch (this.mode) {
            case "select":
                return "\nFROM " + escapeId(p.from[0]) + " AS " + escapeId(p.from[1]) +
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
                return escapeId(p.from[0]);
            case "delete":
                return "\nFROM " + escapeId(p.from[0]);
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
        _getGroup: function(p) {
            if (!p.group.length) {
                return "";
            }
            return " GROUP BY " + p.group.join(", ") + " ";
        },
        _getLimit: function(p) {
            return (p.limit !== 0 ? (" LIMIT " + p.offset + ", " + p.limit) : "")
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


        //
        // database
        //
        __queryDB: function (con, callback) {
            var self = this;

            con.query(this.options, function (err, dbres) {
                if (self.options.cachekey.length && !err) {
                    //manage cache
                    switch (self.mode) {
                    case "delete":
                    case "update":
                        self.options.cachekey.forEach(function (ck) {
                            con.delCache(ck, function (err) {
                                if (err) {
                                    return norm.err(err);
                                }
                                norm.info("del-cache ok!");
                            });
                        });
                        break;
                    case "select":
                        self.options.cachekey.forEach(function (ck) {
                            con.setCache(ck, dbres, 3600, function (err) {
                                if (err) {
                                    return norm.err(err);
                                }
                                norm.info("set-cache ok!");
                            });
                        });
                        break;
                    }

                }
                callback && callback(err, dbres);
            });
        },
        // handle cachekeys like priority or alternatives!?
        __queryCache: function (con, callback) {
            this.options.sql = this.getSql();

            var self = this;

            if (this.options.cachekey.length) {
                //manage cache
                switch (this.mode) {
                case "select":
                    return con.getCache(this.options.cachekey[0], function (err, dbres) {
                        if (err || dbres === false || dbres === undefined) {
                            self.__queryDB(con, callback);
                        } else {
                            callback && callback(err, dbres);
                        }
                    });

                case "delete": // do nothing
                case "update": // do nothing
                }
            }

            this.__queryDB(con, callback);

        },
        exec: function (con, callback) {
            if (con.$class !== "norm/connection") {
                throw new Error("invalid connection argument");
            }

            var self = this;

            if (self.options.pagination) {
                this.paginate(self.options.pagination[0], self.options.pagination[1]);
            }

            this.__queryCache(con, function (err, raw) {

                if (!self.root) {
                    return callback && callback(err, raw);
                }

                var result = [],
                    i,
                    max,
                    raw_agg;
                if (raw && raw.length) {
                    if (self.options.nestTables) {
                        raw_agg = util.aggregateNested(self.root, raw);

                        for (i = 0, max = raw_agg.length; i < max; ++i) {
                            result.push(util.parseEntity(self.root, con, raw_agg[i]));
                        }
                    }

                    // single result
                    if (self.options.result === 1) {
                        result = result[0];
                    } else {
                        // multiple results
                    }
                } else {
                    result = null;
                }


                if (self.options.pagination) {
                    return con.query("SELECT FOUND_ROWS() AS `count`", function (err, found_rows) {
                        return callback && callback(err, {data: result, total: found_rows[0].count}, raw);
                    });
                }

                return callback && callback(err, result, raw);
            });

            return this;
        },
        paginate: function(offset, limit) {
            this.options.pagination = true;

            this.limit(limit);
            this.offset(offset);

            this.parts.select[0] = "SQL_CALC_FOUND_ROWS " + this.parts.select[0];

            return this;
        }
    });

    module.exports = Query;
}());