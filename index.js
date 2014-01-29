Object.defineProperty(global, "__stack", {
    get: function () {
        var orig = Error.prepareStackTrace,
            err,
            stack;

        Error["prepareStackTrace"]=function(){
            return arguments[1];
        };

        err = new Error();
        Error.captureStackTrace(err, arguments.callee);

        stack = err.stack;

        Error.prepareStackTrace = orig;

        return stack;
    }
});

Object.defineProperty(global, "__line", {
    get: function () {
        return __stack[2].getLineNumber();
    }
});

Object.defineProperty(global, "__file", {
    get: function () {
        return __stack[2].getFileName().split("/").slice(-1)[0];
    }
});

Object.defineProperty(global, "__callee", {
    get: function () {
        return __stack[2].getFileName().split("/").slice(-1)[0]+ ":" +__stack[2].getLineNumber();
    }
});




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
