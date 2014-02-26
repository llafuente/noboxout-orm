(function () {
    "use strict";

    var $ = require("node-class"),
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

    function literal(lit) {
        return "@" + lit + "@";
    }

    function isLiteral(lit) {
        return lit[0] === "@" && lit[lit.length - 1] === "@";
    }

    function cleanLiteral(lit) {
        return lit.substring(1, lit.length - 1);
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
            limit: 0
        },
        options: {
            cachekey: null,
        },
        root: null,        

        //
        // utils
        //
        getRootAlias: function () {
            return this.parts.from[1];
        },
        setRoot: function (root) {
            this.root = root;
        },
        setOptions: function (key, value) {
            if ("object" === typeof key) {
                var i;
                for (i in key) {
                    this.options[i] = key[i];
                }
                return this;
            }

            this.options[key] = value;
            return this;
        },

        "static eq": function (k, v) {
            return escapeId(k) + " = " + escapeVal(v, false, 'local');

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

        select: function (v, is_literal) {
            // select can be called many times
            if (this.mode !== null && this.mode !== "select") {
                throw new Error("mode cannot be changed");
            }

            this.mode = "select";

            this.parts.select = [is_literal ? literal(v) : v];

            return this;
        },
        andSelect: function (v, is_literal) {
            // select can be called many times
            if (this.mode !== null && this.mode !== "select") {
                throw new Error("mode cannot be changed");
            }

            this.mode = "select";

            this.parts.select.push(is_literal ? literal(v) : v);

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

        },

        //
        // query composition
        //

        _getSelect: function (p) {
            return "SELECT " + p.select.map(function (v) {
                if (isLiteral(v)) {
                    return cleanLiteral(v);
                }

                return escapeId(v);
            }).join((debug ? ",\n" : ","));
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
            return "\nWHERE " +
                ((p.where.join(" AND ")) || 1) +
                (p.limit !== 0 ? (" LIMIT " + p.offset + ", " + p.limit) : "");
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
                    this._getWhere(p)
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
                if (self.options.cachekey && !err) {
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

            if (this.options.cachekey) {
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

            this.__queryCache(con, function (err, raw) {

                if (!self.root) {
                    return callback && callback(err, raw);
                }

                var result = [],
                    i,
                    max,
                    raw_agg;

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


                if (self.options.pagination) {
                    return con.query("SELECT FOUND_ROWS() AS `count`", function (err, found_rows) {
                        return callback && callback(err, result, found_rows[0].count, raw);
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

            if (isLiteral(this.parts.select[0])) {
                this.parts.select[0] = literal("SQL_CALC_FOUND_ROWS" + cleanLiteral(this.parts.select[0]));
            }

            return this;
        }
    });

    module.exports = Query;
}());