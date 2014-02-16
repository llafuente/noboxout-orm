(function () {
    "use strict";

    var object = require("object-enhancements"),
        $ = require("node-class"),
        __class = $.class,
        Connection;

    Connection = __class("norm/connection", {
        stats: {
            cachehit: 0,
            cachemiss: 0,
            query: 0,
        },
        "hidden database": null,
        "hidden cache": null,
        "hidden norm": null,

        initialize: function(database, cache, norm) {
            this.database = database;
            this.cache = cache;
            this.norm = norm;
        },

        //
        // cache
        //
        delCache: function(cachekey, callback) {
            if (this.cache) {
                this.norm.log("cache-del:", cachekey);

                this.cache.del(cachekey, callback);                
            } else {
                setTimeout(callback, 0);
            }
        },
        getCache: function(cachekey, callback) {
            if (this.cache) {
                var self = this;
                this.norm.log("cache-get:", cachekey);

                this.cache.get(cachekey, function(err, result) {
                    if (result === undefined || result === false) {
                        self.norm.log("cache-miss:", cachekey);
                        ++self.stats.cachemiss;
                    } else {
                        self.norm.log("cache-hit:", cachekey);
                        ++self.stats.cachehit;

                        result = JSON.parse(result);
                    }
                    
                    callback && callback(err, result);
                });
            } else {
                setTimeout(callback, 0);
            }            
        },
        setCache: function(cachekey, value, lifetime, callback) {
            if (this.cache) {
                this.norm.log("cache-set:", cachekey);

                this.cache.set(cachekey, JSON.stringify(value), lifetime, callback);
            } else {
                setTimeout(callback, 0);
            }            
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
            this.database.query(sql, args, function(err, result) {
                if (err) {
                    err.sql = sql;
                    err.args = args;
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
        inspect: function() { return "[Connection Class]"; }
    });

//console.log(Connection.$$);
//process.exit();
    module.exports = Connection;

}());
