(function () {
    "use strict";

    var $ = require("node-class"),
        __class = $.class,
        count = 0,
        Relation,
        ONE_TO_ONE = "OneToOne",
        MANY_TO_ONE = "ManyToOne",
        ONE_TO_MANY = "OneToMany";

    $.debug = true;

    Relation = __class("norm/relation", {
        id: null,

        canBeNull: false,

        root: null,
        property: null,
        foreignKey: null,

        reference: null,
        refProperty: null,
        refColumn: null,

        unique: true, // OneOnOne

        eager: false,

        type: "OneToOne",
        initialize: function () {
            this.id = ++count;
        },
        isBidirectional : function () {
            return this.refProperty !== null;
        },
        isRoot: function (entity) {
            return this.root.$class === entity.$class;
        },
        isReference: function (entity) {
            return this.reference.$class === entity.$class;
        },
        apply: function (query, root) {
            if (this.type !== "OneToOne") {
                return;
            }

            if (this.root === root) {
                return this.applyRight(query);
            }
            return this.applyLeft(query);

        },
        applyRight: function (query) {
            var r_tbl = this.root.$table,
                t_tbl = this.reference.$table,
                alias = this.property,
                left = [query.getRootAlias(), r_tbl.prefix + this.foreignKey],
                right = [alias, t_tbl.prefix + this.refColumn],
                fn;

            if (this.eager) {
                query.select(alias + ".*", true);
            }

            fn = this.canBeNull ? "joinLeft" : "joinInner";

            return query[fn](t_tbl.tableName, alias, left, right);
        },
        applyLeft: function (query) {
            if (!this.isBidirectional()) {
                throw new Error("relation is not bidirectional, did you forget refProperty ?");
            }
            var r_tbl = this.root.$table,
                t_tbl = this.reference.$table,
                alias = this.refProperty,
                left = [query.getRootAlias(), t_tbl.prefix + this.refColumn],
                right = [alias, r_tbl.prefix + this.foreignKey],
                fn;

            if (this.eager) {
                query.select(alias + ".*", true);
            }

            fn = this.canBeNull ? "joinLeft" : "joinInner";

            return query[fn](r_tbl.tableName, alias, left, right);
        },
        storeOneToOne: function (entity, obj, callback, retried) {
            var subentity,
                retry = function () { this.storeOneToOne(entity, obj, callback, 1); }.bind(this);

            if (entity[this.property] !== null) {
                subentity = entity[this.property];
                log("*OneToOne not null -> " + this.property, subentity[this.refColumn]);

                //store first and callme again!
                if (subentity[this.refColumn] === null) {
                    log("*OneToOne store");
                    subentity.$store(retry);

                    return true;
                }

                if (obj[this.foreignKey] == null) {
                    log("*OneToOne store assign -> " + entity[this.property][this.refColumn]);

                    obj[this.foreignKey] = entity[this.property][this.refColumn] || null;
                    if (retried === 1) {
                        callback && callback();
                    }
                    return false;
                }
                log("*OneToOne stored");
            }

            return false;
        },
        store: function (entity, obj, callback) {
            switch (this.type) {
                /*
            case "ManyToOne":
                log("ManyToOne");
                log(arguments);
                process.exit();
            break;
            case "OneToMany":
                return false;
                subentity_list = entity[this.property];
                jmax = subentity_list.length;

                if (jmax !== 0) {
                    for (j = 0; j < jmax; ++j) {
                        subentity = subentity_list[j];

                        if (subentity[this.foreignKey] !== entity[this.refColumn]) {
                            subentity[this.foreignKey] = entity[this.refColumn];
                            return subentity.$store(function () {
                                map_relations(relations, entity, obj, callback);
                            });
                        }
                    }
                }
                break;
            */
            case "OneToOne":
                return this.storeOneToOne(entity, obj, callback);
            }
            return false;
        },
        "static OneToOne": function (root_entity, target_entity, options) {
            var t_tbl = target_entity.$table,
                rel;

            options = options || {};

            rel = new Relation();
            rel.type = Relation.ONE_TO_ONE;

            rel.root = root_entity;
            rel.reference = target_entity;

            rel.canBeNull = options.canBeNull === true;
            rel.unique = true; // it's one on one

            rel.property = options.property || target_entity.$class.toLowerCase();

            //bidirectional ?
            rel.refProperty = options.refProperty || null;

            rel.refColumn = options.refColumn || t_tbl.primaryKey;
            rel.foreignKey = options.foreignKey || t_tbl.prefix + rel.refColumn;


            // now modify the entities

            // properties where the relation is stored
            root_entity.property(rel.property, null);
            if (rel.refProperty) {
                target_entity.property(rel.refProperty, null);
            }

            // foreignKey in root
            root_entity.$table.structure[rel.foreignKey] = t_tbl.structure[rel.refColumn];
            root_entity.$table.fields.push(rel.foreignKey);

            return rel;
        },
        "static OneToMany": function (root_entity, target_entity, options) {
            return this.ManyToOne(root_entity, target_entity, options);
        },
        "static ManyToOne": function (root_entity, target_entity, options) {
            var t_tbl = target_entity.$table,
                rel;

            options = options || {};

            rel = new Relation();
            rel.type = Relation.MANY_TO_ONE;

            rel.root = root_entity;
            rel.reference = target_entity;

            rel.canBeNull = options.canBeNull === true;
            rel.unique = false; // it's many on one

            rel.property = options.property || target_entity.$class.toLowerCase();

            //bidirectional ?
            rel.refProperty = options.refProperty || null;

            rel.refColumn = options.refColumn || t_tbl.primaryKey;
            rel.foreignKey = options.foreignKey || t_tbl.prefix + rel.refColumn;

            // properties where the relation is stored
            root_entity.property(rel.property, null);
            if (rel.refProperty) {
                target_entity.property(rel.refProperty, null);
            }

            // foreignKey in root
            root_entity.$table.structure[rel.foreignKey] = t_tbl.structure[rel.refColumn];
            root_entity.$table.fields.push(rel.foreignKey);

            return rel;
        }
    });

    Relation.ONE_TO_ONE = ONE_TO_ONE;
    Relation.MANY_TO_ONE = MANY_TO_ONE;
    Relation.ONE_TO_MANY = ONE_TO_MANY;

    //var q = new Query();

    module.exports = Relation;

    $.debug = false;

}());