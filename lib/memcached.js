(function () {
    "use strict";

    var object = require("object-enhancements"),
        $ = require("node-class"),
        cachebase = require("./cache.js"),
        Memcached = require("memcached"),
        BSON = require("bson").pure().BSON,
        __class = $.class,
        CacheBase;

    CacheBase = __class("norm/CacheMemcached", {
        extends: ["norm/Cache"],

        manager: null,

        initialize: function (config, norm) {
            this.__parent(config, norm);

            object.extend(Memcached.config, config);
            this.manager = new Memcached(Memcached.config.host + ":" + Memcached.config.port, {});
        },

        //
        // pool
        //
        reserve: function (callback) {
            callback && callback(null, this);
        },

        release: function (callback) {
            callback && callback(null, this);
        },

        //
        // cache
        //
        del: function (cachekey, callback) {
            if (this.__parent(cachekey, callback)) {
                var self = this;
                this.norm.info("» cache-del:", cachekey);

                return this.manager.del(cachekey, function (err, result) {
                    self.norm.info("« cache-del:", cachekey);

                    callback && callback(err, result);
                });
            }
        },
        get: function (cachekey, callback) {
            if (this.__parent(cachekey, callback)) {
                var self = this;
                this.norm.info("» cache-get:", cachekey);

                return this.manager.get(cachekey, function (err, result) {
                    if (result === undefined || result === false) {
                        self.norm.info("« cache-miss:", cachekey);
                        ++self.stats.cachemiss;
                    } else {
                        self.norm.info("« cache-hit:", cachekey);
                        ++self.stats.cachehit;

                        result = BSON.deserialize(result).value;
                    }

                    callback && callback(err, result);
                });
            }
        },
        set: function (cachekey, value, lifetime, callback) {
            if (this.__parent(cachekey, value, lifetime, callback)) {
                return this.manager.set(cachekey, BSON.serialize({value: value}), lifetime, callback);
            }
        }
    });

    module.exports = CacheBase;

}());
