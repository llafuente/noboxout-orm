(function () {
    "use strict";
    require('ass');

    var util = require("util"),
        norm = require("../index.js").Norm,
        DBA = require("../index.js").DBA,
        tap = require("tap"),
        test = tap.test,
        Session,
        User;

    var dba = new DBA();
    norm.setDBA(dba);

    test("truncate database", function (t) {
        dba.deleteAll("sessions", function() {
            dba.truncate("users", function() {
                t.end();
            });
        }, true);
    });

    test("define permission model", function (t) {
        Session = norm.define("Session", {
            id: norm.Number.LENGTH(10).ZEROFILL.UNSIGNED,
            start_date: norm.Date.NOTNULL,
            initialize: function () {
                this.__parent();
            }
        }, {
            prefix: "sess_",
            tableName: "sessions"
        });

        t.ok(norm.models.sessions !== undefined);
        t.equal(Session.$table.fields.length, 4); // create_at + updated_at

        t.end();
    });

    test("define user model", function (t) {
        User = norm.define("User", {
            dirty: false,

            id: norm.Number.LENGTH(10).ZEROFILL.UNSIGNED,
            login: norm.String.LENGTH(255),
            email: norm.String.LENGTH(255),
            initialize: function () {
                this.__parent();
            }
        }, {
            prefix: "user_",
            tableName: "users"
        });

        t.ok(norm.models.users !== undefined);
        t.equal(User.$table.fields.length, 5); // create_at + updated_at

        t.end();
    });

    test("norm hasOne", function (t) {
        // One directional OneToOne
        //Norm.OneToOne(User, "permission", "user_perm_id", Permission, null);
        // Bi-directional directional OneToOne
        //Norm.OneToOne(User, "permission", "user_perm_id", Permission, "owner");
        //User.hasOne(Permission, /*as*/ "permission", /*in*/ "user_perm_id", {bidirectional: });

        User.$hasOne(Session, {
            property: "session",
            canBeNull: true,
            refProperty: "owner"
        });

        t.equal(User.$table.fields.indexOf("sess_id") !== -1, true, "has user_perm_id field");
        t.equal(User.$table.structure["sess_id"].$dbtype, "integer", "fk is an integer");
        t.equal(User.prototype.session !== undefined, true, "fk is an integer");
        t.equal(Session.prototype.owner !== undefined, true, "fk is an integer");

        t.end();
    });


    test("create session", function (t) {

        var p = new Session();
        p.start_date = new Date();

        t.ok(p.id === null, "pk is null before save");
        p.$store(function () {
            t.ok(p.id !== null, "pk is not null after saving");
            t.end();
        });

    });

    test("get session", function (t) {

        Session.$get(1, function(err, session, raw) {
            t.ok(session.id !== null, "session id ok");
            t.ok(session.owner === null, "has no owner");
            t.end();
        });
    });

    test("create an user an set the session", function (t) {
        Session.$get(1, function(err, session, raw) {
            var admin = new User();
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
        User.$get(1, function(err, user, raw) {
            t.ok(user.id !== null, "user stored correctly");

            t.equal(user.login, "admin", "user stored correctly");
            t.equal(user.email, "admin@admin.com", "user stored correctly");

            t.ok(user.session !== null, "pk is not null after saving");
            t.ok(user.session.id !== null, "pk is not null after saving");

            t.end();
        });
    });

    test("get session side", function (t) {

        Session.$get(1, function(err, session, raw) {

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