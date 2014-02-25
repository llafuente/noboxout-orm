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

        A.$hasMany(B, {
            property: "go",
            refProperty: "back",
            unique: false
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
        A.$get(1).execOne(con, function (err, a) {
            B.$get(1).execOne(con, function (err, b1) {
                B.$get(2).execOne(con, function (err, b2) {

                    a.addGo(b1);
                    a.addGo(b2);

                    a.$store(con, function () {
                        t.equal(b1.ta_id, 1, "tb_id is set");
                        t.equal(b1.$db.ta_id, 1, "tb_id is set");

                        t.equal(b2.ta_id, 1, "tb_id is set");
                        t.equal(b2.$db.ta_id, 1, "tb_id is set");
                        t.end();
                    });
                });
            });

        });
    });
    
    test("test attachment eager", function (t) {
        A.$get(1, {eager: true}).execOne(con, function (err, entity) {


            t.ok(entity.go != null, "go != null");
            t.equal(entity.go.length, 2, "go is an array with length");
            t.equal(entity.go[0].id, 1, "first one is 1");
            t.equal(entity.go[1].id, 2, "second one is 2");
            t.end();
        });
    });


    test("test attachment fetch", function (t) {
        A.$get(1, {eager: false}).execOne(con, function (err, entity) {
            entity.$fetch(function () {
                t.ok(entity.go != null, "go != null");
                t.equal(entity.go.length, 2, "go is an array with length");
                t.equal(entity.go[0].id, 1, "first one is 1");
                t.equal(entity.go[1].id, 2, "second one is 2");
                t.end();
            });
        });
    });

    test("simple remove", function (t) {
        A.$get(1, {eager: true}).execOne(con, function (err, entity) {
            var b = entity.go[1];
            entity.removeGo(entity.go[1]);
            b.$store(con, function () {
                t.end();
            });

        });
    });

    test("test attachment fetch", function (t) {
        A.$get(1, {eager: false}).execOne(con, function (err, entity) {
            entity.$fetch(function () {
                t.ok(entity.go != null, "go != null");
                t.equal(entity.go.length, 1, "go is an array with length");
                t.equal(entity.go[0].id, 1, "first one is 1");
                t.end();
            });
        });
    });

    test("test back fetch", function (t) {
        norm.logLevel = 6;

        B.$get(1, {eager: true}).execOne(con, function (err, entity) {
            console.log(entity);

            t.ok(entity.back != null, "has oneToOne relation");
            t.equal(entity.back.id, 1, "has oneToOne relation");
            t.end();
        });
    });
    


    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
        t.end();
    });

}

require("./test-common.js")(run_tests);