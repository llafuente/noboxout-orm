(function () {
    "use strict";

    var $ = require("node-class"),
        pool = require("./pool.js"),
        __class = $.class,
        Cache;

    Cache = __class("norm/Cache", {
        extends: ["norm/Pool"],

        stats: {
            del: 0,
            get: 0,
            set: 0,
            cachehit: 0,
            cachemiss: 0
        },

        enabled: true,

        norm: null,

        initialize: function (config, norm) {
            this.norm = norm;
        },

        //
        // cache
        //
        del: function (cachekey, callback) {
            if ("string" !== typeof cachekey) {
                throw new Error("cachekey is required and must be a string");
            }

            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }


            if (this.enabled) {
                ++this.stats.del;
                return true;
            }
            setTimeout(callback, 0);
        },
        get: function (cachekey, callback) {
            if ("string" !== typeof cachekey) {
                throw new Error("cachekey is required and must be a string");
            }

            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }


            if (this.enabled) {
                ++this.stats.get;
                return true;
            }
            setTimeout(callback, 0);
        },
        set: function (cachekey, value, lifetime, callback) {
            if ("string" !== typeof cachekey) {
                throw new Error("cachekey is required and must be a string");
            }

            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }

            if ("number" !== typeof lifetime || isNaN(lifetime)) {
                throw new Error("lifetime is required and must be a number");
            }


            if (this.enabled) {
                ++this.stats.set;
                return true;
            }

            setTimeout(callback, 0);
        }
    });

    module.exports = Cache;

}());
