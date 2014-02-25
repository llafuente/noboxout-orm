(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        Relation = require("./relation.js"),
        DBA = require("./dba.js"),
        util = require("./util.js"),
        norm = require("./norm.js"),
        escapeId = require("mysql").escapeId,
        $ = require("node-class"),
        __class = $.class;

    __class("Norm/Entity", {
        extends: ["Events"],

        "hidden connection": null,
        $norm: {
            dirty: false,
            constructor: true,
            status: "ready"
        },

        initialize: function (options) {
            this.__parent(options);

            // set all fks
            var $self = this.$self,
                rels = $self.$table.relations,
                rel,
                i,
                max = rels.length;

            if (options && "object" === typeof options) {

                for (i = 0; i < max; ++i) {
                    rel = rels[i];
                    if (rel.hasForeignKey($self)) {
                        if (options[rel.foreignKey] !== undefined) {
                            this.$db[rel.foreignKey] = options[rel.foreignKey];
                        }
                    }
                }
            }


            this.$norm.constructor = false;
        },
        $changes: function () {
            norm.verbose(this.$data);
            norm.verbose(this.$db);
            return object.diff(this.$data, this.$db);
        },
        setConnection: function (con) {
            this.connection = con;

            return this;
        },
        $pk: function () {
            return this[this.$self.$table.primaryKey];
        },
        $store: function (con, callback) {

            switch (arguments.length) {
            case 0:
            case 1:
                callback = con;
                con = this.connection;
                break;
            case 2:
                this.connection = con;
                break;
            }

            if (!this.connection || this.connection.$class !== "norm/connection") {
                throw new Error("connetion not specified or invalid");
            }

            // race condition
            if (this.$norm.status !== "ready") {
                this.once("post:store", callback);
            } else {
                var self = this;

                self.emit("pre:store");
                // database
                util.storeEntity(this, con, function () {
                    // no changes!
                    var changes = self.$changes(),
                        i;

                    for (i in changes) {
                        self.$db[i] = changes[i];
                    }

                    self.emit("post:store");
                    // memcached
                    con.delCache(self.$class + ":" + self.$pk(), function () {
                        callback && callback();
                    });
                });
            }

            return this;
        },
        $delete: function (con, callback) {
            switch (arguments.length) {
            case 0:
            case 1:
                callback = con;
                con = this.connection;
                break;
            case 2:
                this.connection = con;
                break;
            }

            if (!this.connection || this.connection.$class !== "norm/connection") {
                throw new Error("connetion not specified or invalid");
            }

            return this.$self.$delete(con, this.$pk(), callback);
        },

        //inspect: function() {
        //    return object.extract(this, this.$self.properties);
        //},
        "static $create": function (con) {
            var x = new this();
            if (con) {
                x.setConnection(con);
            }
            return x;
        },
        "static $delete": function (con, id, callback) {
            var query = DBA.delete(this.$table, id);
            query.setCacheKey(this.$class + ":", id);
            query.exec(con, callback);
        },
        "static $find": function (where) {
            var query = DBA.find(this, where);
            query.setOptions("nestTables", true);
            return query;
        },
        "static $search": function (where) {
            var query = DBA.search(this, where);
            query.setOptions("nestTables", true);
            return query;
        },
        // eager: false, no retrive any relation
        // eager: undefined, look relation.eager
        // eager: true, retrive all
        "static $get": function (pkval, options) {
            options = options || {};

            var query = DBA.selectByPK(this, pkval, options);

            if (options.eager === false) {
                query.setCacheKey(this.$class + ":", pkval);
            }

            query.setOptions("nestTables", true);
            return query;
        },
        "static $exists": function (pkval, con, callback) {
            var query = DBA.selectByPK(this, pkval, {eager: false});

            query.setRoot(null);
            query.parts.select[0] = "@count(*) as count@";

            query.exec(con, function (err, result) {
                var ret = result && result[0] && result[0].count > 0;

                callback && callback(err, ret);
            });
            return query;
        },
        "static $export": function (entity, group) {
            var columns = this.$table.columns,
                st = this.$table.structure,
                i,
                max,
                k,
                ret = {};

            for (i = 0, max = columns.length; i < max; ++i) {
                k = columns[i];
                if (group === false || st[k].groups.indexOf(group) !== -1) {
                    ret[k] = entity[k];
                }
            }

            return ret;
        },
        "static $exportRelation": function (entity, rel, group) {
            var ret,
                i,
                max;

            if (Array.isArray(entity)) {
                ret = [];

                for (i = 0, max = entity.length; i < max; ++i) {
                    ret.push(entity[i].$export(group, false));
                }
            } else {
                return entity.$export(group, false);
            }

            return ret;
        },
        $export: function (group, export_relations) {
            group = group || false;

            var ret,
                i,
                max,
                rels = this.$self.$table.relations,
                rel;

            // export columns
            ret = this.$self.$export(this, group);

            // export relations
            if (export_relations) {
                for (i = 0, max = rels.length; i < max; ++i) {
                    rel = rels[i];
                    if (export_relations === true || export_relations.indexOf(rel.property) !== -1) {
                        if (this[rel.property]) {
                            ret[rel.property] = rel.reference.$exportRelation(this[rel.property], rel, group);
                        } else {
                            ret[rel.property] = null;
                        }
                    }
                }
            }

            return ret;
        },
        $merge: function (obj, group) {
            group = group || false;

            var columns = this.$self.$table.columns,
                st = this.$self.$table.structure,
                i,
                max,
                k;

            for (i = 0, max = columns.length; i < max; ++i) {
                k = columns[i];
                if ((group === false || st[k].groups.indexOf(group) !== -1) && obj[k] !== undefined) {
                    this[k] = obj[k];
                }
            }

            return this;
        },
        $fetch: function (relations, callback) {
            if ("function" === typeof relations) {
                callback = relations;
                relations = null;
            }

            var self = this,
                fetched = 0,
                max = this.$self.$table.relations.length;

            norm.debug("$fetch", this.$class, " relations ", max);

            (this.$self.$table.relations).forEach(function (rel) {
                if (rel.isRoot(self)) {
                    if (relations && relations.indexOf(rel.property) === -1) {
                        norm.debug("not in white list");
                        return --max;
                    }

                } else {
                    if (relations && relations.indexOf(rel.refProperty) === -1) {
                        norm.debug("not in white list");
                        return --max;
                    }

                    if (!rel.isBidirectional()) {
                        norm.debug("$verbose can fetch this relation");
                        return --max;
                    }
                }


                var find = {},
                    query_type;

                norm.debug("$fetch", rel);
                norm.debug("isRoot", rel.isRoot(self));
                norm.debug("hasForeignKey", rel.hasForeignKey(self));

                switch (rel.type) {
                case Relation.ONE_TO_ONE:
                case Relation.MANY_TO_ONE:
                    // am i root ?
                    if (rel.isRoot(self) && rel.hasForeignKey(self)) {
                        if (self.$db[rel.foreignKey] === null) {
                            return --max;
                        }

                        if (rel.refColumn === rel.reference.$table.primaryKey) {
                            // use $get, that is cached!
                            return rel.reference.$get(self.$db[rel.foreignKey], {eager: false}).execOne(self.connection, function (err, entity) {
                                self[rel.property] = entity;

                                ++fetched === max && callback && callback();
                            });
                        }

                        find[rel.refColumn] = self.$db[rel.foreignKey];

                        return rel.reference.$find(find).execOne(self.connection, function (err, entity) {
                            self[rel.property] = entity;

                            ++fetched === max && callback && callback();
                        });
                    }

                    query_type = rel.type === Relation.MANY_TO_ONE ? "exec" : "execOne";

                    find[rel.foreignKey] = self.$db[rel.refColumn];

                    return rel.root.$find(find, callback)[query_type](self.connection, function (err, entity) {
                        self[rel.refProperty] = entity;

                        ++fetched === max && callback && callback();
                    });

                    break;
                case Relation.ONE_TO_MANY:
                    find[rel.foreignKey] = self.$db[rel.refColumn];

                    rel.reference.$find(find, callback).exec(self.connection, function (err, entity) {
                        self[rel.property] = entity;

                        ++fetched === max && callback && callback();
                    });

                    break;
                }
            });

            return this;
        },
        // internal
        "static $createTable": function () {
            var table_data = this.$table,
                columns = table_data.columns,
                uniques = table_data.uniques,
                create,
                alters = [],
                i,
                max,
                structure,
                sqlf = [],
                sqlk = [],
                rel,
                tableName = table_data.tableName,
                prefix = table_data.prefix;

            create = "CREATE TABLE `" + tableName + "` (\n";
            for (i = 0, max = columns.length; i < max; ++i) {
                structure = table_data.structure[columns[i]];

                sqlf.push(DBA.createColumn(prefix, columns[i], structure, table_data.primaryKey));
            }

            for (i = 0, max = uniques.length; i < max; ++i) {
                sqlf.push("    UNIQUE INDEX `" + uniques[i][1] + "` (" + uniques[i][0].map(function (v) {
                    return escapeId(prefix + v);
                }).join(",") + ")");
            }

            sqlk.push("    PRIMARY KEY ( " + prefix + table_data.primaryKey + " )");

            for (i = 0, max = table_data.relations.length; i < max; ++i) {
                rel = table_data.relations[i];
                rel.creation(this, sqlk, alters);
            }

            array.combine(sqlf, sqlk);

            create = create + sqlf.join(",\n") + "\n) ENGINE = InnoDB;\n";

            return [create, alters];
        },
        "static $unique": function (columns, uq_name) {
            if (!uq_name) {
                uq_name = "unique_" + this.$table.tableName + "_" + columns.join("_");
            }
            this.$table.uniques.push([columns, uq_name]);
        },
        "static $hasOne": function (target_entity, options) {
            // edge cases
            // relation to myself, and canBeNull is true

            options = options || {};

            if (options.unique === false) {
                Relation.ManyToOne(this, target_entity, options);
            } else {
                Relation.OneToOne(this, target_entity, options);
            }
            return this;
        },
        "static $hasMany": function (target_entity, options) {
            Relation.OneToMany(this, target_entity, options);
            return this;
        }
    });

}());