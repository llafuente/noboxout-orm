(function () {
    "use strict";

    require("./entity.js");

    var $ = require("node-class"),
        __class = $.class,
        Query,
        escapeId = require("mysql").escapeId;

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
        _getSelect: function (p) {
            return "SELECT " + p.select.map(function (v) {
                if (v[0] === "@") {
                    return v.substring(1, v.length - 1);
                }
                return escapeId(v);
            }).join(",");
        },
        _getFrom: function (p) {
            return " FROM " + escapeId(p.from[0]) + " AS " + escapeId(p.from[1]) +
                (p.joins.length ?
                    (" " + p.joins.map(function (v) {
                        v[1] = escapeId(v[1]);
                        v[3] = escapeId(v[3]);
                        v[5] = arEscapeId(v[5]);
                        v[7] = arEscapeId(v[7]);
                        return v.join(" ");
                    }).join(" ")
                ) : "");
        },
        _getWhere: function (p) {
            return " WHERE " + ((p.where.join(" AND ")) || 1) +
                (p.limit !== 0 ? ("LIMIT " + p.offset + ", " + p.limit) : "");
        },
        getRootAlias: function() {
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
        count: function (v) {},
        limit: function (v) {},
        offset: function (v) {},
        groupBy: function(v) {},
        order: function(v, asc) {},
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
        }
    });


    var q = new Query();

    module.exports = Query;

}());