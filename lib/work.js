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
        errors: [],
        err_count: 0,
        results: [],
        done: 0,

        initialize: function (options) {
            this.__parent(options);
        },
        push: function (work, callback, name) {
            this.jobs.push([work, callback, name]);

            return this;
        },
        hasErrors: function () {
            return this.err_count > 0;
        },
        pushResult: function (idx, err, result) {
            ++this.done;

            if (err) {
                ++this.err_count;
            }

            if (idx) {
                if (Array.isArray(this.errors)) {
                    this.errors = {};
                    this.results = {};
                }

                this.errors[idx] = err || null;
                this.results[idx] = result;
            } else {
                this.errors.push(err || null);
                this.results.push(result);
            }

            return this;
        },
        progress: function () {
            return this.jobs.length / this.done;
        },
        getResult: function (idx) {
            return idx === undefined ? this.results : this.results[idx];
        },
        stopOnError: function (val) {
            this.stop = !!val;

            return this;
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

            array.mapSerial(this.jobs, function (v, k, next, end) {
                var cbk = function (err, result) {
                    self.pushResult(v[2], err, result);

                    if ("function" === typeof v[1]) {
                        v[1](err, result);
                    }

                    if (err && stop && end) {
                        return end(result, v[2]);
                    }


                    next(result, v[2]);

                };
                switch (max) {
                case 0:
                    v[0](cbk);
                    break;
                case 1:
                    v[0](args[0], cbk);
                    break;
                case 2:
                    v[0](args[0], args[1], cbk);
                    break;
                case 3:
                    v[0](args[0], args[1], args[2], cbk);
                    break;
                default:
                    v[0].apply(null, args.concat(cbk));
                    break;
                }


            }, function () {
                if (self.results.length === 1) {
                    return callback && callback(self.errors[0], self.results[0], self);
                }
                callback && callback(self.errors, self.results, self);
            });

            return this;
        }
    });

}());