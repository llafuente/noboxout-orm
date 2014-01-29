(function () {
    "use strict";

    var object = require("object-enhancements"),
        util = require("util"),
        mysql = require("mysql"),
        Query = require("./query.js"),
        norm,
        $ = require("node-class"),
        __class = $.class;

    module.exports = {
        escape: function (name) {
            if (!norm) {
                norm = require("./norm.js");
            }

            return norm.pool.escape(name);
        },
        escapeId: function (name) {
            return mysql.escapeId(name);
        },
        selectByPK: function (table_data, from, eager_level) {
            eager_level = eager_level || 1;

            var relations = table_data.relations,
                i,
                max,
                query = new Query();

            query.select("*", true);
            query.from(table_data.tableName, "root");

            if (eager_level === 1 && !object.empty(table_data.relations)) {
                for (i = 0, max = relations.length; i < max; ++i) {
                    relations[i].apply(query, from);
                }
            }

            query.andWhere("`root`.`" + table_data.prefix + table_data.primaryKey + "` = ?");

            return query.getSql();
        },
        use: function (database) {
            return "USE " + this.escapeId(database);
        },
        dropDatabase: function (database_name) {
            return "DROP " + this.escapeId(database_name);
        },
        dropTable: function (table_name) {
            return "DROP TABLE " + this.escapeId(table_name);
        },
        truncate: function (table_name) {
            return "TRUNCATE TABLE " + this.escapeId(table_name);
        },
        deleteAll: function (table_name, callback, reset_auto_increment) {

            var esc_table_name = this.escapeId(table_name),
                sqls = ["DELETE FROM " + esc_table_name + " WHERE 1"];
            reset_auto_increment = reset_auto_increment || false;

            if (reset_auto_increment) {
                sqls.push("ALTER TABLE " + esc_table_name + " AUTO_INCREMENT = 1");
            }

            return sqls;
        },
        find: function (table, where, limit) {
            limit = limit === undefined ? 1 : parseInt(limit);
            if (limit === 0 || isNaN(limit)) {
                norm.error("limit", limit);
                throw new Error("invalid limit parameter");
            }


            var sql_where = [],
                i;

            for (i in where) {
                sql_where = this.escapeId(i) + " = " + this.escape(where[i]);
            }

            var sql = "SELECT * FROM `" + table + "` WHERE `" + sql_where.join(" AND ");

            return sql;
        },
        insert: function (table, key, data) {
            //ok! --> obj[pk] = result.insertId
            var keys = Object.keys(data).map(this.escapeId),
                values = object.values(data).map(this.escape);

            return "INSERT INTO `" + table + "` (" + keys.join(",") + ") VALUES(" + values.join(",") + ")";
        },
        update: function (table, key, data) {
            var sets = [],
                i;

            for (i in data) {
                if (i !== key) {
                    sets.push(this.escapeId(i) + " = " + this.escape(data[i]));
                }
            }

            return "UPDATE " + this.escapeId(table) +
                " SET " + sets.join(",") +
                " WHERE " + this.escapeId(key) + " = " + this.escape(data[key]);
        },
        store: function (table, key, data, callback) {
            if (data[key] == null) { // leave double equals for now
                return this.insert(table, key, data, callback);
            }
            return this.update(table, key, data, callback);
        },
        delete: function($table) {
            return "DELETE FROM " + this.escapeId($table.tableName) +
                " WHERE " + this.escapeId($table.prefix + $table.primaryKey) + " = ?";
        }
    };

}());