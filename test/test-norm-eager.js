function run_tests(test, norm, con) {
    "use strict";
    var Models,
        Fun = require("function-enhancements");


    Models = require("./test-models.js")(test, con);

    test("fixtures", function (t) {
        var finish = Fun.after(function() {
                t.end();
            }, 3),

            admin_tag,
            user_tag,
            user,
            admin,
            student;

        user_tag = Models.Tag.$create(con)
        user_tag.name = "user";

        user = Models.User.$create(con);
        user.login = "user";
        user.email = "user@web.com";
        user.main_tag = user_tag;


        user_tag.on("post:store", function() {
            console.log("** user-tag stored!");
        });
        user.on("post:store", function() {
            console.log("** user stored!");
        });

        user_tag.on("pre:insert", function() {
            console.log("** user insert!");
        });
        user.on("pre:insert", function() {
            console.log("** user insert!");
        });

        user.$store(finish);
        admin_tag = Models.Tag.$create(con)
        admin_tag.name = "admin";

        admin = Models.User.$create(con);
        admin.login = "admin";
        admin.email = "admin@web.com";
        admin.main_tag = admin_tag;
        admin.$store(finish);

        student = Models.User.$create(con);
        student.login = "student";
        student.email = "student@web.com";
        student.addMentors(admin);
        student.$store(finish);
    });

    test("get without eager and save", function (t) {
        Models.User.$get(1, {eager: false}).queryOne(con, function(err, user) {
            console.log(user);
            user.name = "modified!";
            user.$store(function() {
                t.end();
            });
        });
    });

    test("get with eager should have a main_tag!", function (t) {
        Models.User.$get(1, {eager: 1}).queryOne(con, function(err, user) {
            console.log(user);
            t.ok(user.main_tag !== null, "has main_tag");
            t.equal(user.main_tag.name, "user", "main_tag is user");
            t.end();
        });
    });

    test("remove tag without eager", function (t) {
        Models.User.$get(1, {eager: false}).queryOne(con, function(err, user) {
            console.log(user);
            user.main_tag = false;
            user.$store(function() {
                t.end();
            });
        });
    });

    test("main_tag removed & re-added", function (t) {
        Models.User.$get(1, {eager: 1}).queryOne(con, function(err, user) {
            console.log(user);
            t.ok(user.main_tag == null, "main_tag removed");
            Models.User.$get(1, {eager: false}).queryOne(con, function(err, tag) {
                user.main_tag = tag;
                user.$store();
                t.end();
            });
        });
    });

    test("user eager 2", function (t) {
        Models.User.$get(1, {eager: 2}).queryOne(con, function(err, user) {
            console.log(user);
            t.ok(user.main_tag !== null, "main_tag removed");
            t.ok(user.main_tag.owner !== null, "main_tag has owner");

            t.end();
        });
    });



    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
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