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

            return norm.databasePool.escape(name);
        },
        escapeId: function (name) {
            return mysql.escapeId(name);
        },
        selectByPK: function (entity, pkval, options) {
            options = options || {};

            var $table = entity.$table,
                relations = $table.relations,
                i,
                max,
                query = new Query();

            query.setRoot(entity);

            query.select("*", true);
            query.from($table.tableName, "root");

            if (options.eager !== false) {
                for (i = 0, max = relations.length; i < max; ++i) {
                    if (options.eager === true || (options.eager === undefined && relations[i].eager === true)) {
                        relations[i].apply(query, entity);
                    }
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
        search: function (entity, where) {
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
                $table = entity.$table,
                st = $table.structure;

            query.setRoot(entity);

            query.select("*", true);
            query.from($table.tableName, "root");

            for (i in where) {
                // check if it's binary
                if (st[i].$dbtype === "binary") {
                    query.andWhere("BINARY `root`." + this.escapeId($table.prefix + i) + " = " + this.escape(where[i]));
                } else {
                    query.andWhere("`root`." + this.escapeId($table.prefix + i) + " = " + this.escape(where[i]));
                }
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
            var i,
                query = new Query()
                    .update()
                    .from(table);

            for (i in data) {
                if (i !== key) {
                    query.set(i, data[i]);
                }
            }

            query.andWhere(Query.eq(key, data[key]));

            return query.getSql();
        },
        store: function (table, key, data, callback) {
            if (data[key] == null) { // leave double equals for now
                return this.insert(table, key, data, callback);
            }
            return this.update(table, key, data, callback);
        },
        delete: function ($table, pkval) {
            return new Query()
                .delete()
                .from($table.tableName)
                .andWhere(Query.eq($table.prefix + $table.primaryKey, pkval));
        },
        createColumn: function (prefix, column_name, options, pk) {
            var column = "    `" + prefix + column_name + "` ";

            switch (options.$dbtype) {
                case "integer":
                    column += options.$dbtype.toUpperCase() + "(" + options.length + ")";
                    if (options.zerofill) {
                        column += " ZEROFILL";
                    }
                    if (options.unsigned) {
                        column += " UNSIGNED";
                    }
                    break;
                case "varchar":
                    column += options.$dbtype.toUpperCase() + "(" + options.length + ")";
                    break;
                case "binary":
                    column += "BINARY (" + options.length + ")";
                    break;
                case "enum":
                    column += options.$dbtype.toUpperCase() + "('" + options.values.join("','") + "')";
                    break;
                default:
                    column += options.$dbtype.toUpperCase();

            }
            if (pk === column_name) {
                column += " AUTO_INCREMENT";
            }

            if (options.notnull) {
                column += " NOT NULL";
            }

            if (options.default) {
                column += " DEFAULT " + this.escape(options.default);
            }
            /*
            if (options.charset) {
                column += " CHARACTER SET " + options.charset;
            }
            if (options.collation) {
                column += " COLLATE " + options.collation;
            }
            */

            return column;
        }
    };

}());