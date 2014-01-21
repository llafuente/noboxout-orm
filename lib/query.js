(function () {
    "use strict";

    require("./entity.js");

    var $ = require("node-class"),
        __class = $.class,
        Query;

    function arEscapeId(combo, con) {
        if (Array.isArray(combo)) {
            if (combo.length !== 2) {
                throw new Error("wtf!?");
            }
            return con.escapeId(combo[0]) + "." + con.escapeId(combo[1]);
        }
        return con.escapeId(combo);
    }


    Query = __class("norm/query", {
        parts: {
            select: [],
            from: [],
            joins: [],
            where: [],
            offset: 0,
            count: 0
        },
        setConnection: function (con) {
            this.con = con;
        },
        _getSelect: function (p, con) {
            return "SELECT " + p.select.map(function (v) {
                if (v[0] === "@") {
                    return v.substring(1, v.length - 1);
                }
                return con.escapeId(v);
            }).join(",");
        },
        _getFrom: function (p, con) {
            return " FROM " + con.escapeId(p.from[0]) + " AS " + con.escapeId(p.from[1]) +
                (p.joins.length ?
                    (" " + p.joins.map(function (v) {
                        return con.escapeId(v[0]) + " AS " + con.escapeId(v[1]) + " ON " +
                            arEscapeId(v[2], con) + " = " + arEscapeId(v[3], con);
                    }).join(" ")
                ) : "");
        },
        _getWhere: function (p, con) {
            return " WHERE " + ((p.where.join(" AND ")) || 1) +
                (p.count !== 0 ? ("LIMIT " + p.offset + ", " + p.count) : "");
        },
        getRootAlias: function() {
            return this.parts.from[1];
        },
        getSql: function () {
            var p = this.parts,
                con = this.con;
            return [
                this._getSelect(p, con),
                this._getFrom(p, con),
                this._getWhere(p, con)
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
        from: function (root_table, alias) {
            alias = alias || "root";

            this.parts.from = [root_table, alias];

            return this;
        },
        joinLeft: function (target, alias, left_size, right_size) {
            this.parts.joins.push(["LEFT JOIN", alias, target, left_size, right_size]);

            return this;
        },
        joinRight: function (target, alias, left_size, right_size) {
            this.parts.joins.push(["RIGHT JOIN", alias, target, left_size, right_size]);

            return this;
        },
        joinInner: function (target, alias, left_size, right_size) {
            this.parts.joins.push(["INNER JOIN", alias, target, left_size, right_size]);

            return this;
        },
        andWhere: function (where) {
            this.parts.where.push(where);

            return this;
        }
    });


    var q = new Query();

    module.exports = Query;

}());