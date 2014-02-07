(function () {
    "use strict";

    var object = require("object-enhancements"),
        array = require("array-enhancements"),
        inspect = require("util").inspect,
        norm = require("./norm.js"),
        DBA;


    function parse_entity(Entity, result, nested, root, con) {
        nested = nested || false;
        root = root || false;

        var $t = Entity.$table,
            i,
            max,
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

            for (i = 0, max = $t.relations.length; i < max; ++i) {
                rel = $t.relations[i];

                switch (rel.type) {
                case "OneToMany":
                    if (Array.isArray(result[rel.property])) {
                        for (i = 0, max = result[rel.property].length; i < max; ++i) {
                            subentity = parse_entity(rel.reference, result[rel.property][i], false, false, con);
                            if (subentity) {
                                ret[rel.property].push(subentity);
                            }
                        }
                    } else {
                        subentity = parse_entity(rel.reference, result[rel.property], false, false, con);
                        if (subentity) {
                            ret[rel.property].push(subentity);
                        }
                    }
                    break;
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
        var table_data = entity.$self.$table;
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

        if (!DBA) {
            DBA = require("./dba.js");
        }

        var sql = DBA.store(table_data.tableName, table_data.prefix + table_data.primaryKey, obj);

        con.query(sql, function (err, result) {
            if (err) {
                throw err;
            }

            if (!entity[table_data.primaryKey]) {
                entity[table_data.primaryKey] = result.insertId;
            }

            entity.emit("saved");

            callback && callback(err, result);
        });
    }


    module.exports = {
        /// TODO! this should return an array
        aggregateNested: function (entity, result) {
            norm.debug("--------------------");
            norm.debug("aggregateNested");
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


            keys = Object.keys(result[0]);
            keys.splice(keys.indexOf("root"), 1);

            max = result.length;
            jmax = keys.length;

            for (i = 0; i < max; ++i) {
                id = id_to_idx[result[i].root[pk]];

                if (!id) {
                    aggres.push({root: result[i].root});
                    id = id_to_idx[result[i].root[pk]] = aggres.length -1;
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

            norm.debug("--------------------");

            return aggres;
        },
        parseEntity: function (entity, con, result) {
            norm.debug("******************");
            norm.debug("parseEntity", result);

            var ret;

            if (result === null) {
                return null;
            }

            if (Array.isArray(result)) {
                ret = [];
                result.forEach(function(res) {
                    ret.push(parse_entity(entity, res, true, true, con));
                });
            } else {
                ret =  parse_entity(entity, result, true/*nested*/, true/*root*/, con); // jshint ignore:line
            }

            norm.debug("parsedEntity", ret);
            norm.debug("******************");

            return ret;
        },
        storeRelation: function storeRelation (entity, relations, obj, con, callback) {
            var relation,
                i,
                max,
                retry = function () {
                    storeRelation(entity, relations, obj, con, callback);
                };

            for (i = 0, max = relations.length; i < max; ++i) {
                relation = relations[i];
                if (relation.hasForeignKey(entity)) {
                    // true if there is work to be done
                    if (relation.store(entity, obj, retry)) {
                        return;
                    }
                }
            }
            store_entity_cb(con, entity, obj, callback);
        },
        storeEntity: function(entity, con, callback) {
            var table_data = entity.$self.$table,
                relations = table_data.relations,
                //obj = object.extract(entity, table_data.fields);
                obj = entity.$changes();

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

            this.storeRelation(entity, relations, obj, con, function() {
                entity.$norm.status = "ready";

                callback && callback();
            });
        }
    };

}());
