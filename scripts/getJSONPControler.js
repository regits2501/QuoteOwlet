
/*
   This should be the object created by "behavior delegation" as oposed to conventional class oriented modeling.
   Used for getting data from remote server by means of JSONP method, which goes around CORS(Cross-Origin-Resource   -sharing). 
*/


var getJSONP = {
  setUrl: function (url) {
    this.url = url; // url string
  },
  setQueryData: function (data) {
    this.queryData = data; // object
  },
  setCallback: function (callbackSuccess,callbackFailure) { 
    this.onSuccess = callbackSuccess;
    this.onFailure = callbackFailure || this.onNoSuccess(); // passing users callback for failure case or built in.
    this.context = arguments.callee.caller || document;     // context of
  },
  setScriptPlace: function (elmt, flg) { // Element to place script into (as lastChild).    
    this.scriptPlace = elmt;
    this.removeScript = flg || true; // Default is to remove script element as soon as data arives.
  },
  getData: function () {
    if(!this.checkProperties()) return ;
  
    
    // make script element
    // make the request
  }
}
var getJSONPutils = {
  requiredProps: [
    'url',
    'queryData',
    'onSuccess',
//  'onFailure',   internal detail of implementsation / not requered, optional
    'scriptPlace'
//  'removeScript  internal detaail of implementation'/ not requered , optional
  ],
  notRequiredProps:[ // properties not required to be set by user
    'onFailure',
    'context',
    'removeScript'
    
  ],
  size: function () { // put this in other POLYFIL library
    if (Object.keys) return Object.keys(this).length;
     else {
      var num = 0;
      for (var prop in this) {
        if (this.hasOwnProperty(prop)) num++;
      }
    }
    return num;
  },
  isArray: function (arg) { // POLYFIL move into library
    return Object.prototype.toString.call(arg) === '[object Array]';
  },
  messages: {
    objectNotInitiated: '[getJSONP] object must have all properties set.',
    propertieUndefined: ' property must have a value.'
  },
  checkProperties: function () {
    var names = this.requiredProps.join(' '); //console.log("check props")
    var numNeeded = this.size() - this.notRequiredProps.length;
    if (this.requredProps !== numNeeded) console.log( this.messages.objectNotInitiated + ' \n' + names); // message on console 
      
  
    var regexp;
    
    for (var prop in this) {
       //console.log('for loop prop: ' + prop + '  this = ' + this.toString());
      if (this.hasOwnProperty(prop)) { // Only direct object props.
        regexp = new RegExp('\\b' + prop + '\\b');
        if (regexp.test(names)) { // Is one of which we need.
          // console.log('has name: ' + prop) 
          if (this[prop] === undefined){  // undefined property
            console.log( prop + " " + this.messages.propertieUndefined); // log on console and return false 
            return false ;
          } 
           else {
           // console.log(this[prop]);
          }
        }
      }
    }
    return true;
  },
  onNoSuccess: function(){
       return function(data){ 
          console.log(data);
         
       }
  },
  makeScriptElmt: function () {
    var script = document.createElement('script');
    script.src = this.url; // Set address.
    return script;
  },
  checkJSONPinQueryData: function(){ // function checks for existance of jsonp property in query data object
                                   // and inserts built in function that wrappes around user suplied callback function. 
      
     for(var name in this.queryData){  // if exists just set value and return
          if(name.toLowerCase() === "jsonp"){ 
            this.queryData[name] = "getJSONP.callbackWrapper";  // callbackWrapper is function in prototype chain
            return;
          }
     }
    
    this.queryData["jsonp"] = "getJSONP.callbackWrapper";  // jsonp prop' doesn't exists so make it and set it.
  },
  insertQueryData: function () {
    if(this.url.indexOf("?") == -1) this.url += "?"; // put query string delimiter if one doesnt exist
    var queryString = formEncode(queryData) // formEncode() function defined in other lib, form-url encodes js object
    this.url + queryString; 
  },
  sendRequest: function () {
      this.insertQueryData();  
      this.scriptPlace.appendChild(this.makeScriptElmt); // async CODE !!!
     // if(this.) 
  },
  callbackWrapper: function(data){
                               // < --- code that cheecks ASYNC traps, like multiple invoking and late responce.
    
        this.onSuccess.call(this.context); //     
     
  }
}

getJSONP.__proto__ = Object.create(getJSONPutils); // making prototype connection(linking object)
//=================================================================================================
var requestJSONP = Object.create(getJSONP); // making an "instance";
requestJSONP.setUrl('http://api.forismatic.com/api/1.0/');
var querydata = {
  method: 'jsonp'
}
var scriptsPlace = document.getElementsByTagName('head') [0];
requestJSONP.setQueryData(querydata);
requestJSONP.setCallback(undefined);
requestJSONP.setScriptPlace(scriptsPlace);
requestJSONP.getData();
//console.log("is alive");
