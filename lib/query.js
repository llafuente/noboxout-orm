(function () {
    "use strict";

    var $ = require("node-class"),
        __class = $.class,
        Query,
        util = require("./util.js"),
        escapeId = require("mysql").escapeId,
        debug;

    function arEscapeId(combo) {
        if (Array.isArray(combo)) {
            if (combo.length !== 2) {
                throw new Error("wtf!?");
            }
            return escapeId(combo[0]) + "." + escapeId(combo[1]);
        }
        return escapeId(combo);
    }


    Query = __class("norm/query", {
        parts: {
            select: [],
            from: [],
            joins: [],
            where: [],
            offset: 0,
            limit: 0
        },
        options: {},
        root: null,

        _getSelect: function (p) {
            return "SELECT " + p.select.map(function (v) {
                if (v[0] === "@") {
                    return v.substring(1, v.length - 1);
                }
                return escapeId(v);
            }).join((debug ? ",\n" : ","));
        },
        _getFrom: function (p) {
            return (debug ? "\n FROM " : " FROM ")
                + escapeId(p.from[0]) + " AS " + escapeId(p.from[1]) +
                (p.joins.length ?
                    ((debug ? "\n " : "")
                        + p.joins.map(function (v) {
                        v[1] = escapeId(v[1]);
                        v[3] = escapeId(v[3]);
                        v[5] = arEscapeId(v[5]);
                        v[7] = arEscapeId(v[7]);
                        return v.join(" ");
                    }).join((debug ? " \n" : " "))
                ) : "");
        },
        _getWhere: function (p) {
            return (debug ? "\n WHERE " : " WHERE ")
                + ((p.where.join(" AND ")) || 1) +
                (p.limit !== 0 ? (" LIMIT " + p.offset + ", " + p.limit) : "");
        },
        getRootAlias: function () {
            return this.parts.from[1];
        },
        getSql: function () {
            var p = this.parts;

            return [
                this._getSelect(p),
                this._getFrom(p),
                this._getWhere(p)
            ].join(" ");
        },
        select: function (v, literal) {
            if (!literal) {
                this.parts.select.push(v);
            } else {
                this.parts.select.push("@" + v + "@");
            }

            return this;
        },
        min: function (v) {},
        max: function (v) {},
        avg: function (v) {},
        sum: function (v) {},
        offset: function (v) {
            this.parts.offset = v;
        },
        limit: function (v) {
            this.parts.limit = v;
        },
        groupBy: function (v) {},
        order: function (v, asc) {},
        from: function (root_table, alias) {
            alias = alias || "root";

            this.parts.from = [root_table, alias];

            return this;
        },
        joinLeft: function (target, alias, left_size, right_size) {
            this.parts.joins.push(["LEFT JOIN", target, "AS", alias, "ON", left_size, "=", right_size]);

            return this;
        },
        joinRight: function (target, alias, left_size, right_size) {
            this.parts.joins.push(["RIGHT JOIN", target, "AS", alias, "ON", left_size, "=", right_size]);

            return this;
        },
        joinInner: function (target, alias, left_size, right_size) {
            this.parts.joins.push(["INNER JOIN", alias, target, left_size, right_size]);

            return this;
        },
        andWhere: function (where) {
            this.parts.where.push(where);

            return this;
        },
        setRoot: function (root) {
            this.root = root;
        },
        setOptions: function (key, value) {
            this.options[key] = value;
        },
        queryOne: function (con, callback) {
            if (!con || con.$class !== "norm/connection") {
                throw new Error("invalid connection argument");
            }

            var self = this;

            this.limit(1);
            this.options.sql = this.getSql();

            con.query(this.options, function (err, dbres) {
                if (!self.root) {
                    return callback && callback(err, (dbres && dbres.length === 1) ? dbres[0] : dbres);
                }

                var entity,
                    result;

                result = util.aggregateNested(self.root, dbres);
                if (!result) {
                    entity = null;
                } else {
                    entity = util.parseEntity(self.root, con, result[0]);
                }

                callback && callback(err, entity, result);
            });

            return this;
        },
        query: function (con, callback) {
            if (con.$class !== "norm/connection") {
                throw new Error("invalid connection argument");
            }

            var self = this;

            this.options.sql = this.getSql();

            con.query(this.options, function (err, dbres) {
                if (!self.root) {
                    return callback && callback(err, dbres);
                }

                var result,
                    i,
                    max,
                    entity,
                    entities = [];


                // this part has some problems... i'm sure
                if (self.options.nestTables && dbres.length > 1) {
                    result = util.aggregateNested(self.root, dbres);
                    entity = util.parseEntity(self.root, con, result);

                    callback && callback(err, entity, result);
                } else {
                    for (i = 0, max = dbres.length; i < max; ++i) {
                        entities.push(util.parseEntity(self.root, con, dbres[i]));
                    }
                    callback && callback(err, entities, result);
                }
            });

            return this;
        }
    });

    module.exports = Query;

}());