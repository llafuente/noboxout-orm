(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        Fun = require("function-enhancements"),
        Relation = require("./relation.js"),
        Work = require("./work.js"),
        Query = require("./query.js"),
        DBAL = require("./dbal.js"),
        Util = require("./util.js"),
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
        $store: function (options, work) {
            work = work || new Work();
            options = options || {};

            var self = this;

            work.push(function (connection, callback) {
                // race condition
                if (self.$norm.status !== "ready") {
                    return self.once("post:store", callback);
                }

                self.emit("pre:store");
                // database
                Util.storeEntity(self, connection, function (err) {
                    // no changes!
                    var changes = self.$changes(),
                        i,
                        listeners,
                        hook_cbk;

                    for (i in changes) {
                        self.$db[i] = changes[i];
                    }

                    listeners = self.hasListeners("hook:post:store");

                    if (listeners) {
                        hook_cbk = Fun.after(function () {
                            self.emit("hook:post:store");
                            callback && callback(err, self);
                        }, listeners);
                        return self.emit("hook:post:store", [hook_cbk]);
                    }

                    self.emit("post:store");
                    callback && callback(err, self);
                    // memcached
                });

            }, options.callback, options.name);

            work.push(Util.delCache(Util.cachekey(self.$class, self.$pk())));

            return work;
        },
        $delete: function (options, work) {
            return this.$self.$delete(this.$pk(), options, work);
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
        "static $delete": function (id, options, work) {
            work = work || new Work();
            options = options || {};

            var query = DBAL.delete(this, id);

            query.setOptions(options, {
                nestTables: true,
            });

            work.push(function (connection, done) {
                return query.exec(connection, function (err, result) {
                    done(err, result);
                });
            }, options.callback, options.name, query);

            work.push(Util.delCache(Util.cachekey(this.$class, id)));

            return work;
        },
        "static $query": function (options) {
            var query = new Query();

            query.setRoot(this);
            query.use(this);

            if (options) {
                query.setOptions(options);
            }

            return query;
        },
        "static $all": function (options, work) {
            return this.$find({}, options, work);
        },
        "static $find": function (where, options, work) {
            work = work || new Work();
            options = options || {};

            var query = DBAL.find(this, where);
            options.nestTables = options.nestTables === false ? false : true;

            query.setOptions(options);

            work.push(function (connection, done) {
                return query.exec(connection, function (err, result) {
                    done(err, result);
                });
            }, options.callback, options.name, query);

            return work;
        },
        "static $search": function (where, options, work) {
            work = work || new Work();
            options = options || {};

            var query = DBAL.search(this, where);
            options.nestTables = true;

            query.setOptions(options);

            work.push(function (connection, done) {
                return query.exec(connection, function (err, result) {
                    done(err, result);
                });
            }, options.callback, options.name, query);

            return work;
        },
        // eager: false, no retrive any relation
        // eager: undefined, look relation.eager
        // eager: true, retrive all
        "static $get": function (pkval, options, work) {
            work = work || new Work();
            options = options || {};
            options.cachekey = options.cachekey || [];
            options.nestTables = true;

            if (!Array.isArray(options.cachekey)) {
                options.cachekey = [options.cachekey];
            }

            var query = DBAL.selectByPK(this, pkval, options)
                .setOptions(options)
                .singleResult();

            if (options.eager === false) {
                query.addCacheKey(Util.cachekey(this.$class, pkval));
            }

            work.push(function (connection, done) {
                return query.exec(connection, function (err, result) {
                    done(err, result);
                });
            }, options.callback, options.name, query);

            return work;
        },
        "static $exists": function (pkval, options, work) {
            work = work || new Work();
            options = options || {};

            var query = DBAL
                .selectByPK(this, pkval, {eager: false})
                .setRoot(null)
                .singleResult();

            query.parts.select[0] = "@count(*) as count@";

            work.push(function (connection, done) {
                return query.exec(connection, function (err, result) {
                    var ret = result && result[0] && result[0].count > 0;

                    done(err, ret);
                });
            }, options.callback, options.name, query);

            return work;
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

            if (export_relations && Array.isArray(export_relations)) {
                var aux = {};
                for (i = 0, max = export_relations.length; i < max; ++i) {
                    aux[export_relations[i]] = {};
                }
                export_relations = aux;
            }

            // export columns
            ret = this.$self.$export(this, group);

            // export relations
            if (export_relations) {
                for (i = 0, max = rels.length; i < max; ++i) {
                    rel = rels[i];

                    if (export_relations === true || export_relations[rel.property] !== undefined) {
                        if (this[rel.property]) {
                            if (Array.isArray(this[rel.property])) {
                                ret[rel.property] = rel.reference.$exportRelation(this[rel.property], rel, export_relations === true ? group : (export_relations[rel.property].group || group));
                            } else {
                                ret[rel.property] = this[rel.property].$export(export_relations === true ? group : (export_relations[rel.property].group || group));
                            }
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

            var aux = {}, i, max;
            if (relations && Array.isArray(relations)) {
                for (i = 0, max = relations.length; i < max; ++i) {
                    aux[relations[i]] = {};
                }
                relations = aux;
            }

            var auto_exec = "function" === typeof callback,
                self = this,
                work,
                options;

            max = this.$self.$table.relations.length;

            if (auto_exec) {
                work = new Work();
            } else if ("Norm/Work" === callback.$class) {
                work = callback;
            } else {
                throw new Error("invalid callback/work parameter");
            }

            norm.debug("$fetch", this.$class, " relations ", max);

            (this.$self.$table.relations).forEach(function (rel) {
                if (rel.isRoot(self)) {
                    if (relations && relations[rel.property] === undefined) {
                        norm.debug(rel.root.$class + ":" + rel.property, "don't $fetch, not in white list");
                        return --max;
                    }

                } else {
                    if (relations && relations[rel.refProperty] === undefined) {
                        norm.debug(rel.reference.$class + ":" + rel.refProperty, "don't $fetch, not in white list");
                        return --max;
                    }

                    if (!rel.isBidirectional()) {
                        norm.debug(rel.reference.$class + ":" + rel.refProperty, "this relation can't be $fetch");
                        return --max;
                    }
                }

                var find = {};

                norm.debug("$fetch", rel.root.$class + ":" + rel.property, rel.reference.$class + ":" + rel.refProperty);
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
                            return rel.reference.$get(self.$db[rel.foreignKey], {
                                eager: false,
                                callback: function (err, entity) {
                                    self[rel.property] = entity;
                                }
                            }, work);
                        }

                        options = {
                            result: 1,
                            callback: function (err, entity) {
                                self[rel.property] = entity;
                            }
                        };

                        if (relations && relations[rel.property]) {
                            options = object.merge(options, relations[rel.property]);
                        }

                        find[rel.refColumn] = self.$db[rel.foreignKey];

                        return rel.reference.$find(find, options, work);
                    }

                    find[rel.foreignKey] = self.$db[rel.refColumn];

                    options = {
                        result: rel.type !== Relation.MANY_TO_ONE ? 1 : 0,
                        callback: function (err, entity) {
                            self[rel.refProperty] = entity || [];
                        }
                    };

                    if (relations && relations[rel.refProperty]) {
                        options = object.merge(options, relations[rel.refProperty]);
                    }

                    return rel.root.$find(find, options, work);

                case Relation.ONE_TO_MANY:
                    find[rel.foreignKey] = self.$db[rel.refColumn];

                    options = {
                        callback: function (err, entity) {
                            self[rel.property] = entity || [];
                        }
                    };

                    if (relations && relations[rel.property]) {
                        options = object.merge(options, relations[rel.property]);
                    }

                    return rel.reference.$find(find, options, work);
                }
            });

            if (auto_exec) {
                work.exec(self.connection, function () {
                    callback && callback();
                });
                return this;
            }

            return work;
        },
        // internal
        "static $createTable": function () {
            var table_data = this.$table,
                columns = table_data.columns,
                uniques = table_data.uniques,
                indexes = table_data.indexes,
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

                sqlf.push(DBAL.createColumn(prefix, columns[i], structure, table_data.primaryKey));
            }

            for (i = 0, max = uniques.length; i < max; ++i) {
                sqlk.push("    UNIQUE INDEX `" + uniques[i][1] + "` (" + uniques[i][0].map(function (v) {
                    return escapeId(prefix + v);
                }).join(",") + ")");
            }

            for (i = 0, max = indexes.length; i < max; ++i) {
                sqlk.push("    INDEX `" + indexes[i][1] + "` (" + indexes[i][0].map(function (v) {
                    return escapeId(prefix + v);
                }).join(",") + ")");
            }

            sqlk.push("    PRIMARY KEY ( " + prefix + table_data.primaryKey + " )");

            for (i = 0, max = table_data.relations.length; i < max; ++i) {
                rel = table_data.relations[i];
                rel.creation(this, sqlk, alters);
            }


            sqlk = array.unique(sqlk);
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
        "static $primaryKey": function () {
            return this.$table.prefix + this.$table.primaryKey;
        },
        "static $index": function (columns, idx_name) {
            columns = columns.sort();

            if (!idx_name) {
                idx_name = "index_" + this.$table.tableName + "_" + columns.join("_");
            }
            this.$table.indexes.push([columns, idx_name]);
        },
        "static $hasIndex": function (columns) {
            columns = columns.sort();

            var indexes = this.$table.indexes,
                idxs,
                oks,
                i,
                imax = indexes.length,
                j,
                jmax,
                found = false;

            for (i = 0; i < imax; ++i) {
                idxs = indexes[i][0];
                jmax = idxs.length;
                oks = 0;

                for (j = 0; j < jmax; ++j) {
                    if (idxs[j] == columns[j]) {
                        ++oks;
                    }
                }

                if (oks === jmax) {
                    return indexes[i][1];
                }
            }

            return false;
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