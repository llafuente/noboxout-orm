(function () {
    "use strict";

    var $ = require("node-class"),
        __class = $.class,
        relation_counter = 0;

    function map_relations(relations, entity, obj, callback) {
        var relation,
        i,
        max = relations.length,
        subentity;

       for (i = 0; i < max; ++i) {
            relation = relations[i];

            if (relation.owner.$class !== entity.$class) continue;

            switch(relation.type) {
            case "OneOnOne":
                if (entity[relation.property] !== null) {
                    console.log("1on1 not null!!!");
                    subentity = entity[relation.property];

                    //store first and callme again!
                    if (subentity[relation.refColumn] === null) {
                        return subentity.$store(function() {
                            map_relations(relations, entity, obj, callback);
                        });
                    }

                    obj[relation.fkName] = entity[relation.property][relation.refColumn] || null;
                }
                break;

            }
        }
        callback();
    }

    function store_entity(dba, entity, table_data, callback) {
        var relations = table_data.relations,
            obj = Object.extract(entity, table_data.fields);

        map_relations(relations, entity, obj, function() {
            // check if obj is valid
            // any key is a FK ?

            if (table_data.prefix.length) {
                obj = Object.prefixKeys(obj, table_data.prefix);
            }

            if (table_data.timestamps) {
                if (entity[table_data.primaryKey]) {
                    obj[table_data.prefix + table_data.updatedAt] = new Date();
                } else {
                    obj[table_data.prefix + table_data.createdAt] = new Date();
                }
            }

            /*
            if (entity.main_tag) {
                console.log(obj);
                process.exit();
            }
            */

            dba.store(table_data.tableName, table_data.prefix + table_data.primaryKey, obj, function(err, id, result) {
                if (err) {
                    throw err;
                }

                if (id) {
                    entity[table_data.primaryKey] = id;
                }

                entity.emit("saved");

                callback && callback(err, result);
            });
        });
    }

    __class("Norm/Entity", {
        extends: ["Events"],

        "static $fromDB": function (result, nested) {
            nested = nested || false;
            if (!nested) {
                if (result[this.$table.prefix + this.$table.primaryKey] === null) {
                    return null;
                }

                if (this.$table.prefix.length) {
                    return new this(Object.remPrefixKeys(result, this.$table.prefix));
                }

                return new this(result);
            }

            var t = this.$table,
                entity = this.$fromDB(result[t.tableName]),
                i,
                max,
                relation;

            for (i = 0, max = t.relations.length; i < max; ++i) {
                relation = t.relations[i];

                switch (relation.type) {
                case "OneOnOne":
                    if (this === relation.owner) {
                        entity[relation.property] =  relation.target.$fromDB(result[relation.target.$table.tableName]);
                    } else {
                        entity[relation.refProperty] =  relation.owner.$fromDB(result[relation.owner.$table.tableName]);
                    }
                    break;
                }
            }

            return entity;
        },
        "static $get": function (pkval, options, callback) {
            if (callback === undefined) {
                callback = options;
                options = {};
            }
            options = options || {};
            options.eager = options.eager || 1;

            var t = this.$table,
                sql = this.__dba.buildSelectByPK(["*"], t, this, options.eager);

            this.__dba.selectOne({sql: sql, nestTables: true}, [pkval], function (err, result) {
                if (err) {
                    throw err;
                }

                var entity;

                // @todo _typeCast is leaking!
                log("Entity::$get", arguments, Object.remPrefixKeys(result, t.prefix));

                if (result) {
                    entity = this.$fromDB(result, true/*nested*/); // jshint ignore:line
                }


                callback && callback(err, result ? entity : result, result);
            }.bind(this));
        },
        "static $$addRelation": function(relation) {
            if (relation.owner === this) {
                this.$table.relations.push(relation);

                // where will be stored
                this.property(relation.property, null);

                // fk in database
                this.$table.structure[relation.fkName] = relation.target.$table.structure[relation.refColumn];
                this.$table.fields.push(relation.fkName);
            } else if (relation.target === this) {
                if (relation.refProperty) { // bi-directional
                    this.$table.relations.push(relation);
                    // where will be stored
                    relation.target.property(relation.refProperty, null);

                    //there is no field in database
                }
            }
        },
        "static $hasOne": function (targetClass, options) {
            // edge cases
            // relation to myself, and canBeNull is true

            var tar_name = targetClass.$class,
                tar_table = targetClass.$table;

            options = options || {};
            options.canBeNull = options.canBeNull || false;
            options.property = options.property || tar_name.toLowerCase();
            options.refProperty = options.refProperty || null;
            options.refColumn = options.refColumn || tar_table.primaryKey;
            options.fkName = options.fkName || tar_table.prefix + options.refColumn;

            options.owner = this;
            options.target = targetClass;

            options.type = "OneOnOne";
            options.id = ++relation_counter;


            this.$$addRelation(options);
            targetClass.$$addRelation(options);
        },
        "static $hasMany": function (targetClass, options) {
            options = options || {};

            var tar_name = targetClass.$class,
                tar_table = targetClass.$table,
                ref_col = options.refColumn || tar_table.primaryKey,
                property = options.property || tar_name.toLowerCase(),
                relation;

            relation = {
                id: ++relation_counter,
                type: "OneOnOne",
                target: targetClass,
                property: property,
                fkName: options.fkName || tar_table.prefix + ref_col,
                refColumn: ref_col,
                canBeNull: options.canBeNull || false
            };

            this.$table.relations.push(relation);

            this.$table.structure[relation.fkName] = tar_table.structure[ref_col];
            this.$table.fields.push(relation.fkName);

            this.property(property, null);
        },
        $pk: function () {
            var t = this.$self.$table;
            return this[t.primaryKey];
        },
        $store: function (callback) {
            store_entity(this.__dba, this, this.$self.$table, callback);
        }

    });
}());