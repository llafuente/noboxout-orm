(function () {
    "use strict";
    require('ass');

    var util = require("util"),
        norm = require("../index.js").Norm,
        DBA = require("../index.js").DBA,
        tap = require("tap"),
        test = tap.test,
        Tag,
        User;

    var dba = new DBA();
    norm.setDBA(dba);

    test("truncate database", function (t) {
        dba.deleteAll("tags", function() {
            dba.truncate("users", function() {
                t.end();
            });
        }, true);
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

    test("define permission model", function (t) {
        Tag = norm.define("Tag", {
            id: norm.Number.LENGTH(10).ZEROFILL.UNSIGNED,
            name: norm.String.LENGTH(255),
            initialize: function () {
                this.__parent();
            }
        }, {
            prefix: "tag_",
            tableName: "tags"
        });

        t.ok(norm.models.tags !== undefined);
        t.equal(Tag.$table.fields.length, 4); // create_at + updated_at

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

        User.$hasOne(Tag, {property: "main_tag", canBeNull: true});

        t.equal(User.$table.fields.indexOf("tag_id") !== -1, true, "has user_perm_id field");
        t.equal(User.$table.structure["tag_id"].$dbtype, "integer", "fk is an integer");
        t.equal(User.prototype.main_tag !== undefined, true, "fk is an integer");

        console.log(User.$createTable());
process.exit();

        t.end();
    });


    test("create tag", function (t) {

        var p = new Tag();
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

        var admin = new User();
        admin.login = "admin";
        admin.email = "admin@admin.com";

        t.ok(admin.id === null, "pk is null before save");
        admin.$store(function() {
            t.ok(admin.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });


    test("create new user with existing tag", function (t) {
        var admin2 = new User();
        admin2.login = "admin2";
        admin2.email = "admin2@admin.com";

        Tag.$get(1, function(err, tag) {

            t.ok(tag !== null, "tag found");
            t.ok(tag.id !== null, "tag has id");
            t.ok(tag.name === "king", "tag has id");

            admin2.main_tag = tag;
            admin2.$store(function() {
                t.ok(admin2.id !== null, "user is saved");
                t.ok(admin2.main_tag.tag_id !== null, "tag_id is not null -> saved");

                User.$get(admin2.id, function(err, user, raw) {
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
        var admin = new User();
        admin.login = "admin3";
        admin.email = "admin3@admin.com";

        var tag = new Tag();
        tag.name = "3rd king";

        admin.main_tag = tag;

        admin.$store(function() {
            t.ok(admin.id !== null, "user is saved");
            t.ok(admin.main_tag.tag_id !== null, "tag_id is not null -> saved");
            t.ok(tag.tag_id !== null, "tag_id is not null -> saved");

            User.$get(admin.id, function(err, user, raw) {
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