function run_tests(test, norm, con) {
    "use strict";
    var Models,
        Fun = require("function-enhancements"),
        object = require("object-enhancements"),
        Work = require("../index.js").Work,
        stats = {
            database: null,
            cache: null
        };


    Models = require("./test-models.js")(test, con);

    norm.logLevel = 5;

    test("create user", function (t) {

        var user1 = Models.User.$create(),
            user2 = Models.User.$create(),
            user3 = Models.User.$create(),
            user4 = Models.User.$create(),
            user5 = Models.User.$create(),
            work = new Work();

        user1.login = "user1";
        user1.email = "user1@test.com";
        user1.$store({}, work);

        user2.login = "user2";
        user2.email = "user2@test.com";
        user2.$store({}, work);


        user3.login = "user3";
        user3.email = "user3@test.com";
        user3.$store({}, work);

        user4.login = "user4";
        user4.email = "user4@test.com";
        user4.$store({}, work);

        user5.login = "user5";
        user5.email = "user5@test.com";
        user5.$store({}, work);


        work.exec(con, function () {
            t.end();
        });
    });

    test("retrieve user1", function (t) {
        stats.database = object.clone(con.database.stats);
        stats.cache = object.clone(con.cache.stats);


        Models.User.$get(1, {eager: false}).exec(con, function (err, user) {

            t.equal(con.database.stats.querys, stats.database.querys + 1, "querys");
            t.equal(con.cache.stats.cachehit, stats.cache.cachehit, "cachehit");
            t.equal(con.cache.stats.cachemiss, stats.cache.cachemiss + 1, "cachemiss");

            t.ok(user.id !== null, "user is not null");
            t.end();
        });
    });

    // echo -e "set xUser:1 xxx\nquit" | nc localhost 11211;
    // echo -e "get xUser:1\nquit" | nc localhost 11211;

    test("retrieve again user1", function (t) {
        Models.User.$get(1, {eager: false}).exec(con, function (err, user) {
            t.equal(con.database.stats.querys, stats.database.querys + 1, "querys");
            t.equal(con.cache.stats.cachehit, stats.cache.cachehit + 1, "cachehit");
            t.equal(con.cache.stats.cachemiss, stats.cache.cachemiss + 1, "cachemiss");

            t.ok(user.id !== null, "user is not null");
            t.end();
        });
    });

    test("end the process", function (t) {
        setTimeout(function () { process.exit(); }, 500);
        t.end();
    });

}

require("./test-common.js")(run_tests);