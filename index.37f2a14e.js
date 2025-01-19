if (!Array.isArray) Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};
if (typeof Object.size !== "function") Object.size = function(arg) {
    if (Object.keys) return Object.keys(arg).length;
    else {
        var num = 0;
        for(var prop in arg)if (arg.hasOwnProperty(prop)) num++;
    }
    return num;
};
if (!Date.now) Date.now = function() {
    return new Date().getTime();
};
console.log("polyLib.js loaded");

//# sourceMappingURL=index.37f2a14e.js.map
