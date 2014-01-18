(function () {
    "use strict";
    require('ass');

    var util = require("util"),
        norm = require("../index.js").Norm,
        DBA = require("../index.js").DBA,
        tap = require("tap"),
        test = tap.test,
        Tag,
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

    test("invalid model", function (t) {
        t.throws(function() {
            norm.define("Tag", {
                name: norm.String.LENGTH(255),
                initialize: function () {
                    this.__parent();
                }
            });
        });
        t.end();

    });

    Models = require("./test-models.js")(test);

    test("norm hasOne", function (t) {
        Models.createAll(dba, function() {
            t.end();
        });
    });


    test("create tag", function (t) {

        var p = new Models.Tag();
        p.name = "king";

        t.ok(p.id === null, "pk is null before save");
        p.$store(function () {
            t.ok(p.id !== null, "pk is not null after saving");
            t.end();
        });

    });

    test("create user", function (t) {

        //* @JoinColumn(name="container_id", referencedColumnName="id", nullable=true)

        //User.hasOne(Permission, "perm_id");

        //console.log(util.inspect(Permission, {depth: 5, colors: true}));
        //console.log(util.inspect(User, {depth: 5, colors: true}));

        var admin = new Models.User();
        admin.login = "admin";
        admin.email = "admin@admin.com";

        t.ok(admin.id === null, "pk is null before save");
        admin.$store(function() {
            t.ok(admin.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });


    test("create new user with existing tag", function (t) {
        var admin2 = new Models.User();
        admin2.login = "admin2";
        admin2.email = "admin2@admin.com";

        Models.Tag.$get(1, function(err, tag) {

            t.ok(tag !== null, "tag found");
            t.ok(tag.id !== null, "tag has id");
            t.ok(tag.name === "king", "tag has id");

            admin2.main_tag = tag;
            admin2.$store(function() {
                t.ok(admin2.id !== null, "user is saved");
                t.ok(admin2.main_tag.tag_id !== null, "tag_id is not null -> saved");

                Models.User.$get(admin2.id, function(err, user, raw) {
                    t.ok(user !== null, "there is a user");
                    t.ok(user.id !== null, "has id");
                    t.ok(user.main_tag !== null, "has main_tag");
                    t.ok(user.main_tag.id !== null, "that main_tag has id");
                    t.end();
                });
            });
        });
    });

    test("create new user with new tag", function (t) {
        var admin = new Models.User();
        admin.login = "admin3";
        admin.email = "admin3@admin.com";

        var tag = new Models.Tag();
        tag.name = "3rd king";

        admin.main_tag = tag;

        admin.$store(function() {
            t.ok(admin.id !== null, "user is saved");
            t.ok(admin.main_tag.tag_id !== null, "tag_id is not null -> saved");
            t.ok(tag.tag_id !== null, "tag_id is not null -> saved");

            Models.User.$get(admin.id, function(err, user, raw) {
                t.ok(user.id !== null, "user is saved");
                t.doesNotThrow(function() {
                    t.ok(user.main_tag.tag_id !== null, "tag_id is not null -> saved");
                    t.ok(tag.tag_id !== null, "tag_id is not null -> saved");
                }, "invalid main label");

                t.end();
            });
        });


    });

    test("create file entity", function (t) {
        t.end();
    });

    test("end the process", function (t) {
        setTimeout(function() { process.exit();}, 500);
        t.end();
    });

}());