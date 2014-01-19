(function () {
    "use strict";

    var util = require("util"),
        $ = require("node-class"),
        __class = $.class,
        relation_counter = 0;

    function map_relations(relations, entity, obj, callback) {
        var relation,
        i,
        max = relations.length,
        subentity;

        for (i = 0; i < max; ++i) {
            relation = relations[i];

            if (relation.owner.$class !== entity.$class) {
                continue;
            }

            switch(relation.type) {
            case "OneToOne":
                if (entity[relation.property] !== null) {
                    console.log("1on1 not null!!!");
                    subentity = entity[relation.property];

                    //store first and callme again!
                    if (subentity[relation.refColumn] === null) {
                        return subentity.$store(function() {
                            map_relations(relations, entity, obj, callback);
                        });
                    }

                    obj[relation.fk] = entity[relation.property][relation.refColumn] || null;
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

    function export_type(prefix, field_name, options, pk) {
        var field = "    `" + prefix + field_name + "` " + options.$dbtype.toUpperCase();

        switch (options.$dbtype) {
            case "integer":
                field += "(" + options.length + ")";
                if (options.zerofill) {
                    field += " ZEROFILL";
                }
                if (options.unsigned) {
                    field += " UNSIGNED";
                }
                break;
            case "varchar":
                field += "(" + options.length + ")";
                break;

        }
        if (pk === field_name) {
            field += " AUTO_INCREMENT";
        }
        if (options.default) {
            field += " DEFAULT " + options.default;
        }
        /*
        if (options.charset) {
            field += " CHARACTER SET " + options.charset;
        }
        if (options.collation) {
            field += " COLLATE " + options.collation;
        }
        */

        return field;
    }

    __class("Norm/Entity", {
        extends: ["Events"],
        "static $from": function (result, nested, root) {
            nested = nested || false;
            root = root || false;

            if (!nested) {
                log(result)
                if (result[this.$table.prefix + this.$table.primaryKey] === null) {
                    return null;
                }

                if (this.$table.prefix.length) {
                    return new this(Object.remPrefixKeys(result, this.$table.prefix));
                }

                return new this(result);
            }

            var t = this.$table,
                entity = this.$from(result[root ? "root" : t.tableName]),
                i,
                max,
                relation;

            for (i = 0, max = t.relations.length; i < max; ++i) {
                relation = t.relations[i];

                switch (relation.type) {
                case "OneToOne":
                    if (this === relation.owner) {
                        entity[relation.property] =  relation.target.$from(result[relation.property]);
                    } else {
                        entity[relation.refProperty] =  relation.owner.$from(result[relation.refProperty]);
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
                sql = this.__dba.mysql.selectByPK(t, this, options.eager);

            this.__dba.selectOne({sql: sql, nestTables: true}, [pkval], function (err, result) {
                if (err) {
                    throw err;
                }

                var entity;

                // @todo _typeCast is leaking!
                log("Entity::$get", arguments, Object.remPrefixKeys(result, t.prefix));

                if (result) {
                    entity = this.$from(result, true/*nested*/, true/*root*/); // jshint ignore:line
                }


                callback && callback(err, result ? entity : result, result);
            }.bind(this));
        },
        // internal
        "static $createTable": function() {
            var table_data = this.$table,
                fields = table_data.fields,
                create,
                alters = [],
                i,
                max,
                structure,
                sqlf = [],
                sqlk = [],
                field,
                rel,
                fk,
                ttable_data,
                tableName = table_data.tableName,
                prefix = table_data.prefix;

            create = "CREATE TABLE `" + tableName + "` (\n";
            for (i = 0, max = fields.length; i < max; ++i) {
                structure = table_data.structure[fields[i]];

                sqlf.push(export_type(prefix, fields[i], structure, table_data.primaryKey));

                //fields[i]
            }

            sqlk.push("    PRIMARY KEY ( " + prefix + table_data.primaryKey + " )");

            //table_data.fields

            //alters!

            // TODO DO DO DO!
            for (i = 0, max = table_data.relations.length; i < max; ++i) {
                rel = table_data.relations[i];
                ttable_data = rel.target.$table;
                //console.log("************");
                //console.log(util.inspect(rel, {depth: 0, colors: true}));
                //console.log("************");

                if (rel.owner === this) {
                    log(util.inspect(rel, {depth: 0, colors: true}));
                    
                    switch(rel.type) {
                    case "OneToMany":
                    case "ManyToOne":
                        break;
                    case "OneToOne":
                        sqlk.push("    UNIQUE INDEX `unique_"+tableName + "_" + rel.fk +"` (`" + prefix + rel.fk + "`)");
                        break;
                    }

                    //
                    alters.push("ALTER TABLE `" + tableName +
                        "` ADD CONSTRAINT `fk_" + tableName + "_" + rel.fk + "` FOREIGN KEY (`" + prefix + rel.fk + "`)" +
                        " REFERENCES `" + ttable_data.tableName +"` (`" + ttable_data.prefix + rel.refColumn + "`);");
                } else {

                }
                //rel.canBeNull

                //process.exit();
            }

            Array.combine(sqlf, sqlk);            

            create = create + sqlf.join(",\n") + "\n) ENGINE = InnoDB;\n";

            return [create, alters];
        },
        // internal
        "static $$addRelation": function(relation) {
            if (relation.owner === this) {
                this.$table.relations.push(relation);

                // where will be stored
                this.property(relation.property, null);

                // fk in database
                this.$table.structure[relation.fk] = relation.target.$table.structure[relation.refColumn];
                this.$table.fields.push(relation.fk);
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
            options.fk = options.fk || tar_table.prefix + options.refColumn;
            options.unique = options.unique || true;

            options.owner = this;
            options.target = targetClass;

            options.type = "OneToOne";
            options.id = ++relation_counter;


            this.$$addRelation(options);

            if (this !== targetClass) {
               targetClass.$$addRelation(options);
            }

            return this;
        },
        "static $hasMany": function (targetClass, options) {
            // edge cases
            // relation to myself, and canBeNull is true

            var tar_name = targetClass.$class,
                tar_table = targetClass.$table;

            options = options || {};
            options.canBeNull = options.canBeNull || false;
            options.property = options.property || tar_name.toLowerCase();
            options.refProperty = options.refProperty || null;
            options.refColumn = options.refColumn || tar_table.primaryKey;
            options.fk = options.fk || tar_table.prefix + options.refColumn;
            options.unique = options.unique || true;
            
            options.joinTable = options.joinTable || null;

            options.owner = this;
            options.target = targetClass;

            options.type = "OneToMany";
            options.id = ++relation_counter;


            this.$$addRelation(options);

            if (this !== targetClass) {
                options = Object.clone(options);
                options.type = "ManyToOne";
                targetClass.$$addRelation(options);
            }

            return this;
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