module.exports = function (run_tests) {
    "use strict";
    require("ass");

    var util = require("util"),
        norm = require("../index.js").Norm,
        tap = require("tap"),
        test = tap.test;

    norm.setup({
        mysql: {
            host     : "127.0.0.1",
            user     : "travis",
            password : "",
            database: "norm_test"
        },
        memcached: {
            host: "127.0.0.1",
            port: 11211,
            config: {
                poolSize: 25
            }
        }
    });

    test("reserve a connection", function (t) {
        norm.reserve(function(err, con) {
            run_tests(test, norm, con);
            t.end();
        });
    });

};