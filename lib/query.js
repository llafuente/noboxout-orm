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
        options: {},
        root: null,
        cachekey: null,

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
            this.options[key] = value;
        },

        "static eq": function(k, v) {
            return escapeId(k) + " = " + escapeVal(v, false, 'local');

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
        andSelect: function(v, is_literal) {
            // select can be called many times
            if (this.mode !== null && this.mode !== "select") {
                throw new Error("mode cannot be changed");
            }

            this.mode = "select";

            this.parts.select.push(is_literal ? literal(v) : v);

            return this;
        },
        delete: function() {
            if (this.mode !== null) {
                throw new Error("mode cannot be changed");
            }

            this.mode = "delete";

            return this;
        },
        update: function() {
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
        set: function(k, v) {
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
        _getDelete: function() {
            return "DELETE ";
        },
        _getUpdate: function() {
            return "UPDATE ";
        },
        _getSet: function() {

            return "\nSET " + this.parts.set.map(function(v) {
                return escapeId(v[0]) + " = " + escapeVal(v[1]);
            }).join(", ");
        },
        _getFrom: function (p) {
            switch(this.mode) {
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

            switch(this.mode) {
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
            this.cachekey = [key + (Buffer.isBuffer(concat) ? concat.toString("hex") : (concat || ""))];

            return this;
        },
        addCacheKey: function(key, concat) {
            var ck = key + (Buffer.isBuffer(concat) ? concat.toString("hex") : (concat || ""));
            if (Array.isArray(this.cachekey)) {
                this.cachekey.push(ck);
            } else {
                this.cachekey = [ck];
            }

            return this;
        },


        //
        // database
        //
        __queryDB: function(con, callback) {
            var self = this;

            con.query(this.options, function (err, dbres) {
                if (self.cachekey && !err) {
                    //manage cache
                    switch (self.mode) {
                    case "delete":
                    case "update":
                        self.cachekey.forEach(function(ck) {
                            con.delCache(ck, function(err) {
                                if (err) {
                                    return norm.err(err);
                                }
                                norm.info("del-cache ok!");
                            });
                        });
                        break;
                    case "select":
                        self.cachekey.forEach(function(ck) {
                            con.setCache(self.cachekey, dbres, 3600, function(err) {
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
        __queryCache: function(con, callback) {
            this.options.sql = this.getSql();

            var self = this;

            if (this.cachekey) {
                //manage cache
                switch (this.mode) {
                case "select":
                    return con.getCache(this.cachekey[0], function (err, dbres) {
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
        queryOne: function (con, callback) {
            if (!con || con.$class !== "norm/connection") {
                throw new Error("invalid connection argument");
            }

            var self = this;

            // this cause oneToMany to fail!
            // this.limit(1);

            this.__queryCache(con, function(err, dbres) {

                if (!self.root) {
                    return callback && callback(err, (dbres && dbres.length === 1) ? dbres[0] : dbres);
                }

                var entity,
                    result;

                result = util.aggregateNested(self.root, dbres);
                if (!result) {
                    entity = null;
                } else {
                    entity = util.parseEntity(self.root, con, result[0]);
                }

                callback && callback(err, entity, result);
            });

            return this;
        },
        query: function (con, callback) {
            if (con.$class !== "norm/connection") {
                throw new Error("invalid connection argument");
            }

            var self = this;

            this.__queryCache(con, function(err, dbres) {

                if (!self.root) {
                    return callback && callback(err, dbres);
                }

                var result,
                    i,
                    max,
                    entity,
                    entities = [];


                // this part has some problems... i'm sure
                if (self.options.nestTables && dbres.length > 1) {
                    result = util.aggregateNested(self.root, dbres);
                    entity = util.parseEntity(self.root, con, result);

                    callback && callback(err, entity, result);
                } else {
                    for (i = 0, max = dbres.length; i < max; ++i) {
                        entities.push(util.parseEntity(self.root, con, dbres[i]));
                    }
                    callback && callback(err, entities, result);
                }
            });

            return this;
        },
        queryPaging: function(offset, limit, con, callback) {
            var s;

            this.limit(limit);
            this.offset(offset);

            if (isLiteral(this.parts.select[0])) {
                this.parts.select[0] = literal("SQL_CALC_FOUND_ROWS" + cleanLiteral(this.parts.select[0]));
            }

            this.query(con, function(err, result, result_raw) {
                if (err) {
                    return callback && callback(err, result, result_raw);
                }

                con.query("SELECT FOUND_ROWS() AS `count`", function(err, found_rows) {
                    return callback && callback(err, result, found_rows[0].count, result_raw);
                });
            });
        }
    });

    module.exports = Query;
}());