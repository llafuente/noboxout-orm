(function () {
    "use strict";


    var $ = require("node-class"),
        __class = $.class,
        count = 0,
        Relation,
        ONE_TO_ONE = "OneToOne",
        MANY_TO_ONE = "ManyToOne",
        ONE_TO_MANY = "OneToMany",
        CC_DEFAULT_REGEX = /[-_]+(.)?/g;

    function toUpper(match, group1) {
        return group1 ? group1.toUpperCase() : "";
    }

    function camelCase(str, delimiters) {
        return str.replace(delimiters ? new RegExp("[" + delimiters + "]+(.)", "g") : CC_DEFAULT_REGEX, toUpper);
    }

    Relation = __class("norm/relation", {
        id: null,

        canBeNull: false,

        root: null,
        property: null,
        foreignKey: null,
        eager: false,

        reference: null,
        refProperty: null,
        refColumn: null,
        refEager: false,

        unique: true, // OneOnOne

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
        hasForeignKey: function (entity) {
            var owner_side;
            switch (this.type) {
            case ONE_TO_ONE:
            case MANY_TO_ONE:
                owner_side = this.root;
                break;
            case ONE_TO_MANY:
                owner_side = this.reference;
                break;
            }

            return owner_side.$class === entity.$class;
        },
        apply: function (query, root) {
            switch(this.type) {
            case ONE_TO_ONE:
            case MANY_TO_ONE:
                if (this.root === root) {
                    return this.applyRight(query);
                }
                return this.applyLeft(query);

            case ONE_TO_MANY:
                return this.applyRightReverse(query);

            };
        },
        applyRightReverse: function (query) {
            var r_tbl = this.root.$table,
                t_tbl = this.reference.$table,
                alias = this.property,
                left = [query.getRootAlias(), t_tbl.prefix + this.refColumn],
                right = [alias, r_tbl.prefix + this.foreignKey],
                fn;

            if (this.eager) {
                query.select(alias + ".*", true);
            }

            fn = this.canBeNull ? "joinLeft" : "joinInner";

            return query[fn](t_tbl.tableName, alias, left, right);
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
        storeOneToMany: function (entity, obj, callback, retried) {
            var max,
                i,
                subentity_list,
                subentity,
                retry = function () { this.storeOneToMany(entity, obj, callback, 1); }.bind(this);

            subentity_list = entity[this.property];
            max = subentity_list.length;

            if (max !== 0) {
                for (i = 0; i < max; ++i) {
                    subentity = subentity_list[i];

                    if (subentity[this.foreignKey] !== entity[this.refColumn]) {
                        subentity[this.foreignKey] = entity[this.refColumn];
                        subentity.$store(retry);

                        return true;
                    }
                }
            }
            if (retried === 1) {
                callback && callback();
            }
            return false;
        },
        store: function (entity, obj, callback) {
            log("## store relation:", this.type, this.property);
            switch (this.type) {
            case ONE_TO_ONE:
            case MANY_TO_ONE:
                return this.storeOneToOne(entity, obj, callback);
            case ONE_TO_MANY:
                return this.storeOneToMany(entity, obj, callback);
            }

            return false;
        },
        creation: function (entity, create, alters) {
            //console.log("************");
            //console.log(util.inspect(rel, {depth: 0, colors: true}));
            //console.log("************");

            var r_tbl = this.root.$table,
                r_tbl_name = r_tbl.tableName,
                t_tbl = this.reference.$table,
                t_tbl_name = t_tbl.tableName;

            switch (this.type) {
            case ONE_TO_MANY:
                alters.push("ALTER TABLE `" + t_tbl_name +
                    "` ADD CONSTRAINT `fk_" + t_tbl_name + "_" + this.foreignKey + "` FOREIGN KEY (`" + t_tbl.prefix + this.foreignKey + "`)" +
                    " REFERENCES `" + r_tbl_name + "` (`" + r_tbl.prefix + this.refColumn + "`);");
                break;
            case ONE_TO_ONE:
            case MANY_TO_ONE:
                if (this.isRoot(entity)) {
                    create.push("    UNIQUE INDEX `unique_" + r_tbl_name + "_" + this.foreignKey + "` (`" + r_tbl.prefix + this.foreignKey + "`)");

                    alters.push("ALTER TABLE `" + r_tbl_name +
                        "` ADD CONSTRAINT `fk_" + r_tbl_name + "_" + this.foreignKey + "` FOREIGN KEY (`" + r_tbl.prefix + this.foreignKey + "`)" +
                        " REFERENCES `" + t_tbl_name + "` (`" + t_tbl.prefix + this.refColumn + "`);");
                }
                break;
            }
        },
        "static OneToOne": function (root_entity, target_entity, options) {
            var t_tbl = target_entity.$table,
                rel;

            options = options || {};

            rel = new Relation();
            rel.type = ONE_TO_ONE;

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

            root_entity.$table.relations.push(rel);

            if (rel.isBidirectional()) {
                target_entity.$table.relations.push(rel);
            }

            return rel;
        },
        "static OneToMany": function (root_entity, target_entity, options) {
            var t_tbl = target_entity.$table,
                r_tbl = root_entity.$table,
                rel;

            options = options || {};

            rel = new Relation();
            rel.type = ONE_TO_MANY;

            rel.root = root_entity;
            rel.reference = target_entity;

            rel.canBeNull = options.canBeNull === true;
            rel.unique = false; // it's many on one

            rel.property = options.property || target_entity.$class.toLowerCase();

            //bidirectional ?
            rel.refProperty = options.refProperty || null;

            rel.refColumn = options.refColumn || r_tbl.primaryKey;
            rel.foreignKey = options.foreignKey || r_tbl.prefix + rel.refColumn;

            // properties where the relation is stored
            root_entity.property(rel.property, []);
            if (rel.refProperty) {
                target_entity.property(rel.refProperty, null);
            }

            // foreignKey in root
            t_tbl.structure[rel.foreignKey] = r_tbl.structure[rel.refColumn];
            t_tbl.fields.push(rel.foreignKey);
            target_entity.$field(rel.foreignKey, null);

            root_entity.$table.relations.push(rel);

            //add / remove
            root_entity.method(camelCase("add-" + options.property), function (cls) {
                if (cls.$class !== target_entity.$class) {
                    throw new Error("type-missmatch");
                }
                this[rel.property].push(cls);
            });

            root_entity.method(camelCase("remove-" + options.property), function (cls) {
                if (cls.$class !== target_entity.$class) {
                    throw new Error("type-missmatch");
                }
                var c = this[rel.property].indexOf(cls);
                if (c > -1) {
                    this[rel.property].splice(c, 1);
                    cls[rel.foreignKey] = null;
                }
            });





            if (rel.isBidirectional()) {
                target_entity.$table.relations.push(rel);
            }


            return rel;
        },
        // many to one is a one to one, but without unique
        "static ManyToOne": function (root_entity, target_entity, options) {
            var rel = this.OneToOne(root_entity, target_entity, options);
            rel.type = MANY_TO_ONE;
            rel.unique = false;

            return rel;

        }
    });

    Relation.ONE_TO_ONE = ONE_TO_ONE;
    Relation.MANY_TO_ONE = MANY_TO_ONE;
    Relation.ONE_TO_MANY = ONE_TO_MANY;

    //var q = new Query();

    module.exports = Relation;

}());