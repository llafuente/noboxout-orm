(function () {
    "use strict";

    var $ = require("node-class"),
        pool = require("./pool.js"),
        __class = $.class,
        Database;

    Database = __class("norm/Database", {
        extends: ["norm/Pool"],

        stats: {
            querys: 0,
            errors: 0,
            transactions: 0
        },

        norm: null,

        initialize: function (config, norm) {
            this.norm = norm;
        },

        "abstract escape": function (string) {},

        "abstract escapeId": function (string) {},

        "abstract query": function (options, query, callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }

            if ("object" !== typeof callback && "norm/Query" === query.$class) {
                throw new Error("query must be an instance of Query");
            }
        }
    });

    module.exports = Database;

}());