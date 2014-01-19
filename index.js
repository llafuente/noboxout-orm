(function () {
    "use strict";

    require("function-enhancements");
    require("object-enhancements");
    require("array-enhancements");

    var winston = require("winston"),
        util = require("util"),
        logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(), //({ raw: true }),
            ]
        });

    global.log = function () {
        var args = Array.prototype.slice.call(arguments).map(function (v, i) {
            return "*" + i + " - " + ("string" === typeof v ? v.trim() : util.inspect(v, {depth: 5, colors: true}));
        }).join("\n");

        console.log(args);
    };

    module.exports.Norm = require("./lib/norm.js");
    module.exports.DBA = require("./lib/dba.js");
    module.exports.Mysql = require("./lib/mysql.js");


}());
