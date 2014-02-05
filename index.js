(function () {
    "use strict";

    require("function-enhancements");
    require("object-enhancements");
    require("array-enhancements");
    require('colors');

    var util = require("util");

    util.inspect.styles.undefined = "red";
    util.inspect.styles.date = "green";

    module.exports.Connection = require("./lib/connection.js");
    module.exports.DBA = require("./lib/dba.js");
    module.exports.Norm = require("./lib/norm.js");
    module.exports.Entity = require("./lib/entity.js");

}());
