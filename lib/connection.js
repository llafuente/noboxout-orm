(function () {
    "use strict";

    var object = require("object-enhancements"),
        Fun = require("function-enhancements"),
        $ = require("node-class"),
        __class = $.class,
        Connection,
        Util;

        //'ER_BAD_NULL_ERROR': /(.*): Column '(.*)' cannot be null/

    Connection = __class("norm/connection", {
        "hidden database": null,
        "hidden cache": null,
        "hidden norm": null,

        initialize: function (database, cache, norm) {
            this.database = database;
            this.cache = cache;
            this.norm = norm;
        },

        //
        // cache
        //
        delCache: function (cachekey, callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required");
            }

            if (this.cache) {
                return this.cache.del(cachekey, callback);
            }
            setTimeout(callback, 0);
        },
        getCache: function (cachekey, callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required");
            }

            if (this.cache) {
                return this.cache.get(cachekey, callback);
            }

            setTimeout(callback, 0);
        },
        setCache: function (cachekey, value, lifetime, callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required");
            }

            if (this.cache) {
                this.norm.log("cache-set:", cachekey);

                return this.cache.set(cachekey, value, lifetime, callback);
            }
            setTimeout(callback, 0);
        },

        //
        // database
        //

        querys: function (sqls, args, callback) {
            if ("function" === typeof args) {
                callback = args;
                args = [];
            }

            var i,
                max = sqls.length,
                errors = [],
                results = [],
                stack_responses = function (err, result) {
                    errors.push(err);
                    results.push(result);
                    if (errors.length === max) {
                        callback && callback(errors, results);
                    }
                };

            for (i = 0; i < max; ++i) {
                this.query(sqls[i], stack_responses);
            }
        },
        query: function (sql, args, callback) {
            if (Array.isArray(sql)) {
                return this.querys(sql, args, callback);
            }

            if ("function" === typeof args) {
                callback = args;
                args = null;
            }

            this.norm.info("query:", sql, args);

            var self = this,
                norm = this.norm,
                prev_err = new Error();

            this.database.query(sql, args, function (err, result) {
                if (err) {
                    err.sql = sql;
                    err.args = args;

                    var err_list = self.database.$self.errors,
                        err_regexp = err_list[err.code] || err_list[err.code + " " + err.sqlState],
                        ov_message;
                    if (err_regexp) {
                        err.tokens = err_regexp.exec(err.message);
                        if(err.tokens) {
                            err.tokens = err.tokens.slice(1).map(function (v) {
                                // clean up neede because mysql error file is SHIT!
                                return v.replace(/['"]/g, "");
                            });
                        }
                    }

                    err.stack += "\nPrevious " + prev_err.stack;

                    err.dbMessage = err.message;

                    ov_message = norm.checkError(err.code, err.tokens);
                    if (ov_message) {
                        err.message = ov_message;
                    }

                    norm.err(err);
                }

                callback && callback(err, result);
            });
        },
        // , nestTables: true
        selectOne: function (sql, args, callback) {
            if (!callback) {
                callback = args;
                args = undefined;
            }

            this.query(sql, args, function (err, result) {
                if (!err) {
                    result = result && result[0] ? result[0] : null;
                }

                callback && callback(err, result);
            });
        },
        release: function (callback) {
            var c2 = Fun.after(callback, 2);

            this.database.release(c2);
            this.cache.release(c2);
        },

        //
        // database
        //
        __fromDatabase: function (query, callback) {
            var self = this;

            query.options.sql = query.getSql();

            this.query(query.options, function (err, dbres) {
                if (query.options.cachekey.length && !err) {
                    //manage cache
                    switch (query.mode) {
                    case "delete":
                    case "update":
                        query.options.cachekey.forEach(function (ck) {
                            self.delCache(ck, function (err) {
                                if (err) {
                                    return self.norm.err(err);
                                }
                                self.norm.info("del-cache ok!");
                            });
                        });
                        break;
                    case "select":
                        query.options.cachekey.forEach(function (ck) {
                            self.setCache(ck, dbres, 3600, function (err) {
                                if (err) {
                                    return self.norm.err(err);
                                }
                                self.norm.info("set-cache ok!");
                            });
                        });
                        break;
                    }
                }

                callback && callback(err, dbres);
            });
        },

        // handle cachekeys like priority or alternatives!?
        __fromCache: function (query, callback) {
            var self = this;

            if (query.options.cachekey.length) {
                //manage cache
                switch (query.mode) {
                case "select":
                    return self.getCache(query.options.cachekey[0], function (err, dbres) {
                        if (err || dbres === false || dbres === undefined) {
                            self.__fromDatabase(query, callback);
                        } else {
                            callback && callback(err, dbres);
                        }
                    });

                case "delete": // do nothing
                case "update": // do nothing
                }
            }

            this.__fromDatabase(query, callback);

        },

        exec: function (query, callback) {
            var self = this;
            this.__fromCache(query, function (err, raw) {

                if (!query.root || query.options.parse === false) {
                    return callback && callback(err, raw);
                }

                var result = [],
                    i,
                    max,
                    raw_agg;
                if (raw && raw.length) {
                    if (query.options.nestTables) {
                        raw_agg = Util.aggregateNested(query.root, raw);

                        for (i = 0, max = raw_agg.length; i < max; ++i) {
                            result.push(Util.parseEntity(query.root, self, raw_agg[i]));
                        }
                    }

                    // single result
                    if (query.options.result === 1) {
                        result = result[0];
                    } else {
                        // multiple results
                    }
                } else {
                    result = null;
                }


                if (query.options.pagination) {
                    return self.query("SELECT FOUND_ROWS() AS `count`", function (err, found_rows) {
                        return callback && callback(err, {data: result, total: found_rows[0].count}, raw);
                    });
                }

                return callback && callback(err, result, raw);
            });
        },
        inspect: function () { return "[Connection Class]"; }
    });

    module.exports = Connection;
    Util = require("./util.js");

}());
