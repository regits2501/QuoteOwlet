 if(!Array.isArray){
     Array.isArray = function (arg) { 
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
}

if((typeof Object.size) !== "function"){
    Object.size = function (arg) {  // its not good idea to modify prototype of bult-ins but object are usually ok.
    if (Object.keys) return Object.keys(arg).length;
     else {
      var num = 0;
      for (var prop in arg) {
        if (arg.hasOwnProperty(prop)) num++;
      }
    }
    return num;
  }
}

console.log("polyLib.js loaded");
