(function () {
    "use strict";

    require("./entity.js");

    var $ = require("node-class"),
        __class = $.class,
        __static = $.static,
        Norm,
        dba;

    Norm = __class("norm/norm", {
        "static setDBA": function (_dba) {
            dba = _dba;
        },
        "static define": function (name, definition, options) {
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
                    foreignKeys: {}

                };

            for (i in definition) {
                if (definition[i] && definition[i].$dbtype) {
                    $table.fields.push(i);
                    $table.structure[i] = definition[i];
                    definition[i] = definition[i].default;
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

            __static(cls, "$table", $table);

            Norm.models[options.tableName] = $table;

            // TODO hackish!
            cls.__dba = dba;
            cls.prototype.__dba = dba;

            return cls;
        }
    });

    Norm.models = {};

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

    Norm.config_property("TEXT", {
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

    Norm.config_property("ENUM", {
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