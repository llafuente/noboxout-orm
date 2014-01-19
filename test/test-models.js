module.exports = function(test, dba) {
    "use strict";

    var norm = require("../index.js").Norm,
        Tag,
        Session,
        User,
        ret;


    Tag = norm.define("Tag", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        name: norm.String.LENGTH(255),
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "tag_",
        tableName: "tags"
    });


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



    User = norm.define("User", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        login: norm.String.LENGTH(255),
        email: norm.String.LENGTH(255),
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "user_",
        tableName: "users"
    });


    //
    // One on One - unidirectional
    //
    User.$hasOne(Tag, {
        property: "main_tag",
        canBeNull: true
    });


    //
    // One on One - bidirectional
    //
    User.$hasOne(Session, {
        property: "session",
        canBeNull: true,
        refProperty: "owner" // this makes it bidirectional
    });

    // One to Many - unidirectional
    User.$hasMany(User, {
        property: "mentor",
        fk: "mentor_id",
        canBeNull: true
    });


    test("drop tables", function (t) {
        var deleteAll = function () {
            console.log("all delete ??!!!");
            t.end();
        }.after(3);

        dba.dropTable("users", deleteAll);
        dba.dropTable("tags", deleteAll);
        dba.dropTable("session", deleteAll);
    });


    test("check models", function (t) {
        t.ok(norm.models.tags !== undefined);
        t.equal(Tag.$table.fields.length, 4); // create_at + updated_at

        t.ok(norm.models.sessions !== undefined);
        t.equal(Session.$table.fields.length, 4); // create_at + updated_at

        t.ok(norm.models.users !== undefined);
        t.equal(User.$table.fields.length, 8); // create_at + updated_at

        t.equal(User.$table.fields.indexOf("tag_id") !== -1, true, "has user_perm_id field");
        t.equal(User.$table.structure["tag_id"].$dbtype, "integer", "fk is an integer");
        t.equal(User.prototype.main_tag !== undefined, true, "fk is an integer");

        t.equal(User.$table.fields.indexOf("sess_id") !== -1, true, "has user_perm_id field");
        t.equal(User.$table.structure["sess_id"].$dbtype, "integer", "fk is an integer");
        t.equal(User.prototype.session !== undefined, true, "fk is an integer");
        t.equal(Session.prototype.owner !== undefined, true, "fk is an integer");

        t.end();
    });

    test("norm hasOne", function (t) {
        var i,
            creates = [],
            alters = [],
            x;

        for (i in ret) {
            x = ret[i].$createTable();
            creates.push(x[0]);
            Array.combine(alters, x[1]);
        }

        Array.combine(creates, alters);

        dba.querys(creates, function() {
            t.end();
        });
    });

    ret = {
        Tag: Tag,
        Session: Session,
        User: User
    };
    return ret;
};