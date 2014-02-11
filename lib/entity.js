(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        Relation = require("./relation.js"),
        DBA = require("./dba.js"),
        util = require("./util.js"),
        norm = require("./norm.js"),
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
            var t = this.$self.$table;
            return this[t.primaryKey];
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

            if (!this.connection) {
                throw new Error("connetion not specified");
            }

            // race condition
            if (this.$norm.status !== "ready") {
                this.once("post:store", callback);
            } else {
                var self = this;

                self.emit("pre:store");
                // database
                util.storeEntity(this, con, function () {
                    self.emit("post:store");
                    // memcached
                    con.delCache(self.$class + ":" + self.$pk(), function () {
                        callback && callback();
                    });
                });
            }

            return this;
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
            query.setCacheKey(this.$class + ":" + id);
            query.query(con, callback);
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
                query.setCacheKey(this.$class + ":" + pkval);
            }

            query.setOptions("nestTables", true);
            return query;
        },
        "static $export": function (entity, group) {
            var fields = this.$table.fields,
                st = this.$table.structure,
                i,
                max,
                k,
                ret = {};

            for (i = 0, max = fields.length; i < max; ++i) {
                k = fields[i];
                if (group === false || st[k].groups.indexOf(group) !== -1) {
                    //merge
                    console.log(k, st[k].groups);
                    ret[k] = entity[k];
                }
            }

            return ret;
        },
        "static $exportRelation": function (mixed, rel, group) {
            var ret,
                i,
                max;

            if (Array.isArray(mixed)) {
                ret = [];

                for (i = 0, max = mixed.length; i < max; ++i) {
                    ret.push(mixed[i].$export(group, false));
                }
            } else {
                ret = mixed.$export(group, false);
            }

            return ret;
        },
        $export: function (group, relations) {
            group = group || false;

            var ret,
                i,
                max,
                rels = this.$self.$table.relations,
                rel;

            // export columns
            ret = this.$self.$export(this, group);

            // export relations
            if (relations) {
                for (i = 0, max = rels.length; i < max; ++i) {
                    rel = rels[i];
                    if (relations === true || relations.indexOf(rel.property) !== -1) {
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

            var fields = this.$self.$table.fields,
                st = this.$self.$table.structure,
                i,
                max,
                k;

            for (i = 0, max = fields.length; i < max; ++i) {
                k = fields[i];
                if ((group === false || st[k].groups.indexOf(group) !== -1) && obj[k] !== undefined) {
                    //merge
                    console.log("merge", k, obj[k]);
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
                var find = {};

                switch (rel.type) {
                case Relation.ONE_TO_ONE:
                case Relation.MANY_TO_ONE:
                    find[rel.foreignKey] = self.$db[rel.refColumn];

                    rel.root.$find(find, callback).queryOne(self.connection, function (err, entity) {
                        self[rel.refProperty] = entity;

                        ++fetched === max && callback && callback();
                    });

                    break;
                case Relation.ONE_TO_MANY:
                    find[rel.foreignKey] = self.$db[rel.refColumn];

                    rel.reference.$find(find, callback).query(self.connection, function (err, entity) {
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
                fields = table_data.fields,
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
            for (i = 0, max = fields.length; i < max; ++i) {
                structure = table_data.structure[fields[i]];

                sqlf.push(DBA.createField(prefix, fields[i], structure, table_data.primaryKey));

                //fields[i]
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
        "static $hasOne": function (target_entity, options) {
            // edge cases
            // relation to myself, and canBeNull is true

            Relation.OneToOne(this, target_entity, options);
            return this;
        },
        "static $hasMany": function (target_entity, options) {
            Relation.OneToMany(this, target_entity, options);
            return this;
        }
    });

}());