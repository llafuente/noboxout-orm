(function () {
    "use strict";

    require("./database.js");

    var $ = require("node-class"),
        __class = $.class,
        mysql = require("mysql"),
        Mysql;

    Mysql = __class("norm/Mysql", {
        extends: ["norm/Database"],

        connection: null,

        initialize: function (config, norm) {
            if (config) {
                this.__parent(config, norm);

                this.manager = mysql.createPool(config);

                var self = this.norm;

                this.manager.on("connection", function (/*connection*/) {
                    self.verbose("#new db connection");
                });
            }
        },

        //
        // Pool
        //

        reserve: function (callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }

            var self = this.manager;

            this.manager.getConnection(function (err, connection) {
                if (err) {
                    self.err(err);
                }

                if (!err && connection.listeners("error").length < 2) {
                    connection.on("error", function(err) {
                        self.err(err.code, err.message, err.stack);
                    });
                }

                var mycon = null;


                if (connection) {
                    mycon = new Mysql();
                    mycon.norm = self.norm;
                    mycon.manager = self.manager;
                    mycon.connection = connection;
                }

                return callback(err, mycon);
                //return callback(err, connection);
            });

        },
        release: function (callback) {
            if ("function" !== typeof callback) {
                throw new Error("callback is required and must be a function");
            }

            this.connection.release();
        },

        //
        // Database
        //

        escape: mysql.escape,
        escapeId: mysql.escapeId,

        query: function (options, query, callback) {
            var self = this;

            this.connection.query(options, query, function (err, data) {
                ++self.stats.querys;
                callback && callback(err, data);
            });
        }
    });

    Mysql.errors = require("./mysql_errors.js");

    module.exports = Mysql;

}());