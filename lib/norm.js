(function () {
    "use strict";

    var object = require("object-enhancements"),
        $ = require("node-class"),
        util = require("util"),
        inspect = util.inspect,
        __class = $.class,
        __static = $.static,
        mysql = require("mysql"),
        Connection = require("./connection.js"),
        Norm;

    Norm = __class("norm/norm", {
        "static setup": function (options) {
            if (!options.mysql) {
                throw new Error("options.mysql is missing");
            }

            this.pool = mysql.createPool(options.mysql);

            this.pool.on("connection", function (/*connection*/) {
                Norm.verbose("#new db connection");
            });
        },
        "static reserve": function (callback) {
            var self = this;
            this.pool.getConnection(function (err, connection) {
                var con = new Connection(connection, self);
                callback(err, con);
            });
        },
        "static release": function (connection) {
            connection.con.release();
        },
        "static define": function (name, definition, options) {
            options = options || {};
            options.autoset = true;

            definition.extends = definition.extends || [];
            definition.extends.push("Norm/Entity");
            definition.$dirty = false;
            // search for $dbtype
            var i,
                $table = {
                    tableName: options.tableName || name.toLowerCase(),
                    primaryKey: options.primaryKey || "id",
                    prefix: options.prefix || "",
                    fields: [],
                    structure: {},
                    updatedAt: options.updatedAt || "updated_at",
                    createdAt: options.createdAt || "created_at",
                    timestamps: options.timestamps === undefined ? true : options.timestamps,
                    relations: [],
                    foreignKeys: {}

                },
                $data = {};

            for (i in definition) {
                if (definition[i] && definition[i].$dbtype) {
                    $table.fields.push(i);
                    $table.structure[i] = definition[i];
                    $data[i] = definition[i].default;
                    delete definition[i];
                }
            }

            // check if PK exists
            if ($table.fields.indexOf($table.primaryKey) === -1) {
                throw new Error("primary key not found");
            }

            // add timestamp fields
            if ($table.timestamps) {
                $table.fields.push($table.updatedAt);
                $table.fields.push($table.createdAt);

                $table.structure[$table.updatedAt] = Norm.Date;
                $table.structure[$table.createdAt] = Norm.Date.NOTNULL;

                definition[$table.updatedAt] = null;
                definition[$table.createdAt] = null;
            }


            var cls = __class(name, definition, options);

            // first because any field access this, so must be defined before!
            cls.property("$data", $data, {
                enumerable: false
            });

            cls.property("$db", {}, {
                enumerable: true
            });

            cls.property("$constructor", true, {
                enumerable: true,
                writable: true
            });

            cls.static("$field", function (k, enumerable) {
                cls.accessor(k, {
                    enumerable: enumerable === false,
                    get: function () {
                        return this.$data[k];
                    },
                    set: function (val) {
                        if (this.$constructor === true) {
                            this.$db[k] = val;
                        } else {
                            this.$dirty = true;
                        }
                        this.$data[k] = val;
                    }
                });
            });

            object.each($table.structure, function (v, k) {
                cls.$field(k);
            });

            __static(cls, "$table", $table);

            Norm.tables[name] = $table;
            Norm.models[name] = cls;

            return cls;
        },
        "static verbose": function() {
            var log = Array.prototype.map.call(arguments, inspect).join(" ");

            util.print(new Date().toISOString().slice(0, 19).replace('T', ' '), "[vrb]", __callee, log.cyan, "\n");
        },
        "static debug": function() {
            var log = Array.prototype.map.call(arguments, inspect).join(" ");

            util.print(new Date().toISOString().slice(0, 19).replace('T', ' '), "[dbg]", __callee, log.green, "\n");
        },
        "static warning": function() {
            var log = Array.prototype.map.call(arguments, inspect).join(" ");

            util.debug(new Date().toISOString().slice(0, 19).replace('T', ' '), "[wrn]", __callee, log.yellow, "\n");
        },
        "static error": function() {
            var log = Array.prototype.map.call(arguments, inspect).join(" ");

            util.debug(new Date().toISOString().slice(0, 19).replace('T', ' '), "[err]", __callee, log.redBG, "\n");
        }

    });

    Norm.models = {};
    Norm.tables = {};

    Norm.config_property("Number", {
        $dbtype: "integer",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // number specific
        length: 11,
        zerofill: false,
        unsigned: false
    }, ["length", "default"]);

    Norm.config_property("Decimal", {
        $dbtype: "integer",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // number specific
        length: 8,
        decimals: 4,
        zerofill: false,
        unsigned: false
    }, ["length", "decimals", "default"]);

    Norm.config_property("String", {
        $dbtype: "varchar",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // string specific
        charset: "utf8",
        collation: "utf8_bin",
        length: 16
    }, ["charset", "collation", "length", "default"]);

    Norm.config_property("Text", {
        $dbtype: "text",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // string specific
        charset: "utf8",
        collation: "utf8_bin"
        // length: 16 support for LONG / TINY / MEDIUM ?
    }, ["charset", "collation", "length", "default"]);

    Norm.config_property("Date", {
        $dbtype: "datetime",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: ""
    }, ["default"]);

    Norm.config_property("Enum", {
        $dbtype: "enum",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",
        // enum specific
        values: [],
        charset: "utf8",
        collation: "utf8_bin"
    }, ["charset", "collation", "values", "default"]);


    module.exports = Norm;

}());