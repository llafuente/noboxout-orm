(function () {
    "use strict";
    require("ass");

    var util = require("util"),
        norm = require("../index.js").Norm,
        Work = require("../index.js").Work,
        tap = require("tap"),
        test = tap.test;

    test("work #1", function (t) {
        var i = 0,
            w = new Work();

        w.push(function(done) {
            i = 10;
            done();
        });

        w.exec(function() {
            t.equal(i, 10);
            t.end();
        });
    });

    test("work #2 error", function (t) {
        var i = 0,
            w = new Work();

        w.push(function(done) {
            i = 10;
            done("err", null);
        });

        w.exec(function(errors, results, work) {
            t.equal(i, 10);
            t.deepEqual(errors, ["err"]);
            t.deepEqual(results, [null]);
            t.ok(w.hasErrors());
            t.end();
        });
    });

    test("work #keyed work", function (t) {
        var i = 0,
            w = new Work();

        w.push(function(done) {
            i = 10;
            done("err", null);
        }, null, "keyone");

        w.exec(function(errors, results, work) {
            console.log(arguments);
            t.equal(i, 10);
            t.deepEqual(errors, {keyone: "err"});
            t.deepEqual(results, {keyone: null});
            t.ok(w.hasErrors());
            t.end();
        });
    });


    test("work #arguments test", function (t) {
        var i = 0,
            w = new Work();

        w.push(function (int, arr, done) {
            t.equal(typeof int, "number");
            t.equal(typeof arr, "object");
            i = 10;
            done(null, "ok!");
        }, function (){
            i += 10;
        });

        w.exec(10, [], function(errors, results, work) {
            console.log(arguments);
            t.equal(i, 20);
            t.deepEqual(errors, [null]);
            t.deepEqual(results, ["ok!"]);
            t.end();
        });
    });


}());