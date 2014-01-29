(function () {
    "use strict";

    var object = require("object-enhancements"),
        util = require("util"),
        $ = require("node-class"),
        __class = $.class,
        Connection;

    Connection = __class("norm/connection", {
        dbcon: null,
        norm: null,

        initialize: function(dbcon, norm) {
            this.dbcon = dbcon;
            this.norm = norm;
        },
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

            this.norm.debug(("query([" + util.inspect(sql) + "], " + util.inspect(args) + ")").yellow);

            var norm = this.norm;
            this.dbcon.query(sql, args, function(err, result) {
                if (err) {
                    norm.error(err);
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
        }
    });

    module.exports = Connection;

}());
