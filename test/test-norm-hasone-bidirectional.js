function run_tests(test, norm, con) {
    "use strict";
    var Models;

    Models = require("./test-models.js")(test, con);

    test("create session", function (t) {

        var p = Models.Session.$create(con);
        p.start_date = new Date();

        t.ok(p.id === null, "pk is null before save");
        p.$store(function () {
            t.ok(p.id !== null, "pk is not null after saving");
            t.end();
        });

    });

    test("get session", function (t) {

        Models.Session.$get(con, 1, function (err, session) {
            t.ok(session.id !== null, "session id ok");
            t.ok(session.owner === null, "has no owner");
            t.end();
        });
    });

    test("create an user an set the session", function (t) {
        Models.Session.$get(con, 1, function (err, session) {
            var admin = Models.User.$create(con);
            admin.login = "admin";
            admin.email = "admin@admin.com";

            admin.session = session;

            t.ok(admin.id === null, "pk is null before save");
            admin.$store(function () {
                t.ok(admin.$pk() !== null, "pk is not null after saving");
                t.end();
            });

            t.end();
        });
    });


    test("get user side", function (t) {
        Models.User.$get(con, 1, function (err, user) {
            t.ok(user.id !== null, "user stored correctly");

            t.equal(user.login, "admin", "user stored correctly");
            t.equal(user.email, "admin@admin.com", "user stored correctly");

            t.ok(user.session !== null, "pk is not null after saving");
            t.ok(user.session.id !== null, "pk is not null after saving");

            t.end();
        });
    });

    test("get session side", function (t) {

        Models.Session.$get(con, 1, function (err, session) {

            t.ok(session.id !== null, "user stored correctly");

            t.ok(session.owner !== null, "pk is not null after saving");
            t.ok(session.owner.id !== null, "pk is not null after saving");
            t.equal(session.owner.login, "admin", "user stored correctly");
            t.equal(session.owner.email, "admin@admin.com", "user stored correctly");


            t.end();
        });
    });

    test("end the process", function (t) {
        setTimeout(function () { process.exit() ; }, 500);
        t.end();
    });
}


(function () {
    "use strict";
    require("ass");

    var util = require("util"),
        norm = require("../index.js").Norm,
        tap = require("tap"),
        test = tap.test;

    norm.setup({
        mysql: {
            host     : "127.0.0.1",
            user     : "root",
            password : "toor",
            database: "norm"
        }
    });

    test("reserve a connection", function (t) {
        norm.reserve(function(err, con) {
            run_tests(test, norm, con);
            t.end();
        });
    });

}());