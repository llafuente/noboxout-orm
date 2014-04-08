(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        log = require("noboxout-log"),
        $ = require("node-class"),
        configurable = require("node-class").__configurator,
        __class = $.class,
        __static = $.static,

        Connection = require("./connection.js"),
        Memcached =  require("./memcached.js"),
        Mysql =  require("./mysql.js"),
        Norm;

    Norm = {
        models: {},
        tables: {},
        errors: [],
        databasePool: null,
        cachePool: null,

        setup: function (options) {
            if (!options.database) {
                throw new Error("options.mysql is missing");
            }

            this.databasePool = new Mysql(options.database, this);
            this.cachePool = new Memcached(options.cache, this);
        },
        registerError: function(code, tokens, new_error, entity) {
            if ("string" !== typeof new_error) {
                throw new Error("new_error must be a string");
            }

            this.errors.push({
                code: code,
                tokens: tokens,
                new_error: new_error,
                entity: entity || null
            });
        },
        checkError: function(code, tokens) {
            var i,
                max = this.errors.length,
                j,
                jmax,
                e,
                ok;

            for (i = 0; i < max; ++i) {
                e = this.errors[i];

                if (code === e.code) {
                    ok = true;
                    for (j = 0, jmax = tokens.length; j < jmax; ++j) {
                        if (e.tokens[j] !== null && e.tokens[j] !== tokens[j]) {
                            ok = false;
                        }

                    }
                    if (ok) {
                        return e.new_error;
                    }
                }
            }

            return null;
        },
        // study, do we need to manage cache pool ?
        // we leave this work to mecached.js right now.
        reserve: function (callback) {
            var input = {
                database: false,
                databaseErr: null,
                cache: false,
                cacheErr: null
            };

            var self = this;

            function create() {
                if (input.database !== false && input.cache !== false) {
                    var con = new Connection(input.database, input.cache, self);
                    callback(input.databaseErr || input.cacheErr, con);
                }
            }

            this.cachePool.reserve(function (err, connection) {
                input.cacheErr = err;
                input.cache = connection;

                create();
            });

            this.databasePool.reserve(function (err, connection) {
                input.databaseErr = err;
                input.database = connection;

                create();
            });
        },
        release: function (connection) {
            connection.release(function() {});
        },
        clone: function (src_name, name, definition, options) {
            options = options || {};
            options.autoset = true;

            var cls = __class(name, {
                extends: [src_name]
            }, options);

            cls.$table = object.clone(cls.$table);
            cls.$table.tableName = options.tableName || name.toLowerCase();
            cls.$table.prefix = options.prefix || "";

            Norm.tables[name] = cls.$table;
            Norm.models[name] = cls;

            return cls;
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
                    columns: [],
                    structure: {},
                    updatedAt: options.updatedAt || "updated_at",
                    createdAt: options.createdAt || "created_at",
                    timestamps: options.timestamps === undefined ? true : options.timestamps,
                    relations: [],
                    foreignKeys: {},
                    uniques: [],
                    indexes: []

                },
                $data = {},
                structure = {};

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

                    structure[i] = definition[i];

                    $data[i] = definition[i].default;
                    delete definition[i];
                }
            }

            // add timestamp columns
            if ($table.timestamps) {
                structure[$table.updatedAt] = Norm.Date;
                structure[$table.createdAt] = Norm.Date.NOTNULL;

                $data[$table.updatedAt] = null;
                $data[$table.createdAt] = null;
            }

            var cls = __class(name, definition, options);

            // first because any column access this, so must be defined before!
            cls.property("$data", $data, {
                enumerable: false
            });

            cls.property("$db", {}, {
                enumerable: true
            });

            cls.static("$column", function (k, definition, enumerable) {
                if ($table.columns.indexOf(k) !== -1) {
                    return Norm.warn("(norm) column [" + this.$class + "." + k + "] double definition, ignored");
                }

                if (definition) {
                    $table.columns.push(k);
                    $table.structure[k] = definition;
                    $data[k] = definition.default;
                }

                cls.accessor(k, {
                    enumerable: enumerable === false,
                    get: function () {
                        return this.$data[k];
                    },
                    set: function (val) {
                        if (this.$norm.constructor === true) {
                            if (val instanceof Date) {
                                this.$db[k] = new Date(val);
                            } else {
                                this.$db[k] = val;
                            }
                        } else {
                            this.$norm.dirty = true;
                        }
                        if (!this.$data) {
                            console.log(this.$self.$$);
                            console.log(this.$$);
                            console.log(this.$data);
                        }
                        this.$data[k] = val;
                    }
                });
            });

            object.each(structure, function (v, k) {
                cls.$column(k, v);
            });

            // check if PK exists
            if ($table.columns.indexOf($table.primaryKey) === -1) {
                throw new Error("primary key not found");
            }

            __static(cls, "$table", $table);

            Norm.tables[name] = $table;
            Norm.models[name] = cls;

            return cls;
        },
        sync: function (callback) {
            // TODO
            var DBAL = require("./dbal.js"),
                querys = [],
                drops = [
                    "SET FOREIGN_KEY_CHECKS = 0"
                ],
                creates = [],
                create,
                alters = [],
                i,
                self = this;



            for (i in this.models) {
                drops.push(DBAL.dropTable(this.models[i].$table.tableName));
                create = this.models[i].$createTable();
                creates.push(create[0]);
                array.combine(alters, create[1]);
            }

            drops.push("SET FOREIGN_KEY_CHECKS = 1");

            array.combine(querys, array.unique(drops));
            array.combine(querys, array.unique(creates));
            array.combine(querys, array.unique(alters));

            this.reserve(function (err, con) {
                con.querys(querys, function () {
                    self.release(con);

                    callback && callback();
                });
            });
        }
    };


    object.extend(Norm, log);
    Norm.logLevel = 2;


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