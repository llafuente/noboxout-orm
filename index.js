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

    global.log = function() {
        if (arguments.length > 1) {
            logger.log("info", util.inspect(arguments, {depth: 5, colors: true}));
        } else {
            logger.log("info", util.inspect(arguments[0], {depth: 5, colors: true}));
        }
    };

    module.exports.Norm = require("./lib/norm.js");
    module.exports.DBA = require("./lib/dba.js");
    module.exports.Mysql = require("./lib/mysql.js");


}());
