(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        util = require("util"),
        Relation = require("./relation.js"),
        $ = require("node-class"),
        __class = $.class;

    //$.debug = false;

    function store_related(relations, entity, obj, callback) {
        var relation,
            i,
            max = relations.length,
            retry = function () {
                store_related(relations, entity, obj, callback);
            };

        for (i = 0; i < max; ++i) {
            relation = relations[i];
            if (relation.hasForeignKey(entity)) {
                // true if there is work to be done
                if (relation.store(entity, obj, retry)) {
                    return;
                }
            }
        }
        callback();
    }

    function store_entity(dba, entity, callback) {
        var table_data = entity.$self.$table,
            relations = table_data.relations,
            obj = object.extract(entity, table_data.fields);

        store_related(relations, entity, obj, function () {
            // check if obj is valid
            // any key is a FK ?

            if (table_data.prefix.length) {
                obj = object.prefixKeys(obj, table_data.prefix);
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

            dba.store(table_data.tableName, table_data.prefix + table_data.primaryKey, obj, function (err, id, result) {
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
        initialize: function () {
            // set to false because
            this.__parent();
            this.$dirty = false;
            this.$constructor = false;
        },
        $changes: function () {
            return object.diff(this.$data, this.$db);
        },
        //inspect: function() {
        //    return object.extract(this, this.$self.properties);
        //},
        "static $from": function (result, nested, root) {
            nested = nested || false;
            root = root || false;

            if (!nested) {
                log(result);
                if (!result || result[this.$table.prefix + this.$table.primaryKey] === null) {
                    return null;
                }

                if (this.$table.prefix.length) {
                    return new this(object.remPrefixKeys(result, this.$table.prefix));
                }

                return new this(result);
            }

            var t = this.$table,
                entity = this.$from(result[root ? "root" : t.tableName]),
                i,
                max,
                rel,
                subentity;

            for (i = 0, max = t.relations.length; i < max; ++i) {
                rel = t.relations[i];

                switch (rel.type) {
                case "OneToMany":

                    log(entity[rel.property]);

                    if (Array.isArray(result[rel.property])) {
                        for (i = 0, max = result[rel.property].length; i < max; ++i) {
                            subentity = rel.reference.$from(result[rel.property][i]);
                            if (subentity) {
                                entity[rel.property].push(subentity);
                            }
                        }
                    } else {
                        subentity = rel.reference.$from(result[rel.property]);
                        if (subentity) {
                            entity[rel.property].push(subentity);
                        }
                    }
                    break;
                case "OneToOne":
                    if (rel.isRoot(this)) {
                        if (Array.isArray(result[rel.property])) {
                            result[rel.property] = result[rel.property][0];
                        }
                        entity[rel.property] =  rel.reference.$from(result[rel.property]);
                    } else {
                        if (Array.isArray(result[rel.property])) {
                            result[rel.refProperty] = result[rel.refProperty][0];
                        }
                        entity[rel.refProperty] =  rel.root.$from(result[rel.refProperty]);
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

            this.__dba.query({sql: sql, nestTables: true}, [pkval], function (err, result) {
                if (err) {
                    throw err;
                }

                var i,
                    max = result.length,
                    keys,
                    j,
                    jmax,
                    k,
                    result_ex,
                    entity;

                // @todo _typeCast is leaking!

                if (max === 1) {
                    log("Entity::$get", result);
                    result = result[0];
                    entity = this.$from(result, true/*nested*/, true/*root*/); // jshint ignore:line
                } else if (max > 1) {
                    result_ex = {
                        root: result[0].root, // root wont change
                    };
                    keys = Object.keys(result[0]);
                    keys.splice(keys.indexOf("root"), 1);

                    jmax = keys.length;
                    for (i = 0; i < max; ++i) {
                        for (j = 0; j < jmax; ++j) {
                            k = keys[j];
                            result_ex[k] = result_ex[k] || [];
                            // do not add nulls
                            //var check = Array.unique(object.values(result[i][k]));
                            //if (!(check.length === 1 && check[0] === null)) {
                                result_ex[k].push(result[i][k]);
                            //}
                        }
                    }
                    for (j = 0; j < jmax; ++j) {
                        result_ex[k] = array.unique(result_ex[k]);
                    }

                    log("Entity::$get", result_ex);

                    entity = this.$from(result_ex, true/*nested*/, true/*root*/); // jshint ignore:line
                }

                callback && callback(err, result ? entity : result, result);
            }.bind(this));
        },
        // internal
        "static $createTable": function () {
            var table_data = this.$table,
                fields = table_data.fields,
                create,
                alters = [],
                i,
                max,
                structure,
                sqlf = [],
                sqlk = [],
                rel,
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
                rel.creation(this, sqlk, alters);
            }

            array.combine(sqlf, sqlk);

            create = create + sqlf.join(",\n") + "\n) ENGINE = InnoDB;\n";

            return [create, alters];
        },
        // internal
        "static $$addRelation": function (relation) {
            if (relation.owner === this) {
                this.$table.relations.push(relation);

                // where will be stored
                if ("OneToOne" === relation.type) {
                    this.property(relation.property, null);
                } else {
                    this.property(relation.property, []);
                }

                // fk in database
                this.$table.structure[relation.fk] = relation.target.$table.structure[relation.refColumn];
                this.$table.fields.push(relation.fk);
            } else if (relation.target === this) {
                if (relation.refProperty) { // bi-directional
                    this.$table.relations.push(relation);
                    // where will be stored
                    if ("OneToOne" === relation.type) {
                        relation.target.property(relation.refProperty, null);
                    } else {
                        relation.target.property(relation.refProperty, []);
                    }

                    //there is no field in database
                }
            }
        },
        "static $hasOne": function (target_entity, options) {
            // edge cases
            // relation to myself, and canBeNull is true

            Relation.OneToOne(this, target_entity, options);
            return this;
        },
        "static $hasMany": function (target_entity, options) {
            Relation.OneToMany(this, target_entity, options);
            return this;
        },
        $pk: function () {
            var t = this.$self.$table;
            return this[t.primaryKey];
        },
        $store: function (callback) {
            store_entity(this.__dba, this, callback);
        }

    });
}());