(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        Relation = require("./relation.js"),
        DBA = require("./dba.js"),
        util = require("./util.js"),
        norm = require("./norm.js"),
        $ = require("node-class"),
        __class = $.class;

    __class("Norm/Entity", {
        extends: ["Events"],

        connection: null,

        initialize: function () {
            // set to false because
            this.__parent();
            this.$dirty = false;
            this.$constructor = false;
        },
        $changes: function () {
            norm.verbose(this.$data);
            norm.verbose(this.$db);
            return object.diff(this.$data, this.$db);
        },
        setConnection: function (con) {
            this.connection = con;
        },
        $pk: function () {
            var t = this.$self.$table;
            return this[t.primaryKey];
        },
        $store: function (con, callback) {

            switch(arguments.length) {
            case 1:
                callback = con;
                break;
            case 2:
                this.connection = con;
                break;
            }

            if (!this.connection) {
                throw new Error("connetion not specified");
            }

            util.storeEntity(this, this.connection, callback);
        },
        //inspect: function() {
        //    return object.extract(this, this.$self.properties);
        //},
        "static $create": function (con) {
            var x = new this();
            if (con) {
                x.setConnection(con);
            }
            return x;
        },
        "static $delete": function (con, id, callback) {
            var sql = DBA.delete(this.$table)
            con.query(sql, [id], callback);
        },
        "static $find": function (where) {
            var query = DBA.find(this, where);
            query.setOptions("nestTables", true);
            return query;
        },
        "static $search": function (where) {
            var query = DBA.search(this, where);
            query.setOptions("nestTables", true);
            return query;
        },
        "static $get": function (pkval, options) {
            options = options || {};
            options.eager = options.eager || 1;

            var query = DBA.selectByPK(this, pkval, options.eager);
            query.setOptions("nestTables", true);
            return query;
        },
        // internal
        "static $createTable": function () {
            var table_data = this.$table,
                fields = table_data.fields,
                create,
                alters = [],
                i,
                max,
                structure,
                sqlf = [],
                sqlk = [],
                rel,
                tableName = table_data.tableName,
                prefix = table_data.prefix;

            create = "CREATE TABLE `" + tableName + "` (\n";
            for (i = 0, max = fields.length; i < max; ++i) {
                structure = table_data.structure[fields[i]];

                sqlf.push(DBA.createField(prefix, fields[i], structure, table_data.primaryKey));

                //fields[i]
            }

            sqlk.push("    PRIMARY KEY ( " + prefix + table_data.primaryKey + " )");

            for (i = 0, max = table_data.relations.length; i < max; ++i) {
                rel = table_data.relations[i];
                rel.creation(this, sqlk, alters);
            }

            array.combine(sqlf, sqlk);

            create = create + sqlf.join(",\n") + "\n) ENGINE = InnoDB;\n";

            return [create, alters];
        },
        "static $hasOne": function (target_entity, options) {
            // edge cases
            // relation to myself, and canBeNull is true

            Relation.OneToOne(this, target_entity, options);
            return this;
        },
        "static $hasMany": function (target_entity, options) {
            Relation.OneToMany(this, target_entity, options);
            return this;
        }
    });

}());