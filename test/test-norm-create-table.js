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

    test("complex table", function (t) {
        Session = norm.define("Session", {
            id: norm.Number.LENGTH(10).ZEROFILL.UNSIGNED,
            start_date: norm.Date.NOTNULL.DEFAULT('NOW()'),
            description: norm.TEXT,
            initialize: function () {
                this.__parent();
            }
        }, {
            prefix: "sess_",
            tableName: "sessions"
        });

        console.log(Session.$createTable());

        t.end();
    });

    test("end the process", function (t) {
        setTimeout(function() { process.exit();}, 500);
        t.end();
    });

}());