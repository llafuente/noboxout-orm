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

    test("check connection listeners", function (t) {
        t.equal(con.database.listeners("error").length, 2);
        t.end();
    });
    test("delete/create tables", function (t) {
        norm.sync(function () {
            t.end();
        });
    });

    test("fixtures", function (t) {

        User.$create().$store().exec(con, function(err, res) {
            console.log(err, res);

            t.end();
        });

    });


    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
        t.end();
    });

}


require("./test-common.js")(run_tests);