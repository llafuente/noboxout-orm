(function () {
    "use strict";

    var $ = require("node-class"),
        __class = $.class,
        Pool;

    Pool = __class("norm/Pool", {

        "abstract reserve": function (callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }
        },
        "abstract release": function (callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }
        }
    });

    module.exports = Pool;

}());
