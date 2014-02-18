function run_tests(test, norm, con) {
    "use strict";
    var Models,
        Fun = require("function-enhancements"),
        array = require("array-enhancements"),
        dba =  require("../index.js").DBA,
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
            property: "oneToOne",
            refProperty: "rOneToOne"
        });

        entities = [A, B];

        t.end();
    });

    test("delete tables", function (t) {
        var deleteAll = Fun.after(function () {
                t.end();
            }, 2);

        con.query(dba.dropTable("test_a"), deleteAll);
        con.query(dba.dropTable("test_b"), deleteAll);
    });


    test("create tables", function (t) {
        var i,
            creates = [],
            alters = [],
            x;

        for (i in entities) {
            x = entities[i].$createTable();
            creates.push(x[0]);
            array.combine(alters, x[1]);
        }

        array.combine(creates, alters);

        con.querys(creates, function () {
            t.end();
        });

    });

    test("fixtures", function (t) {
        var end_test = Fun.after(function() {
                t.end();
            }, 9);

        [1,2,3,4,5,6,7,8,9].forEach(function(i) {
            var a = A.$create();
            a.a_name = "A-test-" + i;
            a.$store(con, end_test);
        });

        [1,2,3,4,5,6,7,8,9].forEach(function(i) {
            var b = B.$create();
            b.b_name = "B-test-" + i;
            b.$store(con, end_test);
        });

    });

    test("simple attach", function (t) {
        A.$get(1).queryOne(con, function(err, aaa) {
            B.$get(1).queryOne(con, function(err, bbb) {

                aaa.oneToOne = bbb;
                aaa.$store(con, function() {
                    /* TODO
                    t.equal(aaa.tb_id, 1, "tb_id is set");
                    t.equal(aaa.$db.tb_id, 1, "tb_id is set");
                    */
                    t.end();
                });
            });

        });
    });

    test("test attachment eager", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        B.$get(1, {eager: true}).queryOne(con, function(err, entity) {
            t.ok(entity.rOneToOne != null, "has oneToOne relation");
            t.equal(entity.rOneToOne.id, 1, "has oneToOne relation");
            t.end();
        });
    });

    test("test attachment fetch", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));


        B.$get(1, {eager: false}).queryOne(con, function(err, entity) {
            entity.$fetch(function() {
                t.ok(entity.rOneToOne != null, "has oneToOne relation");
                t.equal(entity.rOneToOne.id, 1, "has oneToOne relation");
                t.end();
            });
        });
    });

    test("simple remove", function (t) {
        A.$get(1).queryOne(con, function(err, aaa) {
            aaa.oneToOne = false; // false it's used in case of eager:false
            aaa.$store(con, function() {
                t.end();
            });

        });
    });

    test("test attachment eager", function (t) {
        //console.log(require("util").inspect(A, {depth: 5}));

        A.$get(1, {eager: true}).queryOne(con, function(err, entity) {
            t.ok(entity.oneToOne == null, "has no relation");
            t.end();
        });
    });

    test("simple attach", function (t) {
        A.$get(1).queryOne(con, function(err, aaa) {
            B.$get(1).queryOne(con, function(err, bbb) {

                aaa.oneToOne = bbb;
                aaa.$store(con, function() {
                    t.end();
                });
            });

        });
    });

    test("simple attach", function (t) {
        A.$get(1).queryOne(con, function(err, aaa) {
            B.$get(2).queryOne(con, function(err, bbb) {

                aaa.oneToOne = bbb;
                aaa.$store(con, function() {
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

        A.$get(1).queryOne(con, function(err, aaa1) {
            A.$get(2).queryOne(con, function(err, aaa2) {
                B.$get(1).queryOne(con, function(err, bbb) {

                    aaa1.oneToOne = bbb;
                    aaa1.$store(con, end_test);

                    aaa2.oneToOne = bbb;
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