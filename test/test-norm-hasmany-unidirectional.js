function run_tests(test, norm, con) {
    "use strict";
    var Models,
        Fun = require("function-enhancements");

    Models = require("./test-models.js")(test, con);

    test("create user", function (t) {
        var user = Models.User.$create(con); // use con in constructor

        user.login = "Science Master";
        user.email = "science@university.com";

        t.ok(user.id === null, "pk is null before save");
        user.$store(function () {
            t.ok(user.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });

    test("create user", function (t) {
        var user = Models.User.$create();
        user.login = "Math Master";
        user.email = "math@university.com";

        t.ok(user.id === null, "pk is null before save");
        user.$store(con, function () { // use con when saving
            t.ok(user.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });

    test("create user", function (t) {
        var user = Models.User.$create(con);
        user.login = "Student";
        user.email = "student@university.com";

        t.ok(user.id === null, "pk is null before save");
        user.$store(function () {
            t.ok(user.$pk() !== null, "pk is not null after saving");
            t.end();
        });
    });

    test("mentors type is array", function (t) {

        Models.User.$get(con, 3, function (err, user) {
            t.deepEqual(user.mentors, [], "mentors is an array");
            t.end();
        });
    });


    test("get student and attach mentors", function (t) {
        Models.User.$get(con, 3, function (err, user) {
            Models.User.$get(con, 2, function (err, math) {
                t.deepEqual(math.mentors, [], "mentors is an array");
                Models.User.$get(con, 1, function (err, science) {
                    t.deepEqual(science.mentors, [], "mentors is an array");
                    user.addMentors(math);
                    user.addMentors(science);

                    user.$store(function () {
                        t.equal(user.mentors.length, 2, "has two mentors");
                        t.end();
                    });
                });
            });
        });
    });

    var i = 2;
    while (i--) {
        test("remove test" + i, function (t) {
            Models.User.$get(con, 3, function (err, student) {
                var removed_mentor = student.mentors[0];
                var l = student.mentors.length;
                student.removeMentors(removed_mentor);

                t.equal(student.mentors.length, l - 1, "has one mentors");

                t.equal(removed_mentor.$data.mentor_id, null, "mentor_id is set to null");

                var check_removed = Fun.after(function () {
                    Models.User.$get(con, removed_mentor.id, function (err, science) {
                        t.equal(science.$db.mentor_id, null, "science mentor_id is set to null");
                        t.equal(science.$data.mentor_id, null, "science mentor_id is set to null");

                        t.end();
                    });
                }, 2);

                removed_mentor.$store(check_removed);
                student.$store(check_removed);
            });
        });
    }
    test("get student and attach mentors", function (t) {
        Models.User.$find({login: "Math Master"}).queryOne(con, function(err, teacher) {
            t.equal(teacher.login, "Math Master", "Math!");

            t.end();
        });
    });



/*
    test("remove test", function (t) {
        Models.User.$get(3, function(err, student) {
            t.equal(student.mentors.length, 1, "has one mentors");
            var removed_mentor = student.mentors[0];
            student.removeMentors(removed_mentor);

            Models.User.$get(2, function(err, science) {
                t.equal(science.$db.mentors_id, null, "science mentor_id is set to null")
                t.equal(science.$data.mentors_id, null, "science mentor_id is set to null")

                t.end();
            });

            removed_mentor.$store();
            student.$store();

        });
    });
/*
    test("remove test", function (t) {
        Models.User.$get(3, function(err, student) {
            t.equal(student.mentors.length, 0, "has one mentors");

            Models.User.$get(2, function(err, science) {
                t.equal(science.$db.mentors_id, null, "science mentor_id is set to null")
                t.equal(science.$data.mentors_id, null, "science mentor_id is set to null")

                t.end();
            });

            student.$store();

        });
    });
*/

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
            host     : '127.0.0.1',
            user     : 'root',
            password : 'toor',
            database: "norm"
        }
    });

    test("reserve a connection", function (t) {
        norm.reserve(function(err, con) {
            run_tests(test, norm, con)
            t.end();
        });
    });
}());


