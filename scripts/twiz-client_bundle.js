(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function() {
  var RequestToken = require('twiz-client-requesttoken');
  var Redirect     = require('twiz-client-redirect');
  var AccessToken  = require('twiz-client-accesstoken');

  var request = require('twiz-client-request');

  function buildOAuthLeg (leg_){
 
      function OAuthLegBuilder(){
         
         leg_.call(this);                   // attach to any of oauth legs
        
         this.legParams  = this[this.name]; // oauth params for this leg

         this.phases = {                             // OAuth leg build phases

            leg:   '',                // any of oauth legs (steps)
            api:   '',                // api calls (calls afther we've acquired access token)
            other: ''
         }
          
         var setOAuthLeg = function(args) {                       // set oauth leg params as url (query) params
         
            this.setUserParams(args);                             // parse user suplied params
            this.checkUserParams(this.name);                      // check the ones we need for this leg
            this.setNonUserParams();                              // set calculated params
         
            this.OAuthParams('add', this.oauth, this.legParams);  // add oauth params for this leg
           
            if(this.specificAction)
              this.specificAction();                                // action specific to each leg 

            this.setRequestOptions(this.name);
            this.addQueryParams(this.phases.leg.toString(), this.name);// add leg params as url parameters

         }.bind(this);

         setOAuthLeg.toString = function(){ return 'leg'};    // redefine toString to reflect phase name

         var setAPI = function (){                            // setting (twitter) api request options
            
            this.OAuthParams('remove', this.oauth, this.legParams); // remove oauth leg params
            this.OAuthParams('add',  this.oauth, this.apiCall);     // add params for api call
     
            if(this.UserOptions.params)               
             this.oauth = this.OAuthParams('add', this.UserOptions.params, this.oauth);

            this.addQueryParams(this.phases.api.toString(), this.UserOptions); // adding user params as url para

         }.bind(this);

         setAPI.toString = function(){ return 'api' }
         
         this.phases.leg = setOAuthLeg;
         this.phases.api = setAPI;
         

      }
   
      OAuthLegBuilder.prototype = Object.create(leg_.prototype);
  
      OAuthLegBuilder.prototype.OAuthLegPlus = function(args, resolve){ // add query params for each phase

         this.phases.leg(args);              // standard oauth leg parameters added as url params
         this.phases.api();                  // add parameters for api call (call after 3-leg dance) as url para
         if(this.phases.other) this.phases.other();     // add any other parameters as url params
         
         console.log('leg: ', this.name)
         console.log('this.phases: ', this.phases);
         this.send(this.options, this.callback.bind(this, resolve)); // send request to server
      }

      OAuthLegBuilder.prototype.send = function (options, cb){     // was (vault, resolve, leg) 
        console.log('request SENT +')
       
        options.callback = cb // sets callback function
        
        console.log("OPTIONS ->", options);
 
         request(options);  
      }
  
      return new OAuthLegBuilder();
   }

   function twizClient (){   
     
     this.haste = function(args){ // Brings data immediately ( when access token is present on server), or
                                  // brings request token (when no access token is present on server) and redirects
         if(Promise)
           return this.promised(args, this.RequestTokenLeg())  // promisify request_token step (leg)
         
         this.RequestTokenLeg().OAuthLegPlus(args)          
     }

     
     this.flow = function(args){ // Authorizes redirection and continues OAuth flow (all 3 legs are hit) 
         console.log('in flow ____') 
         if(Promise)
           return this.promised(args, this.AccessTokenLeg());  // promisify access token step

         this.AccessTokenLeg().OAuthLegPlus(args);
     }

     this.promised = function(args, leg){                        // Promisifies the OAuth leg requests
         return new Promise(function (resolve, reject){          // return promise
                    leg.OAuthLegPlus(args, resolve);             // launch request
         });

     }
     
     this.getSessionData = function(){                           // Parse any session data from url
                                                                 
        this.accessTokenLeg = (this.accessTokenLeg || this.AccessTokenLeg()) // if exist dont make new one
        return this.accessTokenLeg.getSessionData();                         // return data from url
     }

     this.RequestTokenLeg = function() {
        
        var requestTokenLeg = buildOAuthLeg(RequestToken);

        requestTokenLeg.phases.other = function setVerifyCredentials(){ // sets one more phase for request token
                                                                        // leg. Adds access token verification 
             
           console.log('in setVErifyCredentials')
           var credentialOptions = {                    // verify credential(access token) options
              options:{ 
                 path: 'account/verify_credentials.json',
                 method: 'GET',
                 params:{               // avalable params for this api endpoint (server decides which are used)
                   include_entities: false,
                   skip_status: true,
                   include_email: true
                 },
                 paramsEncoded:'' 
             }
           }
        
           this.setUserParams(credentialOptions); // use this function to set UserOptions;          
           
           this.oauth = this.OAuthParams('add', this.UserOptions.params, this.oauth);  // add params to oauth
           this.addQueryParams('ver', this.UserOptions);          // add query params for this phase

        }.bind(requestTokenLeg)
        

        requestTokenLeg.callback = function(resolve, error, sentData){  // afther request token, redirect
             
            var authorize = new Redirect({                     // make redirect instance
               newWindow:      this.newWindow,                 // pass newWindow specs
               redirectionUrl: this.absoluteUrls[this.leg[1]], 
               callback_func:  this.callback_func              // callback function user supplied 
            })

            authorize.redirection(resolve, error, sentData);   
        }
 
        return requestTokenLeg;       
     }  

     this.AccessTokenLeg = function(){  

        var accessTokenLeg = buildOAuthLeg(AccessToken);
        accessTokenLeg.specificAction = function(){

           this.setAuthorizedTokens();
        }
  
        accessTokenLeg.callback = function(resolve, error, sentData){ // 
        
           if(error) console.log('after access_token (error):', error)
           else console.log('after access_token (data):', sentData);

           this.deliverData(resolve, { 'error': error, 'data': sentData });    // delivers data to user     

        }

        return  accessTokenLeg;
     }
      
         
   }
   
   function twiz(){
      var r = new twizClient(); 
      
      var head = {
         haste :         r.haste.bind(r),
         flow:           r.flow.bind(r),
         getSessionData: r.getSessionData.bind(r)
      }
      //if(window.BROWSER_ENV = 'TEST') 
      return head ; 
   }
   
  if(typeof window === 'object' && window!== 'null') window.twizClient = twiz ; 
  else if (typeof module === 'object' && module !== 'null') module.exports = twiz;
//  console.log('module.exports: ', module.exports);

})();  

  if(typeof window === 'object') console.log('window.twizClient: ', window.twizClient)





},{"twiz-client-accesstoken":2,"twiz-client-redirect":8,"twiz-client-request":9,"twiz-client-requesttoken":10}],2:[function(require,module,exports){
var OAuth       = require('twiz-client-oauth');
var deliverData = require('twiz-client-redirect').prototype.deliverData;

 function AccessToken (){         // Prepares data for Access Token leg
                                  // Checks that oauth data is in redirection(callback) url, and makes sure
                                  // that oauth_token from url matches the one we saved in first step. 
      OAuth.call(this);
      this.name = this.leg[2];

      this.redirectionUrlParsed;  // redirection(callback) url parsing status
      this.redirectionData;       // parsed data from redirection url

      this.loadedRequestToken;    // place to load token 
      this.authorized;            // redirection data that was autorized; 
      this.winLoc = window.location.href;  // get current url

      this.addCustomErrors({      // add  error messages related to this module
         verifierNotFound: '"oauth_verifier" string was not found in redirection(callback) url.',
         tokenNotFound: '"oauth_token" string was not found in redirection(callback) url.',
         tokenMissmatch: 'Request token and token from redirection(callback) url do not match',
         requestTokenNotSet: 'Request token was not set',
         requestTokenNotSaved: 'Request token was not saved. Check that page url from which you make request match your redirection_url.',
         noRepeat: "Cannot make another request with same redirection(callback) url",
         urlNotFound: "Current window location (url) not found",
         noSessionData: 'Unable to find session data in current url'
      })
   }
  
   AccessToken.prototype = Object.create(OAuth.prototype);

   AccessToken.prototype.setAuthorizedTokens = function(){

      this.authorizeRedirectionUrl(),
                                             // set params for access token leg explicitly 
      this.oauth[this.prefix + 'verifier'] = this.authorized.oauth_verifier // Put authorized verifier
      this.oauth[this.prefix + 'token']    = this.authorized.oauth_token;   // Authorized token
   }
 
   AccessToken.prototype.authorizeRedirectionUrl = function(){// makes sure we have needed data in redirection url
     this.parseRedirectionUrl(this.winLoc);          // parse url 
     return this.authorize(this.redirectionData);    // authorize token
     
   }

   AccessToken.prototype.parseRedirectionUrl = function(url){ // parses data in url 
      console.log('in parseRedirectionUrl');

      var str = this.parse(url, /\?/g, /#/g);              // parses query string
      this.redirectionData = this.parseQueryParams(str);   // parse parameters from query string

      this.redirectionUrlParsed = true;                    // indicate that the url was already parsed  
      
      console.log('redirectionData: >>', this.redirectionData);
   }

   AccessToken.prototype.parse = function(str, delimiter1, delimiter2){ // parses substring of a string (str) 
                                                                     
       if(!str) throw this.CustomError('urlNotFound');

       var start = str.search(delimiter1);   // calculate from which index to take 
       var end ; 
       if(!delimiter2 || str.search(delimiter2) === -1) end = str.length;// if del2 was not passed as argument
                                                                         // or we didnt find it, then end index
                                                                         // is length of the string.
       else end = str.search(delimiter2);    // calcualte to which index to take                                                             
       // console.log(str); 
       return str.substring(start, end);     // return substring
            
   };

     
   AccessToken.prototype.parseQueryParams = function (str){
      var arr  = [];
       
      if(str[0] === "?") str = str.substring(1); // remove "?" if we have one at beggining

      arr = str.split('&')                       // make new array element on each "&" 
            .map( function(el, i){ 
                 var arr2 =  el.split("=");      // for each element make new array element on each "=" 
                 return arr2;   

             });
     
      // console.log(arr);
      return  this.objectify(arr);                  // makes an object from query string parametars
   }

   AccessToken.prototype.objectify = function(array){// makes new object with props and values from array's 
                                                     // elements
      var data = {};
      var len = array.length;
      
      for(var i = 0; i < len; i++){
            var arr = array[i];
            for(var j = 0; j < arr.length; j++){   // iterating though each of arrays in parsed
               if(j == 0) data[arr[j]] = arr[j+1]; // if we are at element that holds name of property, 
                                                   // make property with that name in data object, set it's
                                                   //  value of next element (j+1)
          }
      } 
      
      return data;
   } 
   
   AccessToken.prototype.authorize = function(sent){ // check that sent data from redirection url has needed info
     
       console.log('in authorize');
      if(this.isRequestTokenUsed(window.localStorage))          
        throw this.CustomError('noRepeat');
      
      console.log('post noRepeat')
      if(!sent.oauth_verifier) throw this.CustomError('verifierNotFound');
      if(!sent.oauth_token)    throw this.CustomError('tokenNotFound');

      this.loadRequestToken(window.localStorage, sent);                      // load token from storage  
                                                                             
                                                                             // check that tokens match
      if(sent.oauth_token !== this.loadedRequestToken) throw this.CustomError('tokenMissmatch');

      return this.authorized = sent;                       // data passed checks, so its authorized;                     
   }

   AccessToken.prototype.isRequestTokenUsed = function(storage){ // check that we have a token to use 

     if(storage.requestToken_ === "null") return true; // token whould be "null" only when  loadRequestToken() 
                                                       // runs twice on same redirection(callback) url
     return false;
   }

   

   AccessToken.prototype.loadRequestToken = function(storage, sent){
     
     if(!storage.hasOwnProperty('requestToken_')) throw this.CustomError('requestTokenNotSaved');  

     this.loadedRequestToken = storage.requestToken_;           // load token from storage

     // console.log('storage after: ', storage.requestToken_);
     // console.log('this.loadedRequestToken :', this.loadedRequestToken);

     storage.requestToken_ = null;                              // since we've loaded the token, mark it as 
                                                                // used/erased with null 
     // console.log('after erasing storage.requestToken :', storage.requestToken_);  
     console.log('loadedRequestToken',this.loadedRequestToken);
     if (!this.loadedRequestToken) throw this.CustomError('requestTokenNotSet');
   }
   
   AccessToken.prototype.getSessionData = function(){       // gets session data from redirection url
         //  console.log('in getSessionData')
         if(!this.redirectionUrlParsed) 
          this.parseRedirectionUrl(window.location.href);   // parse data from url 
         
         if(!this.redirectionData.data){  // return if no session data
            console.warn(this.messages['noSessionData']);
            return;
         }
          
         this.sessionData = this.parseSessionData(this.redirectionData.data) // further parsing of session data
         //console.log('sessionData: ',this.sessionData);
         return this.sessionData;
   }

   AccessToken.prototype.parseSessionData = function(str){
       if(/%[0-9][0-9]/g.test(str))                       // See if there are percent encoded chars
       str = decodeURIComponent(decodeURIComponent(str)); // Decoding twice, since it was encoded twice
                                                          // (by OAuth 1.0a specification). See genSBS function.
       return this.parseQueryParams(str);                 // Making an object from parsed key/values.
   }

   AccessToken.prototype.deliverData = deliverData;       // borrow function from Redirect module

   module.exports = AccessToken;


},{"twiz-client-oauth":6,"twiz-client-redirect":8}],3:[function(require,module,exports){
'use strict'
 
   function percentEncode(str){                                     // percent encode by RFC3986
   
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c){ // percent encodes unsafe chars, then
                                                                     // it follows RFC3986 and percent encodes
                                                                     // reserved characters in sqere brackets.
         return '%' + c.charCodeAt(0).toString(16);   // takes binary representation of every reserved char
                                                      // , coverts it to hex string char and appends to "%".
      });
 
   }

   function formEncode(dataObj, spaces){ // form encodes an object (optionaly changes '+' for '%20')
       var pairs = [];
       var value;
       var key;
       var type;
        for(var name in dataObj){
            type = typeof dataObj[name];
             if(dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null"){ // only props 
                                                                                           // in dataObj 
                  key = percentEncode(name);   // encode property name

                  if(type === 'object'){                         
                     value = formEncode(dataObj[name], spaces); // form encode object
                     value = percentEncode(value)          // since return value is string, percent encode it
                  }                      
                  else value = percentEncode(dataObj[name]) // property is not object, percent encode it
                  
                  if(!spaces){
                     key = key.replace(/%20/g, "+") 
                     value = value.replace(/%20/g, "+"); // substitute space encoding for +
                  }
                 
                  pairs.push(key + "=" + value)                 
             }
        }

      return pairs.join("&");
  } 

  
   function CustomError(){
       
       this.messages = {}; // error messages place holder    
   
       
       this.addCustomErrors = function (errors){  // add custom error messages
 
          Object.getOwnPropertyNames(errors).map(function(name){
     
            this.messages[name] = errors[name];
          },this)
       }

       this.CustomError = function(name){// uses built-in Error func to make custom err info

          var err = Error(this.messages[name]);      // take message text
          err['name'] = name;                          // set error name
          return err; 
       }


   }

   module.exports = {
      percentEncode: percentEncode,
      formEncode:    formEncode,
      CustomError:   CustomError
   }

},{}],4:[function(require,module,exports){
 var utils = require('twiz-client-utils');
   
   var formEncode    = utils.formEncode;
   var request       = utils.request;
   var CustomError   = utils.CustomError;
   
    
   function Options (){  // prepares request options used in 3-leg OAuth 1.0a 
      
      
      this.leg = ["request_token", "authorize", "access_token"];  // Names of each leg (step) in 3-leg OAuth
                                                                  // to twitter. Names are also url path ends:
                                                                  // http://api.twitter.com/oauth/request_token
      
      this.httpMethods = {}     // This is the current sequence of http methods we use in 3-leg authentication 
      this.httpMethods[this.leg[0]] = "POST"
      this.httpMethods[this.leg[1]] = "GET"                                          
      this.httpMethods[this.leg[2]] = "POST" 
      
      this.twtUrl = {            // Parts of twitter api url
           "protocol": "https://",
           "domain": "api.twitter.com",
           "path": "/oauth/",    // 'path' is actualy just part of complete path, used in 3-leg dance 
           "api_path": "/1.1/"   // Api path for calls afther authorization/access_token
      }  
     
      this.apiUrl =  this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.path; // here we store absolute url                                                                                   // without leg.
 
      this.absoluteUrls = {}    // Here we put together the complete url for each leg (step) in authentication
      this.absoluteUrls[this.leg[0]] = this.apiUrl + this.leg[0]; 
      this.absoluteUrls[this.leg[1]] = this.apiUrl + this.leg[1];
      this.absoluteUrls[this.leg[2]] = this.apiUrl + this.leg[2];

      this.lnkLabel = {  // link label, used to make url sufficiently unique
          name : 'twiz_',
          data : {
            'id' : 'he who dares '
          }
      } 
       
      
      this.UserOptions = {  // user provided api options, used for twitter api calls
         host: '',
         path: '',
         method: '',
         params: '',
         paramsEncoded: '', 
         SBS: '',
         AH: '',
         body: '',
         encoding: ''
      }
    
      this.options = {};           // request options we send to server
      this.options.url = '';
      this.options.method = '';
      this.options.queryParams = {
        legHost: '',               // oauth leg params     
        legPath: '',
        legMethod: '',
        legSBS: '',
        legAH: ''
      };

      this.options.body = '';
      this.options.encoding = '';
      this.options.beforeSend = '';
      this.options.callback = '';      // Callback function
      this.options.parse = true ;      // if json string, parse it

      CustomError.call(this);          // add CustomError feature
      this.addCustomErrors( {          // set errors for this module

         redirectionUrlNotSet: "You must provide a redirection_url to which users will be redirected.",
         noStringProvided: "You must provide a string as an argument." ,
         serverUrlNotSet:  "You must proivide server url to which request will be sent",
         optionNotSet:     "Check that \'method\' and \'path\' are set."
      })

      
   }
 
  

   Options.prototype.setUserParams = function(args){ // sets user suplied parametars 
         var temp; 
         for(var prop in args){    // iterate trough any user params
            temp = args[prop];

            switch(prop){
               case "server_url":       // where the server code runs 
                 this.server_url = temp;
               break;
               case "redirection_url": // this is the url to which user gets redirected by twiiter api, 
                 this[this.leg[0]].oauth_callback = temp;
               break; 
               case "new_window":      // object that holds properties for making new window(tab/popup)
                 this.newWindow = {};
                 for(var data in temp){
                    if(temp.hasOwnProperty(data))
                    switch(data){
                       case "name":
                         this.newWindow[data] = temp[data];
                       break;
                       case "features":
                         this.newWindow[data] = temp[data];
                       break;
                    }
                 } 
               break;
               case 'callback_func':    // user supplied callback function (called if Promise is not available)
                 this.callback_func = temp;
               break;
               case "session_data":
                 this.session_data = temp;
               break;
               case "options":
                 for (var opt in temp){
                    switch (opt){
                       case "method":
                          this.UserOptions[opt] = temp[opt];          
                       break;
                       case "path":
                          this.UserOptions[opt] = temp[opt];          
                       break;
                       case "params":
                          this.UserOptions[opt] = temp[opt];
                          this.UserOptions.paramsEncoded = "?" + formEncode(temp[opt], true);          
                       break;
                       case "body":
                          this.UserOptions[opt] = temp[opt];          
                       break;
                       case "encoding":
                          this.UserOptions[opt] = temp[opt];          
                       break; 
                       case 'beforeSend':
                           this.UserOptions[opt] = temp[opt]; 
                       break;
                    } 
                 }
               break;
               case "urls":              // when we get urls object, we check for urls provided
                                         // for each leg (part) of the 3-leg authentication.
                 for(var leg in temp){
                   switch(leg){
                     case "request_token":
                       this.absoluteUrls[leg] = temp[leg]; // if leg is request_token, update with new url    
                     break;
                     case "authorize":
                       this.absoluteUrls[leg] = temp[leg];
                     break;
                     case "access_token":
                       this.absoluteUrls[leg] = temp[leg];
                     break;
                   } 
                 }
               break;
               case "methods":
                  for(var leg in temp){           // check for legs in provided 'methods' object
                    switch(leg){
                      case "request_token":       // if leg is request, update with the new http method
                        this.httpMethods[leg] = temp[leg];
                      break;
                      case "authorize":          
                        this.httpMethods[leg] = temp[leg];
                      break;
                      case "access_token":         
                        this.httpMethods[leg] = temp[leg];
                      break;
                    } 
                  }
               break;
            }
         }

   }

   
   Options.prototype.checkUserParams = function(leg){
 
      if(!this.server_url) throw this.CustomError('serverUrlNotSet'); // We need server url to send request 
      if(leg === this.leg[0]) this.checkRedirectionCallback();        // Check only in request token step 
      this.checkApiOptions();
      
   }

   Options.prototype.checkRedirectionCallback = function (){ // checks for the url user is returned to
      if(!this[this.leg[0]].oauth_callback) throw this.CustomError('redirectionUrlNotSet');
                                                                // throw an error if one is not set
   }

   Options.prototype.checkApiOptions = function(){ 
      for(var opt in this.UserOptions) {
          if(opt === 'path' || opt == 'method' ){  // mandatory params set by user
            if(!this.UserOptions[opt])             // check that is set
               throw this.CustomError('optionNotSet')
            
          }
      }     
   }
   
   Options.prototype.setRequestOptions = function(leg){
      this.options.url        = this.server_url;           // server address
      this.options.method     = this.httpMethods[leg];     // method for reqest is method for this leg
      this.options.body       = this.UserOptions.body;     // api call have a body, oauth dance requires no body
      this.options.encoding   = this.UserOptions.encoding;  // encoding of a body
      this.options.beforeSend = this.UserOptions.beforeSend; // manipulates request before it is sent
   }
   
   module.exports = Options;


},{"twiz-client-utils":3}],5:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],6:[function(require,module,exports){
var Options       = require('twiz-client-options');
var percentEncode = require('twiz-client-utils').percentEncode;
var formEncode    = require('twiz-client-utils').formEncode; 
var btoa;

if(typeof window === 'object' && window != null) btoa = window.btoa; 
else btoa = require('btoa');         // in node require node implementation of browser's btoa (used when testing)

   function OAuth(){                 // Prepares oauth strings for a request
      Options.call(this);
     
      this.leadPrefix = "OAuth "     // leading string afther all key-value pairs go. Notice space at the end. 
      this.prefix = "oauth_";        // Prefix for each oauth key in a http request
      
      this.oauth = {}                                // Holds parameters that are used to generate SBS and AH
      this.oauth[ this.prefix + 'consumer_key'] = "";// This is very sensitive data. Server sets the value.
      this.oauth[ this.prefix + 'signature'] = "";   // This value is also inserted in server code.
      this.oauth[ this.prefix + 'nonce'] =  "";     // Session id, twitter api uses this to determines duplicates
      this.oauth[ this.prefix + 'signature_method'] = ""; // Signature method we are using
      this.oauth[ this.prefix + 'timestamp'] = "";   // Unix epoch timestamp
      this.oauth[ this.prefix + 'version'] = ""      // all request use ver 1.0
      
      this[this.leg[0]] = {};                        // oauth param for request token step
      this[this.leg[0]][ this.prefix + 'callback'] = ''; // User is return to this link, 
                                                                          // if approval is confirmed   
      // this[this.leg[1]] = {}                     // there is no oauth params for authorize step. request_token                                                    // is sent as redirection url query parameter.
                               
      this[this.leg[2]] = {}                        // oauth params for access token step
      this[this.leg[2]][ this.prefix + 'token'] = '';  
      this[this.leg[2]][ this.prefix + 'verifier'] = '';
     
      this.apiCall = {}
      this.apiCall[ this.prefix + 'token'] = '';   // oauth param for api calls. Here goes just users acess token
                                                   // (inserted by server code)
      
      this.OAuthParams = function(action, o1, o2){      // Props found in o2 adds or removes from o1
          Object.getOwnPropertyNames(o2)
                  .map(function(key, i){
                       if(action === 'add') o1[key] = o2[key]; // add property name and value from o2 to o1
                       else delete o1[key];                    // removes property name we found in o2 from o1 
                   })
          return o1;
      }

       
   }

   OAuth.prototype = Object.create(Options.prototype);

   OAuth.prototype.setNonUserParams = function(){ // sets all "calculated" oauth params 
      this.setSignatureMethod();
      this.setNonce();
      this.setTimestamp();
      this.setVersion();
   }
   
   OAuth.prototype.setSignatureMethod = function(method){
      this.oauth[this.prefix + 'signature_method'] = method || "HMAC-SHA1";
   }

   OAuth.prototype.setVersion = function(version){ 
      this.oauth[ this.prefix + 'version'] =  version || "1.0";
   }

   OAuth.prototype.setNonce = function(){ // Generates string from random sequence of 32 numbers, 
                                          // then returns base64 encoding of that string, striped of "=" sign.
      var seeds = "AaBb1CcDd2EeFf3GgHh4IiJjK5kLl6MmN7nOo8PpQqR9rSsTtU0uVvWwXxYyZz"; 
      var nonce = "";
  
      for(var i = 0; i < 31; i++){
        nonce += seeds[Math.round(Math.random() * (seeds.length - 1))];// pick a random ascii from seeds string
      }
    
      nonce = btoa(nonce).replace(/=/g,"");       // encode to base64 and strip the "=" sign
     //  console.log("nonce: " + nonce)
      this.oauth[ this.prefix + 'nonce'] = nonce; // set twitter session identifier (nonce)
   }

   OAuth.prototype.setTimestamp = function(){
      this.oauth[ this.prefix + 'timestamp'] = (Date.now() / 1000 | 0) + 1;// cuting off decimal part by 
                                                   // converting it to 32 bit integer in bitwise OR operation. 
   }

   OAuth.prototype.addQueryParams = function(phase, leg){ // 'phase' indicates for which type of request we are
                                                          // adding params. 
    //  console.log('addQueryParams phase:', phase +'' );
      this.options.queryParams[phase + 'Host']   = this.twtUrl.domain;
      this.options.queryParams[phase + 'Path']   = phase === 'leg' ? this.twtUrl.path + leg : 
                                                                    this.twtUrl.api_path +
                                                                    this.UserOptions.path +
                                                                    this.UserOptions.paramsEncoded;
     
      this.options.queryParams[phase + 'Method'] = phase === 'leg' ? this.httpMethods[leg] : this.UserOptions.method;
      this.options.queryParams[phase + 'SBS']    = this.genSignatureBaseString(leg); 
      this.options.queryParams[phase + 'AH']     = this.genHeaderString();
   }
   
   OAuth.prototype.genSignatureBaseString = function(leg){    // generates SBS  
         this.signatureBaseString = '';
         var a = [];
         for(var name in this.oauth){                         // takes every oauth params name
            if(this.oauth.hasOwnProperty(name)) a.push(name); // and pushes them to array
         } 
     
         a.sort();  // sorts alphabeticaly

         var pair;  // key value pair
         var key;   // parameter name
         var value; // param value   
                                              // Collects oauth params
         for(var i = 0; i < a.length; i++){   // Percent encodes every key value, puts "=" between those, and
                                              // between each pair of key/value it puts "&" sign.
            key = a[i];                       // Thakes key that was sorted alphabeticaly
            switch(key){                      // In case of consumer and user keys we leave them to server logic
              case "oauth_callback":   // Callback url to which users are redirected by twitter         
                                       // Check to see if there is data to append to calback as query string:
                value = this.session_data ? this.appendToCallback(this.session_data) : 
                                                this.oauth[this.prefix + 'callback']; 
              break; 
              case "oauth_consumer_key": 
                value = "";             // Sensitive data we leave for server to add
              break;   
              case "oauth_signature":
                continue;              // We dont add signature to singatureBaseString at all
              break;
              default:
                value = this.oauth[key];          // Takes value of that key
            }
            pair = percentEncode(key) + "=" + percentEncode(value); // Encodes key value and inserts "="
          // console.log(pair)                                         // in between.
            if(i !== a.length - 1) pair += "&"; // Dont append "&" on last pair    
            this.signatureBaseString += pair;   // Add pair to SBS
         } 

         var method;  // Collecting the reqest method and url
         var url;

         if(typeof leg === 'string'){            // we are in 3-leg dance, take well known params
           method = this.httpMethods[leg]        // Get the method for this leg
           method = method.toUpperCase() + "&";  // upercase the method, add "&"

           url = this.absoluteUrls[leg];         // Get the absolute url for this leg of authentication
           url = percentEncode(url) + "&";       // Encode the url, add "&".
         }
         else {                                      // 'leg' is the options object user provided     
           method = leg.method.toUpperCase() + "&";  // Upercase the method, add "&"
           url = this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.api_path + leg.path;     
                                                     // Get the absoute url for api call + user provided path
           url = percentEncode(url) + "&";           // Encode the url, add "&".
         }
         // Finaly we assemble the sbs string. PercentEncoding again the signature base string.
         this.signatureBaseString = method + url + percentEncode(this.signatureBaseString);
        return this.signatureBaseString;
   }

   OAuth.prototype.genHeaderString = function(){
      var a = [];
       
      Object.getOwnPropertyNames(this.oauth)
      .forEach(function(el){ if(!/^oauth/.test(el)) delete this[el] }, this.oauth) // delete non oauth params
      
      for(var name in this.oauth){
          a.push(name);
      }
      //console.log("a; " + a);
      a.sort();                           // Aphabeticaly sort array of property names

      var headerString = this.leadPrefix; // Adding "OAuth " in front everthing
      var key;                            // Temp vars
      var value;
      var pair;
    
      for(var i = 0; i < a.length; i++){  // iterate oauth  
         
          key = a[i];                                    // Take the key name (sorted in a)

          value = this.oauth[key];   // Get it from oauth object
      
          key = percentEncode(key);  // Encode the key
          value = "\"" + percentEncode(value) + "\"";    // Adding double quotes to value
          
          pair = key + "=" + value;                  // Adding "=" between
          if(i !== (a.length - 1)) pair = pair + ", " // Add trailing comma and space, until end

          headerString += pair;       
      } 
      return headerString;
   }

   OAuth.prototype.appendToCallback = function(data, name){ // appends data object as querystring to                                                                         // oauth_callback url. 
      //console.log('Data: ==> ', data)
      if(!name) name = "data";
      var callback = this.oauth[ this.prefix + 'callback'];
      var fEncoded = formEncode(data, true);

      //console.log(fEncoded);
      var queryString = name + '=' + percentEncode(fEncoded); // Make string from object then                                                                                  // percent encode it.  
      //console.log("queryString: ", queryString)
    
      if(!/\?/.test(callback)) callback += "?";               // Add "?" if one not exist
      else queryString =  '&' + queryString                   // other queryString exists, so add '&' to this qs
      this.oauth[ this.prefix + 'callback'] = callback + queryString;           // Add queryString to callback
                                                     
    //   console.log("OAUTH CALLBACK: "+this.oauth[ this.prefix + 'callback'])
      return this.oauth[ this.prefix + 'callback'];
   };

   module.exports = OAuth;

},{"btoa":undefined,"twiz-client-options":4,"twiz-client-utils":5}],7:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],8:[function(require,module,exports){
var CustomError = require('twiz-client-utils').CustomError;
   
   function Redirect (args){     // used to redirect user to twitter interstitals page (authorize leg)
    
      this.newWindow     = args.newWindow;
      this.url           = args.redirectionUrl;
      this.callback_func = args.callback_func;
      console.log('redirection url ->>>: ', this.url) 
      // OAuth.call(this);

      this.requestToken;    // data from request token step   
      
      CustomError.call(this); // add CustomError feature
      this.addCustomErrors({
         noCallbackFunc: 'You must specify a callback function',
         callbackURLnotConfirmed: "Redirection(callback) url you specified wasn't confirmed by Twitter"
      })
   }

   // Redirect.prototype = Object.create(OAuth.prototype);
  

   Redirect.prototype.redirection = function(resolve, error, sentData){ // Callback function for 2nd step
                                                  
      //console.log("From twitter request_token: ", sentData);
      //console.log('sentData type: ',typeof sentData);
      //console.log('error :', error);

      if(error || !sentData.oauth_token){ // on error or on valid data deliver it to user 
      
         this.deliverData(resolve, {'error': error, 'data': sentData});
         return;
      }
 
      this.requestToken = sentData;      // set requestToken data
      this.confirmCallback(sentData);    // confirm that twitter accepted user's redirection(callback) url
      this.saveRequestToken(window.localStorage, sentData.oauth_token); 
      this.redirect(resolve)             // redirect user to twitter for authorization 
   };
   
   Redirect.prototype.deliverData = function(resolve, obj){ // delivers data to user by promise or
                                                                        // by callback function
     // console.log('in deliverData, obj:', obj);
      if(resolve){ //console.log('has promise')
         resolve(obj);
         return;
      }
      
      if(this.callback_func) {             // when no promise is avalable invoke callback
         this.callback_func(obj);
         return;
      }
                                       
      throw this.CustomError('noCallbackFunc'); // raise error when there is no promise or callback present                      
   }

   Redirect.prototype.confirmCallback = function (sent){ // makes sure that twitter is ok with redirection url
      // console.log('confirmed: +++ ',sent.oauth_callback_confirmed)
      if(sent.oauth_callback_confirmed !== "true") throw this.CustomError('callbackURLnotConfirmed');
   }
 
   Redirect.prototype.saveRequestToken = function(storage, token){ // save token to storage
      storage.requestToken_ = null;                                // erase any previous tokens, note null is
                                                                   // actualy transformed to string "null"
               
      storage.requestToken_ =  token;                              // save token to storage
      //console.log('storage before: ', storage); 
   }

   Redirect.prototype.redirect = function(resolve){ // redirects user to twitter for authorization   
      //console.log('RESOLVE : ', resolve);
      var url = this.url + "?" + 'oauth_token=' + this.requestToken.oauth_token; 
                                                                                 // assemble url for second leg

      if(!this.newWindow){ // single page app
         this.SPA(resolve, url); // redirects current window to url
         return;

      }
                         
      this.site(resolve, url); // site
      
   };

   Redirect.prototype.SPA = function(resolve, url){   // logic for Single Page Apps
      function redirectCurrentWindow(){ window.location = url; }// redirects window we are currently in (no popUp)
      var obj = { 'redirection': true } // since there is no newWindow reference, just indicate redirection
      
      if(resolve){                   // resolve promise
         resolve(obj);               // resolve with obj
         Promise.resolve()             
         .then(function(){          // redirect asap
            redirectCurrentWindow() 
         })
         return;
      }

      if(this.callback_func){     // when no promise call user callback func
         this.callback_func(obj);                                   // run callback with token
         setTimeout(function(){ redirectCurrentWindow() }, 0) ;  // redirect asap
         return; 
      }

      
      throw this.CustomError('noCallbackFunc'); // raise error when there is no promise or callback present
   }

   Redirect.prototype.site = function(resolve, url){ 
      //console.log('>>> Site')

      var opened = this.openWindow();       // open new window/popup and save its reference
      opened.location = url;                // change location (redirect)
       
      this.deliverData(resolve, { 'window': opened })       // newWindow reference
   
   }

   Redirect.prototype.openWindow = function(){ // opens pop-up and puts in under current window
      //console.log("==== POP-UP =====");
      this.newWindow.window = window.open('', this.newWindow.name, this.newWindow.features);
      // console.log("this.newWindow: ", this.newWindow.window ); 

      return this.newWindow.window;
   }

   module.exports = Redirect;


},{"twiz-client-utils":7}],9:[function(require,module,exports){
var CustomError = require('twiz-client-utils').CustomError;
var formEncode  = require('twiz-client-utils').formEncode;

var request = (function(){ 
    var request = {};

    CustomError.call(request);                                     // add CustomError functionality
    request.addCustomErrors({                                      // add custom errors
      cbAlreadyCalled:    "Callback function has already been called.",
      cbWasNotCalled:     "Calback function provided was not called.",
      urlNotSet:          "You must provide url for the request you make",
      callbackNotProvided:"Callback function was not provided.",
      notJSON:            "Received data not in JSON format",
      encodingNotSupported:"Encoding you provided is not supported",
      noContentType:       "Failed to get content-type header from response. Possible CORS restrictions.",
      methodMustBePOST:    "If request has body, method must be POST"
    });

    request.initRequest = function(args){ // Propertie names, in args object, that this function supports are:
                                          //  url,method, queryParams, callback, httpMethod, body, beforeSend
      this.request = this.createRequest(); // Creates XMLHttpRequest object
      var temp;                           // Temporary place holder
      
      for(var prop in args){           // iterates trough every argument provided
         if(!args.hasOwnProperty(prop)) continue;
         temp = args[prop];         
         switch(prop){
            case "url":
              this.setUrl(temp);        // sets the reqest url
            break;
            case "queryParams":
              this.setQuery(temp);      // Makes query string for url
            break;
            case "callback":
              this.addListener(temp);   // Adds listener for succesful data retrieval and invokes callback
            break;
            case "method":
              this.method = temp.toUpperCase() || "GET" // request method
            break;
            case "body": 
              this.body = temp;          // add body for request
            break;
            case "parse":
              this.parse = temp;
            break; 
            case "encoding":
              this.encoding = temp;
            break;
            case "beforeSend":
              this.beforeSend = temp // For instance, if we need to set additonal request specific headers 
                                     // this.beforeSend is invoked before sending the request, but afther open()
                                     // is called. Here we have created new property.
            break;
         }    
      }
 
      if(!this.url) throw this.CustomError('urlNotSet'); // Throw error if url was not provided in args
      if(!this.method) this.method = "GET";              // Defaults to "GET" method 
      if(!this.request.onreadystatechange) throw this.CustomError('callbackNotProvided'); // cb missing
      
      // console.log(args);
      this.sendRequest();                                // Makes the actual http request

    }; 
 
    request.createRequest = function(){
        try{
            return new XMLHttpRequest(); // standard
        }
        catch(e){  console.log(e);
            try{ 
                return new ActiveXObject("Microsoft.XMLHTTP");  // IE specific ...
            }
            catch(e){
                return new ActiveXObject("Msxml12.XMLHTTP");
            }
        }
    }

    request.setUrl = function(url){
      if(!this.url) this.url = url;
      else this.url = url + this.url;  // if setQuery() run before set url, we already have query string
                                       // in "this.url". So "url" needs to go first.
    };

    request.setQuery = function(queryParams){
      this.queryString = formEncode(queryParams);     // Form-url-encoded object 
      if(this.url.indexOf("?") === -1) this.url+="?"; // If doesnt have query delimiter add it
      this.url+= this.queryString;                    // Adds query string to url 

    };
   
    request.addListener = function(callback) {
      var alreadyCalled = false;

      this.request.onreadystatechange = function(){
          
         if(this.request.readyState === 4){           // check that request is completed
              if(alreadyCalled) throw this.CustomError('cbAlreadyCalled'); // callback is run only once
                
              alreadyCalled = true;

              var statusCode  = this.request.status; 
              var contentType = this.request.getResponseHeader("Content-type");// Get the response's content type
             
              this.invokeCallback(statusCode, contentType, callback);
              
         }   
      }.bind(this); // Async functions lose -this- context because they start executing when functions that 
                    // invoked them already finished their execution. Here we pass whatever "this" references 
                    // in the moment addListener() is invoked. Meaning, "this" will repesent each 
                    // instance of request, see return function below. 
    };

    request.invokeCallback = function (statusCode, contentType, callback){
       var error; 
       var data;
       var temp;

       if(!contentType) throw this.CustomError('noContentType');
       contentType = contentType.split(';')[0]; // get just type , in case there is charset specified 

       //console.log('content-type: ', contentType)
       switch(contentType){              // parse data as indicated in contentType header 
           case "application/json":   
              try{ // console.log('content-type is application/json')
                 if(this.parse) temp = JSON.parse(this.request.responseText); // only if parse flag is set
                 else temp = this.request.responseText;
              }
              catch(e){
                  throw this.CustomError('notJSON');  // if parsing failed note it
              }
           break;   
           case "application/xml":
              temp = this.request.responseXML;        // responceXML already parsed as a DOM object
           break;
           case "application/x-www-url-formencoded":  
              temp =  {}; //console.log('responseText:', this.request.responseText)
              this.request.responseText.trim().split("&").forEach(function(el, i){ // split on &
                   
                  var pairs = el.split('=');                    
                  var name   = decodeURIComponent(pairs[0].replace(/\+/g,' '));   // decode key
                  var value  = decodeURIComponent(pairs[1].replace(/\+/g,' ')); // decode value
                  temp[name] = value;                        // add key and value
              }, temp)
           break;
           default:
              temp = this.request.responseText; // text/html , text/css and others are treated as text
       }

       if(statusCode !== 200){             // on error create error object
          error = { 'status': statusCode, 'statusText': this.request.statusText, 'data': temp }
       }
       else data = temp;                   // no error, data is object we got from payload
 
       
       callback(error, data)               // invoke callback

    }

    request.setHeader = function(header, value){     // set the request header 
       this.request.setRequestHeader(header, value);  
    };

    request.setBody = function(){ // sets Content-Type encoding and encode the body of a request
               //console.log("In setBody")
          if(this.method === 'GET') throw this.CustomError('methodMustBePOST'); // don't set body on GET method
         
          if(!this.encoding){       
            this.setHeader("Content-Type", "text/plain"); // default to text/plain whenno encoding specified
            return
          }
          
          switch(this.encoding.toLowerCase()){      // when there is encoding string
             case "form":
                this.body = formEncode(this.body) // encode the body
                this.setHeader("Content-Type", "application/x-www-url-formencoded;charset=utf-8"); 
             break;
             case "json":
                this.body = JSON.stringify(this.body)  
                this.setHeader("Content-Type", "application/json;charset=utf-8");
             break;
             case "text":
                this.setHeader("Content-Type", 'text/plain;charset=utf-8');
             break;
             default:
                throw this.CustomError('encodingNotSupported');
          }
 
    };
    request.sendRequest = function(){

      if(this.request.readyState == "0") this.request.open(this.method, this.url);// "0" means open() not called
      if(this.beforeSend) this.beforeSend(this.request) // if user supplied beforeSend() func, call it.
       // console.log("This before setBody!", "req state:"+ this.request.readyState);
      
      if(!this.body) this.body = null; // set it to 'null' when there is no body 
      else this.setBody();
      

      this.request.send(this.body); 
       
    };    
   
    return function(args){  // modul returns this function as API

      var r = Object.create(request); // behavior delegation link
     
       if(args){ 
          r.initRequest(args);       // Initialise request and sends it, if args are provided
          return;                    // if not , then return the object that indirectly, through closures 
      }                              // have access to prototype chain of request API. That is it has acess to 
                                     // an instance of request API (here it is "r").
       			
      return phantomHead = { initRequest: r.initRequest.bind(r) } // "borrow" method from instance, bind it to instance
    }

})()

module.exports = request;


},{"twiz-client-utils":11}],10:[function(require,module,exports){
var OAuth  = require('twiz-client-oauth');

   function RequestToken(){
      OAuth.call(this);
      this.name = this.leg[0];
   }

   RequestToken.prototype = Object.create(OAuth.prototype);

   module.exports = RequestToken;

},{"twiz-client-oauth":6}],11:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}]},{},[1]);
