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

    var Tag = norm.define("tag", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        name: norm.String.NOTNULL.LENGTH(255),
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "tg_",
        tableName: "tag"
    });

    User.$unique(["name"], "uq_user_name");

    norm.registerError('ER_BAD_NULL_ERROR', [ 'us_name' ], "invalid user name");
    norm.registerError('ER_BAD_NULL_ERROR', [ 'tg_name' ], "invalid tag name");
    norm.registerError('ER_DUP_ENTRY', [ null, 'uq_user_name' ], "user name is use");

    User.$hasOne(Tag, {
        nullable: true
    });

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

            t.equals(err.message, "invalid user name");

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
                t.equals(err.message, "user in use");
            });

            t.end();
        });
    });

    test("subentity error test", function (t) {
        var user = User.$create()

        user.tag = Tag.$create();

        user.$store().exec(con, function(err, res) {

            t.equals(err.message, "invalid tag name");

            t.end();
        });
    });


    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
        t.end();
    });

}


require("./test-common.js")(run_tests);