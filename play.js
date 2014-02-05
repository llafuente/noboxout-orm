var cls = require("node-class").class;



var X = cls("x", {
    visible: true
});


X.accessor("invisible", {
    set: function(val) { //setter
        return this.$invisible = val;
    },
    get: function() { //getter
        return this.$invisible;
    }
});



var x = new X();

x.invisible = 100;

console.log(x);


console.log(x.invisible);

console.log(require("util").inspect(x));