(function () {
    "use strict";
    require('ass');

    var util = require("util"),
        norm = require("../index.js").Norm,
        DBA = require("../index.js").DBA,
        tap = require("tap"),
        test = tap.test,
        Session,
        User,
        Models;

    var dba = new DBA();
    norm.setDBA(dba);

    test("drop tables", function (t) {
        dba.dropTable("users", function() {
            dba.dropTable("tags", function() {
                dba.dropTable("session", function() {
                    t.end();
                });
            });
        });
    });

    Models = require("./test-models.js")(test);

    test("norm hasOne", function (t) {
        Models.createAll(dba, function() {
            t.end();
        });
    });


    test("create session", function (t) {

        var p = new Models.Session();
        p.start_date = new Date();

        t.ok(p.id === null, "pk is null before save");
        p.$store(function () {
            t.ok(p.id !== null, "pk is not null after saving");
            t.end();
        });

    });

    test("get session", function (t) {

        Models.Session.$get(1, function(err, session, raw) {
            t.ok(session.id !== null, "session id ok");
            t.ok(session.owner === null, "has no owner");
            t.end();
        });
    });

    test("create an user an set the session", function (t) {
        Models.Session.$get(1, function(err, session, raw) {
            var admin = new Models.User();
            admin.login = "admin";
            admin.email = "admin@admin.com";

            admin.session = session;

            t.ok(admin.id === null, "pk is null before save");
            admin.$store(function() {
                t.ok(admin.$pk() !== null, "pk is not null after saving");
                t.end();
            });

            t.end();
        });
    });


    test("get user side", function (t) {
        Models.User.$get(1, function(err, user, raw) {
            t.ok(user.id !== null, "user stored correctly");

            t.equal(user.login, "admin", "user stored correctly");
            t.equal(user.email, "admin@admin.com", "user stored correctly");

            t.ok(user.session !== null, "pk is not null after saving");
            t.ok(user.session.id !== null, "pk is not null after saving");

            t.end();
        });
    });

    test("get session side", function (t) {

        Models.Session.$get(1, function(err, session, raw) {

            t.ok(session.id !== null, "user stored correctly");

            t.ok(session.owner !== null, "pk is not null after saving");
            t.ok(session.owner.id !== null, "pk is not null after saving");
            t.equal(session.owner.login, "admin", "user stored correctly");
            t.equal(session.owner.email, "admin@admin.com", "user stored correctly");


            t.end();
        });
    });

    test("end the process", function (t) {
        setTimeout(function() { process.exit();}, 500);
        t.end();
    });

}());