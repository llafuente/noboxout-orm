(function () {
    "use strict";

    var array = require("array-enhancements"),
        $ = require("node-class"),
        __class = $.class;

    module.exports = __class("Norm/Work", {
        extends: ["Events"],

        sync: true,

        jobs: [],
        pending: 0,
        done: 0,
        err_count: 0,

        results: [],
        raws: [],

        lastError: null,
        lastResult: null,
        lastRaw: null,

        last_controller: null,
        current_controller: null,

        initialize: function (options) {
            this.__parent(options);
        },
        push: function (work, callback, name, controller) {
            this.jobs.push([work, callback, name, controller]);
            ++this.pending;

            this.last_controller = controller;

            return this;
        },
        hasErrors: function () {
            return this.err_count > 0;
        },
        pushResult: function (idx, err, result, raw) {
            ++this.done;

            if (err) {
                ++this.err_count;
            }

            if (idx) {
                if (Array.isArray(this.results)) {
                    this.results = {};
                    this.raws = {};
                }
            } else {
                idx = this.results.length;
            }

            // this logic fail, with undefined keys
            // but at least not crash
            // review Util.getEntity, with get_options.name
            if (idx !== undefined) {
                this.results[idx] = result;
                this.raws[idx] = raw;
            }

            this.lastError = err;
            this.lastResult = result;
            this.lastRaw = raw;

            return this;
        },
        progress: function () {
            return this.done / this.jobs.length;
        },
        getResult: function (idx) {
            return idx === undefined ? this.results : this.results[idx];
        },
        getCurrentController: function () {
            return this.current_controller;
        },
        getLastController: function () {
            return this.last_controller;
        },
        exec: function () {
            var i,
                max = arguments.length,
                args = [],
                self = this,
                callback;

            for (i = 0; i < max; ++i) {
                args.push(arguments[i]);
            }

            --max;
            callback = args.pop();

            if ("function" !== typeof callback) {
                throw new Error("no callback specified!");
            }

            if (!this.jobs.length) {
                return callback && callback(null, null, null, self);
            }

            array.mapSerial(this.jobs, function (v, k, next, end) {
                var cbk = function (err, result, raw) {
                        self.pushResult(v[2], err, result, raw);

                        if ("function" === typeof v[1]) {
                            v[1](err, result);
                        }

                        if (err && end) {
                            return end(result, v[2]);
                        }


                        next(result, v[2]);
                    };

                self.current_controller = v[2];

                switch (max) {
                case 0:
                    v[0](cbk, self);
                    break;
                case 1:
                    v[0](args[0], cbk, self);
                    break;
                case 2:
                    v[0](args[0], args[1], cbk, self);
                    break;
                case 3:
                    v[0](args[0], args[1], args[2], cbk, self);
                    break;
                default:
                    v[0].apply(null, args.concat([cbk, self]));
                    break;
                }

            }, function () {
                if (self.results.length === 1) {
                    return callback && callback(self.lastError, self.lastResult, self.lastRaw, self);
                }

                var all_null = true,
                    i;

                callback && callback(self.lastError, self.results, self.raws, self);
            });

            return this;
        }
    });

}());