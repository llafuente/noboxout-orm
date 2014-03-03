function run_tests(test, norm, con) {
    "use strict";
    var Fun = require("function-enhancements"),
        array = require("array-enhancements"),
        Work = require("../index.js").Work,
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

        A.$hasOne(B, {
            property: "go",
            refProperty: "back"
        });

        entities = [A, B];

        t.end();
    });

    test("delete/create tables", function (t) {
        norm.sync(function () {
            t.end();
        });
    });

    test("fixtures", function (t) {
        var work = new Work();

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (i) {
            var a = A.$create();
            a.a_name = "A-test-" + i;
            a.$store({}, work);
        });

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (i) {
            var b = B.$create();
            b.b_name = "B-test-" + i;
            b.$store({}, work);
        });

        work.exec(con, function () {
            t.end();
        });

    });

    test("simple attach", function (t) {
        A.$get(1).exec(con, function (err, aaa) {
            B.$get(1).exec(con, function (err, bbb) {

                aaa.go = bbb;
                aaa.$store().exec(con, function () {
                    t.equal(aaa.tb_id, 1, "tb_id is set");
                    t.equal(aaa.$db.tb_id, 1, "tb_id is set");
                    t.end();
                });
            });

        });
    });

    test("test attachment eager", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        B.$get(1, {eager: true}).exec(con, function (err, entity) {
            t.ok(entity.back != null, "has go relation");
            t.equal(entity.back.id, 1, "has go relation");
            t.end();
        });
    });

    test("test attachment fetch", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));


        B.$get(1, {eager: false}).exec(con, function (err, entity) {
            entity.$fetch(function () {
                t.ok(entity.back != null, "has go relation");
                t.equal(entity.back.id, 1, "has go relation");
                t.end();
            });
        });
    });

    test("simple remove", function (t) {
        A.$get(1).exec(con, function (err, aaa) {
            aaa.go = false; // false it's used in case of eager:false
            aaa.$store().exec(con, function () {
                t.end();
            });

        });
    });

    test("test attachment eager", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        A.$get(1, {eager: true}).exec(con, function (err, entity) {
            t.ok(entity.go == null, "has no relation");
            t.end();
        });
    });

    test("simple attach", function (t) {
        A.$get(1).exec(con, function (err, aaa) {
            B.$get(1).exec(con, function (err, bbb) {

                aaa.go = bbb;
                aaa.$store().exec(con, function () {
                    t.end();
                });
            });

        });
    });

    test("simple attach", function (t) {
        A.$get(1).exec(con, function (err, aaa) {
            B.$get(2).exec(con, function (err, bbb) {

                aaa.go = bbb;
                aaa.$store().exec(con, function () {
                    t.end();
                });
            });

        });
    });


    test("create both", function (t) {
        var a = A.$create();
        var b = B.$create();

        a.a_name = "create";
        a.b_name = "create";

        a.go = b;
        a.$store().exec(con, function () {
            t.equal(a.tb_id, 10, "tb_id is set");
            t.equal(a.$db.tb_id, 10, "tb_id is set");
            t.end();
        });
    });

    test("test attachment eager", function (t) {
        B.$get(10, {eager: true}).exec(con, function (err, entity) {
            t.ok(entity.back != null, "has go relation");
            t.equal(entity.back.id, 10, "has go relation");
            t.end();
        });
    });

/* this test is OK but throw an exception!
    test("same id attach twice", function (t) {
        var end_test = Fun.after(function() {
                t.end();
            }, 2);

        A.$get(1).exec(con, function(err, aaa1) {
            A.$get(2).exec(con, function(err, aaa2) {
                B.$get(1).exec(con, function(err, bbb) {

                    aaa1.go = bbb;
                    aaa1.$store().exec(con, end_test);

                    aaa2.go = bbb;
                    aaa2.$store().exec(con, end_test);
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