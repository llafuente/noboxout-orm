(function () {
    "use strict";

    var object = require("object-enhancements"),
        util = require("util"),
        $ = require("node-class"),
        __class = $.class,
        Connection;

    Connection = __class("norm/connection", {
        con: null,

        initialize: function(con) {
            this.con = con;
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

            log(sql, args);

            this.con.query(sql, args, function(err, result) {
                if (err) {
                    console.error(err);
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
