
/*
   This should be the object created by "behavior delegation" as oposed to conventional class oriented modeling.
   Used for getting data from remote server by means of JSONP method, which goes around CORS(Cross-Origin-Resource   -sharing). 
*/
 

if(typeof _pS_.modulMgr === "object" && _pS_.modulMgr !== null){
  
  var mgr = _pS_.modulMgr;

  mgr.define("getJSONPcontroller", ["formEncode"], function (formEncode){

  var getJSONP = {
   setUrl: function (url) {
     this.url = url; // url string
   },
   setQueryData: function (data) {
     this.queryData = data; // object
   },
   setCallback: function (callbackSuccess, callbackFailure) {
     getJSONP.onSuccess = callbackSuccess;
     getJSONP.onFailure = callbackFailure || this.onNoSuccess; // users callback for failure case or built in.
     getJSONP.context = arguments.callee.caller || document; // context of
   },
   setScriptPlace: function (elmt, flg) { // Element to place script into (as lastChild).    
     this.scriptPlace = elmt;
     this.removeScript = flg || true; // Default is to remove script element as soon as data arives.
   },
   getData: function () {
     if (!this.checkProperties()) return;
     else this.sendRequest();
   },
   setRequestTimeout: function (ms) {
     this.timeoutInterval = ms;
   }
 }

 var getJSONPutils = {
   requiredProps: [ 
     'url',
     'queryData',
     'onSuccess',
     'scriptPlace'    
   ],
   messages: {
     objectNotInitiated: '[getJSONP] object must have all properties set.',
     propertieUndefined: ' property must have a value.',
     responceNotOnTime: 'Server responce exceeded timeout value.',
     noDataArrived: 'Server responded but there was no data object.'
   }, 
   checkProperties: function () {// Checks that required props are there and have value other then undefined
                                  // Uses Object.size() defined in polyLib.js.
                                  // Object.size() returns number of object's own props.
     var names = this.requiredProps.join(' '); 
      
     if(Object.size(this) < this.requiredProps.length)
       console.log(this.messages.objectNotInitiated +"\n"+ names);
     
     var regexp;
     for (var prop in this) {  // "this" is top of the prototype chain. See "publicApi" object bellow.
       if (this.hasOwnProperty(prop)) { // Only direct object props.
         regexp = new RegExp('\\b' + prop + '\\b'); // Test for whole words only. 
         if (regexp.test(names)) { // Is one of which is required.
           if (this[prop] === undefined) { // and is not defined.
             console.log(prop + ' ' + this.messages.propertieUndefined); // log on console and return false 
             return false;
           } 
         }
       }
     }

     return true; // all props there and have values, return true.
   },
   onNoSuccess: function (){
       console.log(this.messages.noDataArrived);
   },
   makeScript: function () {
    if(!this.scriptTags) this.scriptTags = []; // make array if id doesn't exist

     var script = document.createElement('script'); 
     script.src = this.url;    
     this.scriptTags.push(script); // put it into array so we can remove exactly one with which we'le make remote                                   // request, no matter in what order responces come from server 
                                   // (that is callbackWrapper gets invoked).  
     
     return script;
   },

   scriptCount: 0 ,  // as if script tags (html elements) count
   callbackName: "_pS_.hook.callbackWrapper",  // For setting the queryData's "jsonp" propertie. _pS.hook is used 
                                     // as object available to place async functions that JSONP server will call.                                     
   partName: "callbackWrapper" ,  // for actually making a callback function

   checkJSONPinQueryData: function () { // Function checks for existance of jsonp property in query data object 
                                       // and inserts wrapper function name. 
     var callback = this.callbackName + this.scriptCount++ ;  // this number is also same as index from scripTags
                                                         // where we'll put script element (in makeScript() step)  
     for (var name in this.queryData) { // if exists just set value and return
       if (name.toLowerCase() === 'jsonp') {
         this.queryData[name] =  callback ;                                               
         return;
       }
     }
     this.queryData['jsonp'] = callback; // jsonp prop' doesn't exists so make  it and set it.
     
   },
   insertQueryData: function () {
     if (this.url.indexOf('?') == -1) this.url += '?'; // put query string delimiter if one doesnt exist
     this.checkJSONPinQueryData(); // set wrapper function's name  for jsonp property value
     var queryString = formEncode(this.queryData); // use form-url encoding (function formEncode defined in other lib) 
     this.url += queryString;
   },
   sendRequest: function () {
     this.insertQueryData();
     this.setAsyncCodeProtection();
     this.makeCallbackWrapper();
     this.scriptPlace.appendChild(this.makeScript()); // by puting element into a DOM tree we trigger request
   },
   setAsyncCodeProtection: function () { //  seting variables to check against multiple function invokation
                                         //  and invocation that can happen too late. 
     this.timeout = false;
     if (!this.timeoutInterval) this.timeoutInterval = 2000; // 2s
    
     setTimeout(function () { // when timeout interval runs out
       this.timeout = true;
     }, this.timeoutInterval)

     this.alreadyCalled = false;
   },
   discardScript: function(scriptNum){ // removes script tag from its parent container
       getJSONP.scriptPlace.removeChild(this.scriptTags[scriptNum]); 
   },
   makeCallbackName: function(){
      return this.partName + (this.scriptCount - 1); // subtracting 1 form scriptCount since it was added                                                       // in  checkJSONPinQueryData().
   },
   makeCallbackWrapper: function (){
    var o = {                           // Since all subsequent calls of same instance share variables 
                                        // like "this.scriptCount" and "this.alreadyCalled", each reqest 
                                        // could change them. In order to make that each call of user 
                                        // callback function have it's own snapshot of variables we 
                                        // introduce here in function that sets every user suplied callback
                                        // function.
                                        
       callback: this.makeCallbackName(),
       num: this.scriptCount - 1,       
       alreadyCalled: getJSONP.alreadyCalled 
                               
    }                                  

    _pS_.hook[o.callback] = function (data){ // Setting callback in "hook" (dependency) so                                                                    // it can be available as a reference when getJSONPcontroller
                                             // function finish executing.
                                  
      if(getJSONP.removeScript) getJSONP.discardScript(o.num) // callbackWrapper called, so we no longer
                                                              // need script element.
     
 
      if (getJSONP.timeout){  // on timeout, return. 
        console.log(getJSONPutils.messages.responceNotOnTime);
        return
      }
       
          console.log("alreadyCalled BEFORE","alredyCalled: "+ o.alreadyCalled)
      if (o.alreadyCalled) return; // user function should be invoked just once
      else o.alreadyCalled = true;
      
      if (data) getJSONP.onSuccess.call(getJSONP.context, data); // Finally here we call user suplied callback. 
      else getJSONP.onFailure(); // when data is "falsy" call onFailure()
      
     }

   } 
 }

 getJSONP.__proto__ = Object.create(getJSONPutils); // making prototype connection(linking object)

/* - PHANTOM HEAD method - 
 Every function we want to be private we bind it to top of prototype chain (getJSONP)
 in this case. So when we return public API object it is not connected to prototype chain. Not directly.
 Indirectly it is conected by closures that binded function form to prototype chain of this two objects 
 (getJSONP and getJSONPutils). In this way we have the benefits of modeling software with "behavior delegat ion"
 and setting private properties/functions. Because we bind fucntions of publicAPI to top of prototype chain that is where properties are created.
 In this way publicAPI is like a "phantom head":

 |publicAPI|----only-fucntions-we-choose--|getJSONP|--->|getJSONPutils|.(arrow means prototype connection). 
 Notice  no arrow from publicAPI to top of prototype chain(getJSONP). Has acces to the rest of the prototype 
 "body" in an "indirect" way. 
*/

   return publicAPI = {
      setUrl :  getJSONP.setUrl.bind(getJSONP),
      setQueryData:  getJSONP.setQueryData.bind(getJSONP),
      setScriptPlace:  getJSONP.setScriptPlace.bind(getJSONP),
      setCallback:  getJSONP.setCallback,// function doesn't have "this" reference so binding is unnecessary
      getData:  getJSONP.getData.bind(getJSONP),
      setTimeout:  getJSONP.setRequestTimeout.bind(getJSONP)
   }
 })
} // if condition end
console.log("getJSONPcontroller.js loaded");

