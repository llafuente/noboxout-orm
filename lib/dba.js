(function () {
    "use strict";

    var object = require("object-enhancements"),
        util = require("util"),
        mysql = require("mysql"),
        Query = require("./query.js"),
        db = mysql.createConnection("mysql://root:toor@localhost/norm"),
        $ = require("node-class"),
        __class = $.class,
        dba;



    dba = __class("norm/dba", {
        mysql: {
            escape: function (name) {
                return db.escape(name);
            },
            escapeId: function (name) {
                return mysql.escapeId(name);
            },
            selectByPK: function (table_data, from, eager_level) {
                eager_level = eager_level || 1;

                var relations = table_data.relations,
                    sql,
                    i,
                    max,
                    joins = [],
                    query = new Query();

                query.select("*", true);
                query.from(table_data.tableName, "root");

                if (eager_level === 1 && !object.empty(table_data.relations)) {
                    for (i = 0, max = relations.length; i < max; ++i) {
                        relations[i].apply(query, from);
                    }
                }

                query.andWhere("`root`.`" + table_data.prefix + table_data.primaryKey + "` = ?");

                return query.getSql();;
            }
        },
        querys: function (sqls, args, callback) {
            if ("function" === typeof args) {
                callback = args;
                args = [];
            }

            var i,
                max = sqls.length,
                errors = [],
                results = [],
                stack_responses = function (err, result) {
                    errors.push(err);
                    results.push(result);
                    if (errors.length === max) {
                        callback && callback(errors, results);
                    }
                };

            for (i = 0; i < max; ++i) {
                this.query(sqls[i], stack_responses);
            }
        },
        query: function (sql, args, callback) {
            if ("function" === typeof args) {
                callback = args;
                args = [];
            }
            log(sql, args);

            db.query(sql, args, callback);
        },
        use: function (database, callback) {
            this.query("USE " + this.escapeId(database), function (err, result) {
                if (err) {
                    console.error(err);
                }

                callback && callback(err, result);
            });
        },
        dropDatabase: function (database_name, callback) {
            var sql = "DROP " + this.mysql.escapeId(database_name);
            this.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                }

                callback && callback(err, result);
            });
        },
        dropTable: function (table_name, callback) {
            var sql = "DROP TABLE " + this.mysql.escapeId(table_name);
            this.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                }

                callback && callback(err, result);
            });
        },
        truncate: function (table_name, callback) {
            var sql = "TRUNCATE TABLE " + this.mysql.escapeId(table_name);

            this.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                }

                callback && callback(err, result);
            });
        },
        deleteAll: function (table_name, callback, reset_auto_increment) {

            var esc_table_name = this.mysql.escapeId(table_name),
                sql = "DELETE FROM " + esc_table_name + " WHERE 1";
            reset_auto_increment = reset_auto_increment || false;

            this.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                }

                if (!reset_auto_increment) {
                    return callback && callback(err, result);
                }

                var sql = "ALTER TABLE " + esc_table_name + " AUTO_INCREMENT = 1";
                this.query(sql, function (err, result) {
                    if (err) {
                        console.error(err);
                    }

                    callback && callback(err, result);
                });
            }.bind(this));
        },
        findQuery: function (table, where, limit) {
            limit = limit === undefined ? 1 : parseInt(limit);
            if (limit === 0 || isNaN(limit)) {
                console.error("limit", limit);
                throw new Error("invalid limit parameter");
            }


            var sql_where = [],
                i;

            for (i in where) {
                sql_where = this.mysql.escapeId(i) + " = " + this.mysql.escape(where[i]);
            }

            var sql = "SELECT * FROM `" + table + "` WHERE `" + sql_where.join(" AND ");

            return sql;
        },
        insert: function (table, key, data, callback) {
            var sql;

            //ok! --> obj[pk] = result.insertId
            var keys = Object.keys(data).map(this.mysql.escapeId),
                values = object.values(data).map(this.mysql.escape);
            sql = "INSERT INTO `" + table + "` (" + keys.join(",") + ") VALUES(" + values.join(",") + ")";

            this.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                }

                callback && callback(err, !result ? null : result.insertId, result);
            });
        },
        update: function (table, key, data, callback) {
            var sets = [],
                i,
                sql;

            for (i in data) {
                if (i !== key) {
                    sets.push(this.mysql.escapeId(i) + " = " + this.mysql.escape(data[i]));
                }
            }

            sql = "UPDATE `" + table + "` SET " + sets.join(",") + " WHERE `" + key + "` = " + this.mysql.escape(data[key]);

            this.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                }

                callback && callback(err, data[key], result);
            });
        },
        store: function (table, key, data, callback) {
            if (data[key] == null) { // leave double equals for now
                this.insert(table, key, data, callback);

                return;
            }
            this.update(table, key, data, callback);
        },
        // , nestTables: true
        selectOne: function (sql, args, callback) {
            if (!callback) {
                callback = args;
                args = undefined;
            }

            this.query(sql, args, function (err, result) {
                if (!err) {
                    result = result && result[0] ? result[0] : null;
                }

                callback && callback(err, result);
            });
        }
    });

    module.exports = dba;

}());