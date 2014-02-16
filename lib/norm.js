(function () {
    "use strict";

    var object = require("object-enhancements"),
        log = require("noboxout-log"),
        $ = require("node-class"),
        configurable = require("node-class").__configurator,
        __class = $.class,
        __static = $.static,
        mysql = require("mysql"),
        Connection = require("./connection.js"),
        Memcached = require("memcached"),
        Norm;

    Norm = {
        models: {},
        tables: {},
        databasePool: null,
        cachePool: null,

        setup: function (options) {
            if (!options.mysql) {
                throw new Error("options.mysql is missing");
            }

            this.databasePool = mysql.createPool(options.mysql);

            this.databasePool.on("connection", function (/*connection*/) {
                Norm.verbose("#new db connection");
            });

            object.extend(Memcached.config, options.memcached.config);
            this.cachePool = new Memcached(options.memcached.host + ':' + options.memcached.port, {});
        },
        // study, do we need to manage cache pool ?
        // we leave this work to mecached.js right now.
        reserve: function (callback) {
            var input = {
                database: false,
                databaseErr: false,
                cache: this.cachePool, //false if we want a managed cache
                cacheErr: null
            };
            var self = this;

            function create() {
                if (input.database !== false && input.cache !== false) {
                    var con = new Connection(input.database, input.cache, self);
                    callback(input.databaseErr || input.cacheErr, con);
                }
            }

            this.databasePool.getConnection(function (err, connection) {
                if (err) {
                    self.err(err);
                }
                input.databaseErr = err;
                input.database = connection;
                create();
            });

            //resetve memcached ?
        },
        release: function (connection) {
            connection.database.release();
        },
        define: function (name, definition, options) {
            options = options || {};
            options.autoset = true;

            definition.extends = definition.extends || [];
            definition.extends.push("Norm/Entity");
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
                    foreignKeys: {},
                    uniques: []

                },
                $data = {};

            for (i in definition) {
                if (definition[i] && definition[i].$dbtype) {
                    // TODO add more checks
                    switch (definition[i].$dbtype) {
                    case "enum":
                        if (!Array.isArray(definition[i].values)) {
                            throw new Error("enum values must be an array");
                        }
                        break;
                    }

                    if (!Array.isArray(definition[i].groups)) {
                        throw new Error("groups definition must be an array");
                    }

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

            cls.static("$field", function (k, enumerable) {
                cls.accessor(k, {
                    enumerable: enumerable === false,
                    get: function () {
                        return this.$data[k];
                    },
                    set: function (val) {
                        if (this.$norm.constructor === true) {
                            this.$db[k] = val;
                        } else {
                            this.$norm.dirty = true;
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
        sync: function() {
            // TODO
            var creates = [];

            for (i in this.models) {
                x = this.models[i].$createTable();
                creates.push(x[0]);
                array.combine(alters, x[1]);
            }

            array.combine(creates, array.unique(alters));

            con.querys(creates, function () {
                this.release(con);
                t.end();
            });
        }
    };


    object.extend(Norm, log);
    Norm.logLevel = 4;


    configurable(Norm, "Number", {
        $dbtype: "integer",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // number specific
        length: 11,
        zerofill: false,
        unsigned: false,

        groups: []
    }, ["length", "default", "groups"]);

    configurable(Norm, "Decimal", {
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
        unsigned: false,

        groups: []
    }, ["length", "decimals", "default", "groups"]);

    configurable(Norm, "String", {
        $dbtype: "varchar",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // string specific
        charset: "utf8",
        collation: "utf8_bin",
        length: 16,

        groups: []
    }, ["charset", "collation", "length", "default", "groups"]);

    //study: use length to support for LONG / TINY / MEDIUM ?
    configurable(Norm, "Text", {
        $dbtype: "text",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // string specific
        charset: "utf8",
        collation: "utf8_bin",

        groups: []
    }, ["charset", "collation", "length", "default", "groups"]);

    configurable(Norm, "Date", {
        $dbtype: "datetime",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        groups: []
    }, ["default", "groups"]);

    configurable(Norm, "Enum", {
        $dbtype: "enum",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",
        // enum specific
        values: [],
        charset: "utf8",
        collation: "utf8_bin",

        groups: []
    }, ["charset", "collation", "values", "default", "groups"]);

    configurable(Norm, "Binary", {
        $dbtype: "binary",
        //common
        notNull: false,
        default: null,
        unique: null,
        comment: "",

        // string specific
        charset: "utf8",
        collation: "utf8_bin",
        length: 16,

        groups: []
    }, ["charset", "collation", "length", "default", "groups"]);


    module.exports = Norm;

}());