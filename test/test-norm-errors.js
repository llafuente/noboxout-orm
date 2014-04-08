function run_tests(test, norm, con) {
    "use strict";
    var Models,
        Fun = require("function-enhancements"),
        Work = require("../index.js").Work;

    norm.logLevel = 6;

    var User = norm.define("user", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        name: norm.String.NOTNULL.LENGTH(255),
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "us_",
        tableName: "user"
    });

    User.$unique(["name"], "uq_user_name");

    norm.registerError('ER_BAD_NULL_ERROR', [ 'us_name' ], "invalid user name");
    norm.registerError('ER_DUP_ENTRY', [ null, 'uq_user_name' ], "user name is use");

    test("check connection listeners", function (t) {
        t.equal(con.database.connection.listeners("error").length, 2);
        t.end();
    });

    test("delete/create tables", function (t) {
        norm.sync(function () {
            t.end();
        });
    });

    test("null test", function (t) {
        var work = User.$create().$store();
        work.exec(con, function(err, res) {

            t.equals(err[0].message, "invalid user name");

            t.end();
        });
    });

    test("unique test", function (t) {
        User.$create().$merge({
            name: "test-001"
        }).$store().exec(con, function(err, res) {

            User.$create().$merge({
                name: "test-001"
            }).$store().exec(con, function(err, res) {
                t.equals(err[0].message, "user in use");
            });

            t.end();
        });
    });


    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
        t.end();
    });

}


require("./test-common.js")(run_tests);