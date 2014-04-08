(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        inspect = require("util").inspect,
        norm = require("./norm.js"),
        DBAL;


    function parse_entity(Entity, result, nested, root, con) {
        nested = nested || false;
        root = root || false;

        var $t = Entity.$table,
            i,
            max,
            j,
            jmax,
            rel,
            subentity,
            ret;

        if (!nested) {
            if (!result || result[$t.prefix + $t.primaryKey] === null) {
                return null;
            }

            if ($t.prefix.length) {
                ret = new Entity(object.remPrefixKeys(result, $t.prefix));
                ret.setConnection(con);

                return ret;
            }

            ret = new Entity(result);
            ret.setConnection(con);

            return ret;
        }

        ret = parse_entity(Entity, result[root ? "root" : $t.tableName], false, false, con);

        if (ret) {
            ret.setConnection(con);

            norm.verbose("loop relations", $t.relations.length)

            for (i = 0, max = $t.relations.length; i < max; ++i) {
                rel = $t.relations[i];

                norm.verbose("parse_entity", rel.type, rel.property, rel.refProperty);
                norm.verbose("is-root", Entity.$class, rel.isRoot(Entity));

                switch (rel.type) {
                case "OneToMany":
                    if (result[rel.property] && rel.isRoot(Entity)) {
                        for (j = 0, jmax = result[rel.property].length; j < jmax; ++j) {
                            subentity = parse_entity(rel.reference, result[rel.property][j], false, false, con);
                            if (subentity) {
                                ret[rel.property].push(subentity);
                            }
                        }
                    } else if (result[rel.refProperty] && !rel.isRoot(Entity)) {
                        subentity = parse_entity(rel.root, result[rel.refProperty][0], false, false, con);
                        if (subentity) {
                            ret[rel.refProperty] = subentity;
                        }
                    }
                    break;
                case "ManyToOne":
                case "OneToOne":
                    if (rel.isRoot(Entity)) {
                        if (Array.isArray(result[rel.property])) {
                            result[rel.property] = result[rel.property][0];
                        }
                        ret[rel.property] =  parse_entity(rel.reference, result[rel.property], false, false, con);
                    } else {
                        if (Array.isArray(result[rel.refProperty])) {
                            result[rel.refProperty] = result[rel.refProperty][0];
                        }
                        ret[rel.refProperty] =  parse_entity(rel.root, result[rel.refProperty], false, false, con);
                    }
                    break;
                }
            }
        }

        return ret;
    }

    function store_entity_cb(con, entity, obj, callback) {
        var table_data = entity.$self.$table,
            query_done = function (err, result) {
                if (!err) {
                    if (!entity[table_data.primaryKey]) {
                        entity[table_data.primaryKey] = result.insertId;
                    }
                    entity.emit("saved");
                }

                callback && callback(err, entity);
            };

        // check if obj is valid
        // any key is a FK ??

        // ---------------------
        // test no modifications
        delete obj[table_data.primaryKey];
        if (object.empty(obj)) {
            norm.debug("no modifications found, ignore store");

            return query_done(null, null);
        }
        // leave everything intact!
        obj[table_data.primaryKey] = entity[table_data.primaryKey];
        // ---------------------

        if (table_data.timestamps) {
            // update (and not modified by user) or insert
            if (entity[table_data.primaryKey] && obj[table_data.updatedAt] == null) {
                obj[table_data.updatedAt] = new Date();
            } else {
                obj[table_data.createdAt] = new Date();
            }
        }

        if (!DBAL) {
            DBAL = require("./dbal.js");
        }

        var sql = DBAL.store(entity.$self, obj);

        con.query(sql, query_done);
    }


    module.exports = {
        /// TODO! this should return an array
        aggregateNested: function (entity, result) {
            norm.verbose("--------------------");
            norm.verbose("aggregateNested");
            norm.verbose(result);

            if (Array.isArray(result) && result.length === 0) {
                return null;
            }

            var i,
                max,
                keys,
                j,
                jmax,
                k,
                id,
                pk = entity.$table.prefix + entity.$table.primaryKey,
                id_to_idx = {},
                aggres = [];

            norm.verbose(pk);

            keys = Object.keys(result[0]);
            keys.splice(keys.indexOf("root"), 1);

            max = result.length;
            jmax = keys.length;

            for (i = 0; i < max; ++i) {
                id = id_to_idx[result[i].root[pk]];

                norm.verbose(id, !id ? "new" :"stack");

                if (id === undefined) {
                    aggres.push({root: result[i].root});
                    id = id_to_idx[result[i].root[pk]] = aggres.length - 1;
                }

                for (j = 0; j < jmax; ++j) {

                    k = keys[j];
                    aggres[id][k] = aggres[id][k] || [];
                    // do not add nulls
                    //var check = Array.unique(object.values(result[i][k]));
                    //if (!(check.length === 1 && check[0] === null)) {
                    aggres[id][k].push(result[i][k]);
                    //}
                }
            }

            max = aggres.length;
            for (i = 0; i < max; ++i) {
                for (j = 0; j < jmax; ++j) {
                    aggres[i][k] = array.unique(aggres[i][k]);
                }
            }

            norm.verbose(aggres);
            norm.verbose("--------------------");

            return aggres;
        },
        parseEntity: function (entity, con, result) {
            norm.verbose("parseEntity", result);

            var ret;

            if (result === null) {
                return null;
            }

            if (Array.isArray(result)) {
                ret = [];
                result.forEach(function (res) {
                    ret.push(parse_entity(entity, res, true, true, con));
                });
            } else {
                ret =  parse_entity(entity, result, true/*nested*/, true/*root*/, con); // jshint ignore:line
            }

            norm.verbose("parsedEntity", ret);

            return ret;
        },
        storeRelations: function storeRelations (entity, relations, obj, connection, callback) {
            var relation,
                i,
                max,
                retry = function () {
                    storeRelations(entity, relations, obj, connection, callback);
                };

            for (i = 0, max = relations.length; i < max; ++i) {
                relation = relations[i];
                // true if there is work to be done
                if (relation.store(entity, obj, connection, retry)) {
                    return;
                }
            }
            store_entity_cb(connection, entity, obj, callback);
        },
        storeEntity: function (entity, con, callback) {
            if (!con || con.$class !== "norm/connection") {
                throw new Error("invalid-connection");
            }

            var table_data = entity.$self.$table,
                relations = table_data.relations,
                obj = entity.$changes();

            // no changes need to be stored!

            // update
            if (entity[table_data.primaryKey]) {
                obj[table_data.primaryKey] = entity[table_data.primaryKey];

                entity.$norm.status = "update";
                entity.emit("pre:update");
            } else {
                entity.$norm.status = "insert";
                entity.emit("pre:insert");
            }


            norm.verbose("*********************");
            norm.verbose("store_related");

            this.storeRelations(entity, relations, obj, con, function (err) {
                entity.$norm.status = "ready";

                callback && callback(err, entity);
            });
        },
        cachekey: function(cls, value) {
            return cls + ":" + (Buffer.isBuffer(value) ? value.toString("hex") : (value || ""));
        },
        delCache: function(key) {
            return function (connection, done) {
                return connection.delCache(key, function(err, result) {
                    done(err, result);
                });
            };
        },
        // TODO return a closure!
        cacheLastWork: function(work, key, options) {
            if ("function" === typeof options) {
                options = {
                    callback: options,
                    ttl: 3600
                };
            } else {
                options = options || {};
                options.ttl = options.ttl || 3600;
            }

            work.push(function (connection, done) {
                if (!work.lastError) {
                    return connection.setCache(key, work.lastResult, options.ttl, function(err, result) {
                        done(err, result);
                    });
                }

                return done(new Error("last-work-has-error"), null);
            }, options.callback, options.name);
        },

        getEntity: function (Entity, pkval, get_options, fetch_options, work) {
            var serr = new Error();
            get_options = get_options || {};
            get_options.callback = function (err, entity) {
                if (err || !entity) {
                    return null;
                }
                entity.$fetch(fetch_options, work);
            };

            Entity.$get(pkval, get_options, work);
        },

        listFetch: function(list, fetch_options, callback) {
            if (!list) {
                return callback && callback(new Error("empty-list"));
            }

            array.mapAsync(list, function (prop, k, done) {
                prop.$fetch(fetch_options, function () {
                    done();
                });
            },
            function () {
                return callback && callback(null, list);
            });
        }
    };

}());
