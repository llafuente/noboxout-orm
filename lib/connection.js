(function () {
    "use strict";

    var object = require("object-enhancements"),
        $ = require("node-class"),
        __class = $.class,
        Connection,
        mysql_errors = {
            'ER_BAD_NULL_ERROR': /(.*): Column '(.*)' cannot be null/
        };



    Connection = __class("norm/connection", {
        stats: {
            cachehit: 0,
            cachemiss: 0,
            query: 0,
        },
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
            ++this.stats.query;

            var norm = this.norm;

            var prev_err = new Error();

            this.database.query(sql, args, function (err, result) {
                if (err) {
                    err.sql = sql;
                    err.args = args;

                    if (mysql_errors[err.code]) {
                        err.tokens = mysql_errors[err.code].exec(err.message).slice(2);
                    }

                    err.stack += "\nPrevious " + prev_err.stack;

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
        inspect: function () { return "[Connection Class]"; }
    });

    module.exports = Connection;

}());
