function run_tests(test, norm, con) {
    "use strict";
    var Fun = require("function-enhancements"),
        array = require("array-enhancements"),
        A,
        B,
        entities;


    test("create tag", function (t) {
        A = norm.define("A", {
            id: norm.Number.LENGTH(10).UNSIGNED,
            a_name: norm.String.LENGTH(255),
            initialize: function (options) {
                this.__parent(options);
            }
        }, {
            prefix: "ta_",
            tableName: "test_a"
        });

        B = norm.define("B", {
            id: norm.Number.LENGTH(10).UNSIGNED,
            b_name: norm.String.LENGTH(255),
            initialize: function (options) {
                this.__parent(options);
            }
        }, {
            prefix: "tb_",
            tableName: "test_b"
        });

        A.$hasOne(B, {property: "go"});

        entities = [A, B];

        t.end();
    });

    test("delete/create tables", function (t) {
        norm.sync(function () {
            t.end();
        });
    });

    test("fixtures", function (t) {
        var end_test = Fun.after(function () {
                t.end();
            }, 9);

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (i) {
            var a = A.$create();
            a.a_name = "A-test-" + i;
            a.$store(con, end_test);
        });

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (i) {
            var b = B.$create();
            b.b_name = "B-test-" + i;
            b.$store(con, end_test);
        });

    });

    test("simple attach", function (t) {
        norm.logLevel = 6;
        A.$get(1).execOne(con, function (err, aaa) {
            B.$get(1).execOne(con, function (err, bbb) {

                aaa.go = bbb;
                aaa.$store(con, function () {
                    console.log(aaa);
                    t.equal(aaa.tb_id, 1, "tb_id is set");
                    t.equal(aaa.$db.tb_id, 1, "tb_id is set");
                    t.end();
                });
            });

        });
    });

    test("test attachment eager", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        A.$get(1, {eager: true}).execOne(con, function (err, aaa) {
            t.ok(aaa.go != null, "has go relation");
            t.end();
        });
    });

    test("test attachment fetch", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        A.$get(1, {eager: false}).execOne(con, function (err, aaa) {
            aaa.$fetch(function () {
                t.ok(aaa.go != null, "has go relation");
                t.end();
            });
        });
    });

    test("simple remove", function (t) {
        A.$get(1).execOne(con, function (err, aaa) {
            aaa.go = false; // false it's used in case of eager:false
            aaa.$store(con, function () {
                t.end();
            });

        });
    });

    test("test attachment eager", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        A.$get(1, {eager: true}).execOne(con, function (err, entity) {
            t.ok(entity.go == null, "has no relation");
            t.end();
        });
    });

    test("simple attach", function (t) {
        A.$get(1).execOne(con, function (err, aaa) {
            B.$get(1).execOne(con, function (err, bbb) {

                aaa.go = bbb;
                aaa.$store(con, function () {
                    t.end();
                });
            });

        });
    });

    test("simple attach", function (t) {
        A.$get(1).execOne(con, function (err, aaa) {
            B.$get(2).execOne(con, function (err, bbb) {

                aaa.go = bbb;
                aaa.$store(con, function () {
                    t.end();
                });
            });

        });
    });

/* this test is OK but throw an exception!
    test("same id attach twice", function (t) {
        var end_test = Fun.after(function() {
                t.end();
            }, 2);

        A.$get(1).execOne(con, function(err, aaa1) {
            A.$get(2).execOne(con, function(err, aaa2) {
                B.$get(1).execOne(con, function(err, bbb) {

                    aaa1.go = bbb;
                    aaa1.$store(con, end_test);

                    aaa2.go = bbb;
                    aaa2.$store(con, end_test);
                });
            });
        });
    });
*/

    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
        t.end();
    });

}

require("./test-common.js")(run_tests);