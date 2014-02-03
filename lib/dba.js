(function () {
    "use strict";

    var object = require("object-enhancements"),
        mysql = require("mysql"),
        Query = require("./query.js"),
        norm;

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
        selectByPK: function (entity, pkval, options) {
            options.eager = options.eager === undefined ? 1 : options.eager;

            var $table = entity.$table,
                relations = $table.relations,
                i,
                max,
                query = new Query();

            query.setRoot(entity);

            query.select("*", true);
            query.from($table.tableName, "root");

            if (options.eager !== false && !object.empty($table.relations)) {
                for (i = 0, max = relations.length; i < max; ++i) {
                    relations[i].apply(query, entity);
                }
            }

            query.andWhere("`root`.`" + $table.prefix + $table.primaryKey + "` = " + this.escape(pkval));

            return query;
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
        search: function(entity, where) {
            var query = new Query(),
                i,
                $table = entity.$table,
                needle;

            query.setRoot(entity);

            query.select("*", true);
            query.from($table.tableName, "root");

            for (i in where) {
            norm.verbose(i);
            norm.verbose($table.structure[i].$dbtype);

                needle = where[i];
                if (["varchar", "char", "text"].indexOf($table.structure[i].$dbtype) > -1) {
                    if (needle.indexOf("%") === -1) {
                        needle = "%" + needle + "%";
                    }
                    query.andWhere("`root`." + this.escapeId($table.prefix + i) + " LIKE " + this.escape(needle));
                } else {
                    query.andWhere("`root`." + this.escapeId($table.prefix + i) + " = " + this.escape(needle));
                }
            }

            return query;
        },
        find: function (entity, where) {
            var query = new Query(),
                i,
                $table = entity.$table;

            query.setRoot(entity);

            query.select("*", true);
            query.from($table.tableName, "root");

            for (i in where) {
                query.andWhere("`root`." + this.escapeId($table.prefix + i) + " = " + this.escape(where[i]));
            }

            return query;
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
        delete: function ($table) {
            return "DELETE FROM " + this.escapeId($table.tableName) +
                " WHERE " + this.escapeId($table.prefix + $table.primaryKey) + " = ?";
        },
        createField: function (prefix, field_name, options, pk) {
            var field = "    `" + prefix + field_name + "` ";

            switch (options.$dbtype) {
                case "integer":
                    field += options.$dbtype.toUpperCase() + "(" + options.length + ")";
                    if (options.zerofill) {
                        field += " ZEROFILL";
                    }
                    if (options.unsigned) {
                        field += " UNSIGNED";
                    }
                    break;
                case "varchar":
                    field += options.$dbtype.toUpperCase() + "(" + options.length + ")";
                    break;
                case "binary":
                    field += "CHAR (" + options.length + ") BINARY";
                    break;
                case "enum":
                    field += options.$dbtype.toUpperCase() + "('" + options.values.join("','") + "')";
                    break;
                default:
                field += options.$dbtype.toUpperCase();

            }
            if (pk === field_name) {
                field += " AUTO_INCREMENT";
            }
            if (options.default) {
                field += " DEFAULT " + this.escape(options.default);
            }
            /*
            if (options.charset) {
                field += " CHARACTER SET " + options.charset;
            }
            if (options.collation) {
                field += " COLLATE " + options.collation;
            }
            */

            return field;
        }
    };

}());