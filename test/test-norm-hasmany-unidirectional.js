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

    test("mentors type is array", function (t) {

        Models.User.$get(3, function(err, user) {
            t.deepEqual(user.mentors, [], "mentors is an array");
            t.end();
        });
    });


    test("get student and attach mentors", function (t) {
        Models.User.$get(3, function(err, user) {
            Models.User.$get(2, function(err, math) {
                t.deepEqual(math.mentors, [], "mentors is an array");
                Models.User.$get(1, function(err, science) {
                    t.deepEqual(science.mentors, [], "mentors is an array");
                    user.mentors.push(math);
                    user.mentors.push(science);

                    user.$store(function() {
                        t.end();
                    });
                });
            });
        });
    });

    test("create new user with new tag", function (t) {
        Models.User.$get(3, function(err, student) {
            t.equal(student.mentors.length, 2, "has two mentors");
            t.end();
        });
    });

    test("end the process", function (t) {
        setTimeout(function() { process.exit();}, 500);
        t.end();
    });

}());


