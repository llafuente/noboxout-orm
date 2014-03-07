(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        Relation = require("./relation.js"),
        DBA = require("./dba.js"),
        util = require("./util.js"),
        norm = require("./norm.js"),
        $ = require("node-class"),
        __class = $.class;

    module.exports = __class("Norm/Work", {
        extends: ["Events"],

        sync: true,

        jobs: [],
        pending: 0,
        done: 0,
        err_count: 0,

        errors: [],
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
                if (Array.isArray(this.errors)) {
                    this.errors = {};
                    this.results = {};
                    this.raws = {};
                }

                this.errors[idx] = err || null;
                this.results[idx] = result;
                this.raws[idx] = raw;
            } else {
                this.errors.push(err || null);
                this.results.push(result);
                this.raws.push(raw);
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
        stopOnError: function (val) {
            this.stop = !!val;

            return this;
        },
        getCurrentController: function() {
            return this.current_controller;
        },
        getLastController: function() {
            return this.last_controller;
        },
        exec: function () {
            var i,
                max = arguments.length,
                args = [],
                self = this,
                stop = this.stop,
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

                        if (err && stop && end) {
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
                    return callback && callback(self.errors[0], self.results[0], self.raws[0], self);
                }

                var all_null = true;

                if (Array.isArray(self.errors)) {
                    for (i = 0, max = self.errors.length; i < max; ++i) {
                        if (self.errors[i] != null) {
                            all_null = false;
                        }
                    }
                } else {
                    for (i in self.errors) {
                        if (self.errors[i] != null) {
                            all_null = false;
                        }
                    }
                }

                callback && callback(all_null ? null : self.errors, self.results, self.raws, self);
            });

            return this;
        }
    });

}());