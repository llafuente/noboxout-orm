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

    Models = require("./test-models.js")(test, dba);

    test("create user", function (t) {
        var user = new Models.User();
        user.login = "Science Master";
        user.email = "science@university.com";

        t.ok(user.id === null, "pk is null before save");
        user.$store(function() {
            t.ok(user.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });

    test("create user", function (t) {
        var user = new Models.User();
        user.login = "Math Master";
        user.email = "math@university.com";

        t.ok(user.id === null, "pk is null before save");
        user.$store(function() {
            t.ok(user.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });

    test("create user", function (t) {
        var user = new Models.User();
        user.login = "Student";
        user.email = "student@university.com";

        t.ok(user.id === null, "pk is null before save");
        user.$store(function() {
            t.ok(user.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });


    test("get student and attach mentors", function (t) {

        Models.User.$get(3, function(err, user) {
            Models.User.$get(2, function(err, math) {
                Models.User.$get(1, function(err, science) {
                    user.mentors.push(math);
                    user.mentors.push(science);
                    log(user);

                    user.$store();
                    process.exit();
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