(function (){
   'use strict'
 
   function percentEncode(str){
   
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c){ // percent encodes unsafe chars, then
                                                                     // it follows RFC3986 and percent encodes
                                                                     // reserved characters in sqere brackets.
         return '%' + c.charCodeAt(0).toString(16);   // takes binary representation of every reserved char
                                                      // , coverts it to hex string char and appends to "%".
      });
 
   }
   function formEncode(dataObj, spaces){
       var pairs = [];
       var value;
       var key;
       var type;
        for(var name in dataObj){
            type = typeof dataObj[name];
             if(dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null"){ // only props 
                                                                                           // in dataObj 
                  key = encodeURIComponent(name);   // encode property name

                  if(type === 'object'){                         
                     value = formEncode(dataObj[name], spaces); // form encode object
                     value = encodeURIComponent(value)          // since return value is string, uri encode it
                  }                      
                  else value = encodeURIComponent(dataObj[name]) // property is not object, just uri encode it
                  
                  if(!spaces){
                     key = key.replace(/%20/g, "+") 
                     value = value.replace(/%20/g, "+"); // substitute space encoding for +
                  }
                 
                  pairs.push(key + "=" + value)                 
             }
        }

      return pairs.join("&");
  } 

  var request = ( function request (){

    var request = {};

    request.messages = {
      cbAlreadyCalled: "Callback function has already been called.",
      cbWasNotCalled: "Calback function provided was not called.",
      urlNotSet: "You must provide url for the reqest you make.",
      callbackNotProvided: "Callback function was not provided.",
      encodingNotSupported: "Encoding you provided is not supported"
    };

    request.initRequest = function(args){ // Propertie names, in args object, that this function supports are:
                                          //  url, queryParams, callback, httpMethod, body, beforeSend
      this.request = this.createRequest(); // Creates XMLHttpRequest object
      var temp;                           // Temporary place holder
      
      for(var prop in args){           // iterates trough every argument provided
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
            case "body":  console.log("has DATA");
              this.body = temp;          // add body for request
            break;
            case "parse":
              this.parse = temp;
            break; 
            case "encoding":
              this.encoding = temp;
            case "beforeSend":
              this.beforeSend = temp // For instance, if we need to set additonal request specific headers 
                                     // this.beforeSend is invoked before sending the request, but afther open()
                                     // is called. Here we have created new property.
            break;
         }    
      }
 
      if(!this.url) throw new Error(this.messages.urlNotSet); // Throw error if url was not provided in args
      if(!this.method) this.method = "GET"; // Defaults to "GET" method if one was not provided in args object
      if (!this.request.onreadystatechange) throw new Error(this.messages.callbackNotProvided); // cb missing
      
           
      console.log(args);
      this.sendRequest();     // Makes the actual http request

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
      else this.url = url + this.url;  // if setQueryParams() run before set url, we already have query string
                                       //  in "this.url". So "url" needs to go first.
    };

    request.setQuery = function(queryParams){
      this.queryString = formEncode(queryParams);// Function uses form-url-encoded scheme to return query string
      if(this.url.indexOf("?") === -1) this.url+="?"; // if doesnt have query delimiter add it. 
      this.url+= this.queryString; // Adds query string to url 

    };
   
    request.addListener = function(callback) {
      var alreadyCalled = false;

      this.request.onreadystatechange = function(){
          
         if(this.request.readyState === 4 && this.request.status === 200){
              if(alreadyCalled){
                  console.log(this.messages.cbAlreadyCalled);
                  return;
              }
              else alreadyCalled = true;
              
              var type = this.request.getResponseHeader("Content-type"); // Get the response's content type
             
              switch(type){
                 case "application/json":   
                   try{
                      if(this.parse) callback(JSON.parse(data)); // parse json data and send it as argument
                      else callback(data);
                   }
                   catch(e){
                      console.log(this.messages.cbWasNotCalled + " \n"+ e); // if parsing failed note it
                   }
                 break;
                 case "application/xml":
                   callback(this.request.responseXML); // responceXML already parsed as a DOM object
                 break;
                 default:
                   callback(this.request.responseText);// text/html , text/css and others are treated as text
              }
         }   
      }.bind(this); // Async functions lose -this- context because they start executing when functions that 
                    // invoked them already finished their execution. Here we pass whatever "this" references 
                    // in the moment addListener() is invoked. Meaning, "this" will repesent each 
                    // instance of request, see return function below. 
    };

    request.setHeader = function(header, value){    // set the request header 
       this.request.setRequestHeader(header, value);  
    };

    request.setBody = function(){ // sets Content-Type encoding and encode the body of a request
               console.log("In setBody")
        if(this.body){     // check for data payload 
          
          if(!this.encoding){                       // If there is no string that indicates encoding
            this.setHeader("Content-Type", "text/plain"); // default to text, set the content type (was formEnc)
          }
          else {
              switch(this.encoding.toLowerCase()){      // when there is encoding string
                    case "form":
                      this.body = formEncode(this.body) // encode the body
                      this.setHeader("Content-Type", "application/x-www-url-formencoded"); // set header
                    break;
                    case "json":
                      this.body = JSON.stringify(this.body)  
                      this.setHeader("Content-Type", "application/json");
                    case "text":
                       this.setHeader("Content-Type", 'text/plain');
                    break;
                    default:
                      throw new Error(this.messages.encodingNotSupported);
               }
          }
        }
        else { 
           this.body.data = null; // set the body to null
        } 

 
    };
    request.sendRequest = function(){

      if(this.request.readyState == "0") this.request.open(this.method, this.url);// "0" means open() not called
      if(this.beforeSend) this.beforeSend(this.request) // if user supplied beforeSend() func, call it.
        console.log("This before setBody!", "req state:"+ this.request.readyState);
      
      if(this.body) this.setBody();
      else if(this.method === "POST") this.body = null; // set it to 'null' if there is no body and method 
                                                        //is POST. This is just xmlhttp request spec.
      
      if(this.method === "GET") this.request.send(null);
      if(this.method === "POST") this.request.send(this.body); 
       
    };    
   
    return function(args){  // modul returns this function as API

       var r = Object.create(request); // behavior delegation link
     
       if(args) r.initRequest(args); // Initialise request and sends it, if args are provided
       else {                        // if not , then return the object that indirectly, through closures,
                                     // have access to prototype chain of request API. That is it has acess to 
                                     // an instance of request API (here it is "r").
          return phantomHead = {
             initRequest: r.initRequest.bind(r) // "borrow" method from instance, bind it to instance
          } 
       }
    }

 })(); 
    
   function twtOAuth (args){ 
      var vault = {               // this is vault, for storing sensitive information
        "consumer_key": "",
        "consumer_secret":"",
        "user_key": ""
      }
      this.leg = ["request_token","authorize","access_token"] // Names of each leg (step) in 3-leg authentication
                                                             // to twitter. Names are also url path ends:
                                                             // http://api.twitter.com/oauth/request_token
      
      this.httpMethods = {}   // This is the current sequence of http methods we use in 3-leg authentication 
      this.httpMethods[this.leg[0]] = "POST"
      this.httpMethods[this.leg[1]] = "GET"                                          
      this.httpMethods[this.leg[2]] = "POST" 
      
      this.twtUrl = {            // Parts of twitter api url
           "protocol": "https://",
           "domain": "api.twitter.com",
           "path": "/oauth/",    // 'path' is actualy just part of complete path, used in 3-leg dance 
           "api_path": "/1.1/"   // api path for calls afther authorization/access_token
      }  
     
      this.apiUrl =  this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.path; // here we store absolute url                                                                                   // without leg.
 
      this.absoluteUrls = {}    // here we put together the complete url for each leg (step) in authentication
      this.absoluteUrls[this.leg[0]] = this.apiUrl + this.leg[0]; 
      this.absoluteUrls[this.leg[1]] = this.apiUrl + this.leg[1];
      this.absoluteUrls[this.leg[2]] = this.apiUrl + this.leg[2];

      this.lnkLabel = {  // link label, used to make url sufficiently unique
          name : '__lance',
          data : {
            'id' : 'he who dares '
          }
      } 
       
      this.prefix = "oauth_";  // prefix for each oauth key in a http request
      this.leadPrefix = "OAuth "     // leading string afther all key-value pairs go. Notice space at the end. 
      this.signatureBaseString = ""; // The string HMAC-SHA1 uses as second argument.
      
      this.oauth = {}                                // Holds parameters that are used to generate SBS and AH
      this.oauth[ this.prefix + 'consumer_key'] = "";// This is very sensitive data. Server sets the value.
      this.oauth[ this.prefix + 'signature'] = "";   // This value also sets the server.
      this.oauth[ this.prefix + 'nonce'] =  "";    // Session id, twitter api uses this to determines duplicates
      this.oauth[ this.prefix + 'signature_method'] = ""; // Signature method we are using
      this.oauth[ this.prefix + 'timestamp'] = "";   // Unix epoch timestamp
      this.oauth[ this.prefix + 'version'] = ""      // all request use ver 1.0
      
      this[this.leg[0]] = {}; 
      this[this.leg[0]][ this.prefix + 'callback'] = ""; // User is return to this link, if approval is confirmed 
      this[this.leg[1]] = {}                             // Creating object for params used in 'authorize' leg
      this[this.leg[1]][ this.prefix + 'token'] = '';  
      this[this.leg[1]][ this.prefix + 'verifier'] = '';

      this[this.leg[2]] = {}                          // Creating 'access_token' object for that step params
      this[this.leg[2]][ this.prefix + 'token'] = ''; // we need just oauth_token param
      
      this.params = function(action, o1, o2){
          Object.getOwnPropertyNames(o2)
                  .map(function(key, i){
                       if(action === 'add') o1[key] = o2[key]; // add property name and value from o2 to o1
                       else delete o1[key];                    // removes property name we found in o2 from o1 
                   })
      }

      this.alreadyCalled = false; // Control flag. Protection against multiple calls to twitter from same 
                                  // instance
      // first part (maybe call it UserAuthorization)
      this.getRequestToken = function(args){  // Add leg argument check to see which leg, act acording
         
         if(this.alreadyCalled) return;       // Just return, in case of subsequent call.
         else this.alreadyCalled = true;      
        
         var resolve;
         var promised;
         
         console.log("v: "+ vault)
         this.params('add', this.oauth, this[this.leg[0]]) // add oauth param (callback) for reqest_token step
         this.setUserParams(args, vault);       // Sets user supplied parameters like: 'redirection_url' ...
         this.setNonUserParams();               // Sets non user-suppliead params: timestamp, nonce, sig. method
         this.appendToCallback(this.lnkLabel.data, this.lnkLabel.name); // adds uniqueness to url
         this.genSignatureBaseString(vault,this.leg[0]);    // Generates signature base string
         if(this.newWindow){                    // Checking for user supplied newWindow preference
            this.openWindow();                  // Opens new window.  
       //  if(Promise) promised = new Promise(function(rslv, rjt){ resolve = rslv; }) // if can, make a Promise
                                                                                      // remember it's resolve
         }
         //this.genSignature(vault);            // Generates signature
          console.log('authorize FUNC: ', this.authorize);
         this.sendRequest(this.redirection.bind(this,resolve), this.leg[0]);// Sends request to twitter,resolves
                                                                            // promise if present 
         if(promised) return promised;                    
      }
        // this is the second part
      this.getSessionData = function(){
         
         if(!this.wasParsed) this.parseAuthorizationLink(window.location.href); // parse returned data
         
         if(!this.authorized) return;                       // return if no tokens

         if(!this.authorized.data){                         // return if no session data
            console.log(this.messages.noSessionData);
            return; 
         }                          
          
          this.sessionData = this.parseSessionData(this.authorized.data) // further parsing of session data
          console.log(this.sessionData);
          return this.sessionData;
      }

      this.accessTwitter = function(options){ // Exchanges token and verifier for access_token
          this.userOptions = options; // Create new property and put user suppliead options in. This is used 
                                      // when we acquire access token (next step)         
          this.server_url = this.userOptions.server_url; // we need only server_url from user for this step
          
          if(!this.wasParsed) this.parseAuthorizationLink(window.location.href);
 
          if(!this.authorized) {
            console.log(this.meassages.linkNotAuthorized);
            return;                                       // print info and return if no tokens or label incore
          } 

          
          this.oauth[this.prefix + 'verifier'] = this.authorized.oauth_verifier // Put authorized verifier
          this.oauth[this.prefix + 'token'] = this.authorized.oauth_token;      // Authorized token
          this.params('remove', this.oauth, this[this.leg[0]]);       // Remove params not needed for this step
          this.setNonUserParams(); 
          this.genSignatureBaseString(vault,this.leg[2]);   // generate SBS // check if you really need the vault here
       
 
          this.sendRequest(this.accessToken.bind(this), this.leg[2]);  
      }
   }
   twtOAuth.prototype.parseAuthorizationLink = function(url){ // parses data in url 

      var str = this.parse(url, /\?/g, /#/g); // parses query string

      var qp = this.parseQueryParams(str); // parse parameters from query string
      var obj = this.objectify(qp);        // makes an object from query string parametars
      console.log(obj.__lance);
      if(obj.oauth_token && obj.oauth_verifier && obj.__lance){ // check to see we have needed tokens 
         this.authorized  = obj;           // make new variable;                     
      }
      this.wasParsed = true;               // indicate that the url was already parsed  
   }
  
   twtOAuth.prototype.parseSessionData = function(str){
       if(/%[0-9][0-9]/g.test(str))                       // See if there are percent encoded chars
       str = decodeURIComponent(decodeURIComponent(str)); // Decoding twice, since it was encoded twice
                                                          // (by OAuth 1.0a specification). See SBS function.
       var parsed = this.parseQueryParams(str);           // Parse key-value pairs  
       return this.objectify(parsed);                     // Making an object from parsed key/values.
   }
  
   twtOAuth.prototype.parseQueryParams = function (str){
      var arr  = [];
      if(!str){
         console.log(this.messages.noStringProvided);
         return;
      }  

      if(str[0] === "?") str = str.substring(1); // remove "?" if we have one at beggining

      arr = str.split('&')                       // make new array element on each "&" 
            .map( function(el, i){ 
                 var arr2 =  el.split("=");      // for each element make new array element on each "=" 
                 return arr2;   

             });
     
      console.log(arr);
      return arr;   // arr is now array of arrays
   }

   twtOAuth.prototype.objectify = function(array){ // makes new object with props and values from array's 
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
   
   twtOAuth.prototype.accessToken = function(sentData){ // should be done by server
       console.log('acessTokenData: '+ sentData);
       var qp = this.parseQueryParams(sentData);
       var parsed = this.objectify(qp)
       console.log('parsedParams: ', parsed);
       
       this.params('remove', this.oauth, this[this.leg[1]]);  // Remove params needed for previous step
      
       this.params('add', this.oauth, this.userOptions.params)// params needed for api call (raw values) 
                                                    // ADD this.oauth to this.userParams 
       this.oauth.oauth_token = parsed.oauth_token  // setting access_token in oauth_token 
                                                    // only for testing purposes , this will do server logic
       this.genSignatureBaseString({}, this.userOptions);  // add vault or remove this obeject as first arg 
       console.log("SBS (api call): ", this.signatureBaseString)
       
       var options =  {
          url: this.userOptions.server_url,        
          method: this.httpMethods[this.leg[2]], // method for access_token leg
          queryParams: {
            host: this.twtUrl.domain,            
            path: this.twtUrl.api_path + this.userOptions.path + '?'+ formEncode(this.userOptions.params, true),
            method: this.userOptions.method,      // method user supplied
            legSBS: this.signatureBaseString
          },
         // body: this.signatureBaseString,
          beforeSend: this.setAuthorizationHeader.bind(this) // invokes specified function before sending
         
       }
       console.log("All Options", options);
      // this.sendRequest( function(sentData){console.log("API CALL data: ", sentData)}, options ); // api call 

   }

   twtOAuth.prototype.setUserParams = function(args, vault){ // sets user suplied parametars 
         var temp; 
         for(var prop in args){    // iterate trough any user params
            temp = args[prop];

            switch(prop){
               case "server_url":       // where the server code runs 
                 this.server_url = temp;
               break;
               case "redirection_url": // this is the url to which user gets redirected by twiiter api, 
                 this.oauth[ this.prefix + 'callback'] = temp;
               break; 
               case "new_window":      // object that holds properties for making new window(tab/popup)
                 this.newWindow = {};
                 for(var data in temp){
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
               case "csecret":
                 vault.consumer_secret = temp;  // placing sensitive data to variables formed in closures
               break;
               case "ckey":
                 vault.consumer_key = temp;
               break;
               case "usecret":
                 vault.user_key = temp; 
               break;
               case "version":
                 this.oauth.version(temp);
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
            }
         }

         this.checkRequestTokenCallback();   // checks for callback, throws error if not set
         this.checkConsumerSecret(vault);    // checks secret,
         
   }
   
   twtOAuth.prototype.genSignatureBaseString = function(vault, leg){ // generates SBS  
         this.signatureBaseString = '';
         var a = [];
         for(var name in this.oauth){ // takes every oauth params name
            a.push(name);             // and pushes them to array
         } 
     
         a.sort();  // sorts alphabeticaly

         var keyValue;
         var key;
         var value;    
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
                value = "";         // Sensitive data we leave for server to add
              break;   
              case "oauth_user_key":
                value = ""; 
              break;
          /*    case "oauth_token":    // Needs to be present for api calls but not for access token step 
                value = "";            // since we need oauth_token and oauth_verifier for that.
              break;
           */
              case "oauth_signature":
                continue;           // We dont add signature to singatureBaseString at all (server does that)
              break;
              default:
                value = this.oauth[key];          // Takes value of that key
            }
            keyValue = percentEncode(key) + "=" + percentEncode(value); // Encodes key value and inserts "="
          console.log(keyValue)                                         // in between.
            if(i !== a.length - 1) keyValue += "&"; // Dont append "&" on last pair    
            this.signatureBaseString += keyValue;   // Add pair to SBS
         } 

         var method;  // Collecting the reqest method and url
         var url;

         if(typeof leg === 'string'){            // we are in 3-leg dance, take well known params
           method = this.httpMethods[leg]        // Get the method for this leg
           method = method.toUpperCase() + "&";  // upercase the method, add "&"

           url = this.absoluteUrls[leg];         // Get the absoute url for this leg of authentication
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
         console.log("SBS string: "+ this.signatureBaseString); 
   }
   twtOAuth.prototype.openWindow = function(){ // opens pop-up and puts in under current window
        console.log("==== POP-UP =====");
      this.newWindow.window = window.open("", this.newWindow.name, this.newWindow.features);
      console.log("this.newWindow: ", this.newWindow.window ); 
   }
   twtOAuth.prototype.genSignature = function(vault){ 
         // put here if request leg, athorization leg ...
      var hmacSha1 = new HmacSha1();
      var key = this.genSigningKey(vault); // signing key uses consumer secret, NOT consumer key
      console.log("signing KEY: " + key); 
      this.oauth.signature = hmacSha1.digest(key,this.signatureBaseString); // Produces hex string
      this.oauth.signature = hmacSha1.hexToString(this.oauth.signature);    // Converts to string, for btoa()                                                                
      this.oauth.signature = btoa(this.oauth.signature);                    // Converting to base64
                                                                            // We percent encode it in 
                                                                            // sendRequest function
      console.log("oauth_sig: " + this.oauth.signature);                       
   }

   twtOAuth.prototype.messages = {
      callbackNotSet: "You must provide a callback url to which users are redirected.",
      consumerKeyNotSet: "You must provide consumer KEY that indetifies your app.",
      consumerSecretNotSet: "You must provede consumer SECRET that indentifies your app",
      userKey: "You must provide user secret that intentifies user in which name your app makes request.",
      noStringProvided: "You must provide a string for parsing." ,
      noSessionData: "No session data was found.",
      linkNotAuthorized: "Appears that obtained url doesn't have necessary data."
   };

   twtOAuth.prototype.appendToCallback = function(data, name){ // appends data object as querystring to                                                                        // callback url. 
    console.log('Data: ==> ', data)
      if(!name) name = "data";
      var callback = this.oauth[ this.prefix + 'callback'];
      var fEncoded = formEncode(data, true);
      console.log(fEncoded);
      var queryString = name + '=' + percentEncode(fEncoded); // Make string from object then                                                                                 // percent encode it.  
    console.log("queryString: ", queryString)
      if(!/\?/.test(callback)) callback += "?";               // Add "?" if one not exist
      else queryString =  '&' + queryString                   // other queryString exists, so add '&' to this qs
      this.oauth[ this.prefix + 'callback'] = callback + queryString;           // Add queryString to callback
                                                     
       console.log("OAUTH CALLBACK: "+this.oauth[ this.prefix + 'callback'])
      return this.oauth[ this.prefix + 'callback'];
   };

   twtOAuth.prototype.checkConsumerSecret = function(vault){ // checks if consumer secret is set 
      if(!vault.consumer_secret) throw new Error(this.messages.consumerSecretNotSet);
      if(!vault.consumer_key) throw new Error(this.messages.consumerKeyNotSet)
   }
   twtOAuth.checkUserSecret = function(vault){  // check if user secret is set
      if(!vault.user_key) throw new Error(this.messages.userKeyNotSet);
   }
   twtOAuth.prototype.checkRequestTokenCallback = function (){ // checks for the url user is returned to
      if(!this.oauth[ this.prefix + 'callback']) throw new Error(this.messages.callbackNotSet);
                                                                // throw an error if one is not set
   }
    
   twtOAuth.prototype.sendRequest = function(cb, leg){     // was (vault, resolve, leg) 
      console.log('request SENT +')
      var options;

      if(typeof leg === 'string'){            // we are in 3-leg dance
        options = {                           // seting params for http request
         "method": this.httpMethods[leg], // take http method for this leg
         "url": this.server_url,   // was 'http://localhost:5000',
         "queryParams": { 
            "host": this.twtUrl.domain,
            "path": this.twtUrl.path + leg,
            "method": this.httpMethods[leg],
            "legSBS": this.signatureBaseString
          },
         // "body": this.signatureBaseString,     // Payload of the request we send
         "encoding": "text",                   // encoding of the body
         "beforeSend": this.setAuthorizationHeader.bind(this),// Before sending we add Authorization 
                                                              // header to http request
         "callback": cb                        // Afther successfull responce, 
                                               // this callback function is invoked
        }
      }
      else {                             // 'leg' is object with provided options
          leg.callback = cb; // set callback 
          options = leg;
      }   
    

      request(options);  
   }
   
   twtOAuth.prototype.redirection = function(resolve, sentData){ // Callback function for 2nd step
                                                  
       console.log("From twitter request_token: " + sentData);
       this.oauth_token = this.parse(sentData,/oauth_token/g, /&/g);// parses oauth_token 
                                                                    // from string twitter sent
       this.redirect(resolve);  // redirect user to twitter for authorization 
   };

   twtOAuth.prototype.parse = function(str, delimiter1, delimiter2){ // parses substring of a string (str) 
                                                                     
       if(!str){ 
          console.log(this.messages.noStringProvided);
          return;
       }
       var start = str.search(delimiter1);   // calculate from which index to take 
       var end ; 
       if(!delimiter2 || str.search(delimiter2) === -1) end = str.length;// if del2 was not passed as argument
                                                                         // or we didnt find it, then end index
                                                                         // is length of the string.
       else end = str.search(delimiter2);    // calcualte to which index to take                                                             
       console.log(str); 
       return str.substring(start, end);     // return substring
            
   };

   twtOAuth.prototype.redirect = function(resolve){ // redirects user to twitter for authorization   
     console.log('RESOLVE : ', resolve);
      var openedWindow;      
      var url =  this.absoluteUrls[this.leg[1]] + "?" + this.oauth_token; // assemble url for second leg

      if(!this.newWindow){
         window.location = url; // redirect current window if no newWindow; 
         return;
      }                         
      
      openedWindow = this.newWindow.window;           
      openedWindow.location = url;

      if(resolve) resolve(openedWindow);       // if promise is there, resolve it with a window reference
      else if (this.callback_func) this.callback_func(openedWindow); // if not invoke user callback function
      
      
   };

   twtOAuth.prototype.setAuthorizationHeader = function(request){
      request.setRequestHeader("Authorization", this.genHeaderString());
   }
   twtOAuth.prototype.genHeaderString = function(vault){
      var a = [];
       
      for(var name in this.oauth){
          a.push(name);
      }
      console.log("a; "+ a);
      a.sort();                           // Aphabeticaly sort array of property names

      var headerString = this.leadPrefix; // Adding "OAuth " in front everthing
      var key;                            // Temp vars
      var value;
      var keyValue;
    
      for(var i = 0; i < a.length; i++){  // iterate oauth  
         
          key = a[i];                                    // Take the key name (sorted in a)

         // if(key === "consumer_key") value = vault.consumer_key; // get value from vault
         // else
          value = this.oauth[key];   // Get it from oauth object
      
          key = percentEncode(key);  // Encode the key
          value = "\"" + percentEncode(value) + "\"";    // Adding double quotes to value
          
          keyValue = key + "=" + value;                  // Adding "=" between
          if(i !== (a.length - 1)) keyValue = keyValue + ", " // Add trailing comma and space, until end

          headerString += keyValue;       
      } 
      console.log("header string: " + headerString); 
      return headerString;
   }

   twtOAuth.prototype.setNonUserParams = function(){ // sets all "calculated" oauth params 
      this.setSignatureMethod();
      this.setNonce();
      this.setTimestamp();
      this.setVersion();
   }
   
   twtOAuth.prototype.genSigningKey = function(vault){ // generates signing keys used by hmacSha1 function
      var key = "";
      key += percentEncode(vault.consumer_secret) + "&"; // percent encode SECRET , add "&"
      if(vault.user_key) key += percentEncode(vault.user_key)     // check this in docs
      // if step where user key required check vor usr key  
      return key; 
   }
   twtOAuth.prototype.setSignatureMethod = function(method){
      this.oauth[this.prefix + 'signature_method'] = method || "HMAC-SHA1";
   }

   twtOAuth.prototype.setVersion = function(version){ 
      this.oauth[ this.prefix + 'version'] =  version || "1.0";
   }
   twtOAuth.prototype.setNonce = function(){ // Generates string from random sequence of 32 numbers, 
                                          // then returns base64 encoding of that string, striped of "=" sign.
      var seeds = "AaBb1CcDd2EeFf3GgHh4IiJjK5kLl6MmN7nOo8PpQqR9rSsTtU0uVvWwXxYyZz"; 
      var nonce = "";
  
      for(var i = 0; i < 31; i++){
        nonce += seeds[Math.round(Math.random() * (seeds.length - 1))];// pick a random ascii from seeds string
      }
    
      nonce = btoa(nonce).replace(/=/g,""); // encode to base64 and strip the "=" sign
      console.log("nonce: " + nonce)
      this.oauth[ this.prefix + 'nonce'] = nonce;            // set twitter session identifier (nonce)
   }

   twtOAuth.prototype.setTimestamp = function(){
      this.oauth[ this.prefix + 'timestamp'] = (Date.now() / 1000 | 0) + 1;// cuting off decimal part by 
                                                   // converting it to 32 bit integer in bitwise OR operation. 
   }

   function twizClient(){
      var r = new twtOAuth(); 
      
      return {
          getRequestToken : r.getRequestToken.bind(r),
          getSessionData: r.getSessionData.bind(r),
          accessTwitter: r.accessTwitter.bind(r)
      } 
   }
   
  if(typeof window === 'object' && window!== 'null') window.twizClient = twizClient ; 
  else if (typeof module === 'object' && module !== 'null') module.exports = twizClient;
//  console.log('module.exports: ', module.exports);

})();  

  if(typeof window === 'object') console.log('window.twizClient: ', window.twizClient)
  //console.log('twizClient: ', twizClient);

  //  for(var p in twizClient) console.log(prop, inst[prop]);


  // module.export = twizClient;
   
