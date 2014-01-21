(function () {
    "use strict";

    var $ = require("node-class"),
        __class = $.class,
        count = 0,
        Relation;

    Relation = __class("norm/relation", {
        id: null,

        canBeNull: false,
        
        root: null,
        property: null,
        foreignKey: null,

        ref: null,
        refProperty: null,
        refColumn: null,
        
        unique: true, // OneOnOne

        eager: false,

        type: "OneToOne",
        initialize: function () {
            this.id = ++count;
        },
        isBidirectional : function () {
            return this.refProperty !== null;
        },
        apply: function (query, root) {
            if (this.root === root) {
                return this.applyRight(query);
            }
            return this.applyLeft(query);

        },
        applyRight: function (query) {
            var r_tbl = this.root.$table,
                t_tbl = this.ref.$table,
                alias = this.property,
                left = [query.getRootAlias(), r_tbl.prefix + this.foreignKey],
                right = [alias, t_tbl.prefix + this.refColumn],
                fn;

            if (this.eager) {
                query.select(alias + ".*", true);
            }

            fn = this.canBeNull ? "joinLeft" : "joinInner";

            return query[fn](t_tbl.tableName, alias, left, right);
        },
        applyLeft: function (query) {
            if (!this.isBidirectional()) {
                throw new Error("relation is not bidirectional, did you forget refProperty ?");
            }
            var r_tbl = this.root.$table,
                t_tbl = this.ref.$table,
                alias = this.refProperty,
                left = [query.getRootAlias(), t_tbl.prefix + this.refColumn],
                right = [alias, r_tbl.prefix + this.foreignKey],
                fn;

            if (this.eager) {
                query.select(alias + ".*", true);
            }

            fn = this.canBeNull ? "joinLeft" : "joinInner";

            return query[fn](r_tbl.tableName, alias, left, right);
        },
        "static OneToOne": function (root_entity, target_entity, options) {
            var t_tbl = target_entity.$table,
                rel;

            options = options || {};

            rel = new Relation();
            rel.type = Relation.ONE_TO_ONE;
            
            rel.root = root_entity;
            rel.target = target_entity;

            rel.canBeNull = options.canBeNull === true;
            rel.unique = true; // it's one on one
            
            rel.property = options.property || target_entity.$class.toLowerCase();

            //bidirectional ?
            rel.refProperty = options.refProperty || null;

            options.foreignKey = options.foreignKey || t_tbl.prefix + options.refColumn;
            options.refColumn = options.refColumn || t_tbl.primaryKey;

            return rel;
        },
        "static ManyToOne": function (root_entity, target_entity, options) {
            var t_tbl = target_entity.$table,
                rel;

            options = options || {};

            rel = new Relation();
            rel.type = Relation.ONE_TO_ONE;
            
            rel.root = root_entity;
            rel.target = target_entity;

            rel.canBeNull = options.canBeNull === true;
            rel.unique = false; // it's many on one
            
            rel.property = options.property || target_entity.$class.toLowerCase();

            //bidirectional ?
            rel.refProperty = options.refProperty || null;

            options.foreignKey = options.foreignKey || t_tbl.prefix + options.refColumn;
            options.refColumn = options.refColumn || t_tbl.primaryKey;

            return rel;
        }
    });

    Relation.ONE_TO_ONE = "OneToOne";
    Relation.MANY_TO_ONE = "ManyToOne";
    Relation.ONE_TO_MANY = "OneToMany";

    //var q = new Query();

    module.exports = Relation;

}());