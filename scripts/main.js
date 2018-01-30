
(function(){
  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

  var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
     
  var request = require(["request"]).request; // importing xmlhttp request API
  var textContent = require(["textContent"]).textContent; 
  var whenPageReady = require(["whenReady"]).whenReady;
  var addEvent = require(["addEvent"]).addEvent;
  var cssClassMgr = require(['cssClassMgr']).cssClassMgr(); // adds, removes etc ... css classes for an element
  var cssEventMgr = require(['cssEventMgr']).cssEventMgr;
  var styleRulesMgr = require(["styleRulesMgr"]).styleRulesMgr;
  var addPrefAnimEvent = require(["addPrefixedAnimationEvent"]).addPrefixedAnimationEvent;
  var byteLength = require(["byteLength"]).byteLength;
 // var twizClient() = require(["twizClient()"]).twizClient(); // twizClient() is renamed to twizClient() in separete repo 
  var quoter = {}; // Object that handles getting data from server and showing it on page

  quoter.messages = {
      noQuoteInArray: "There is no quote in array."
  }                 
                    /* https://thingproxy.freeboard.io/fetch/ is the forward proxy we use to avoid 
                       "mixed content" loading since api.forismatic.com doesnt support https       */
  quoter.url = "https://thingproxy.freeboard.io/fetch/http://api.forismatic.com/api/1.0/"; // server url
  quoter.queryParams = {                   // making data object specific to JSONP server we are connnecting to. 
      method: 'getQuote',
      format: 'text',
      key: 0,
      lang: 'en'
  };   
  quoter.callback = function (data) { // Setting  callback function which will be invoked with server data               
       _pS_.quotes.push(data);  // We are putting server data into quotes array
                                // which is a propertie of _pS_ global var.
  }
  quoter.getQuote = function(thisMany){ // Gets data from server and initiates callback function which puts that 
                                       // data in "quotes" array. 
      this.setQuoteKey(); // Generates random quote key
      thisMany = thisMany || 1 ; // Defaults to 1, if it's negative it doesnt get any quote, see loop.

      for(thisMany; thisMany > 0; thisMany--){ 
          request({ "url": this.url, "queryParams": this.queryParams, "callback": this.callback });// uses
                                                                                                   // request API
      }
  }.bind(quoter)
  quoter.setQuotePlace = function(){
     quoter.textPlace = document.getElementsByClassName("showQuote")[0]; // html element to put quote text 
                                                                           // into.
     quoter.authorPlace = document.getElementsByClassName("showAuthor")[0];
 }

 quoter.showQuote = function(){ // inserts quote data into paragraphs elements, shows quote data on page.
                                        
      if(_pS_.quotes.length !== 0){
         var q = _pS_.quotes.splice(0,1)[0] // Take (remove) first element from quotes. 
                                            // Server response is in text format is like bellow:
                                            // This is the quote string. (Here goes the author)  

         var quoteEnd = (q.indexOf("(") === -1) ? q.length : (q.indexOf("(") - 1); // Get index of the "(" - 1. 
                                                                                   // Emty space before "(" .
         var quoteText = q.substring(0,quoteEnd);   // Get quote string up to dot(including).
        
         var authorEnd = q.indexOf(")");
         var quoteAuthor = "";
         if(authorEnd !== -1) quoteAuthor = q.substring(quoteEnd+2, authorEnd);// Get author string, 
                                                                               // up to ")" . If there is one.
      }
      else{
           console.log(this.messages.noQuoteInArray);
           return;  
      }

      textContent(this.textPlace, quoteText);
      textContent(this.authorPlace, quoteAuthor);

        
  }.bind(quoter);
  quoter.setQuoteKey = function(){ // sets random quote key that server is using to generates data.
     var value = Math.round( Math.random() * 100000); 
     this.queryParams.key = value ;

  }.bind(quoter);
  quoter.showAndGetQuote = function(){
      this.showQuote(); // show quote data on page
      if(_pS_.quotes.length == 0)this.getQuote();// preloads one more quote in quotes array for eventual next
                                                     // invocation, if there is none in quotes array. There could
                                                     // be more then one, if you where to click multiple times. 
                                                     // Each click 
                                                     // shows a quote on page and preloads one more. So if data
                                                     // doesnt come defore your next click, there is no 
                                                     // data to display, and data from clicks would come in 
                                                     // close intervals (like in a batch) filling array with more
                                                     // then one. Thats why we preload only when there is no 
                                                     // quote in array.   

  }.bind(quoter)

  quoter.chooseTriggerElement = function (el){ // picks element to be "trigger" for showing data on page. This is
                                               // owlet (div) element to which we attach onclick handler later.
      quoter.triggerElement = document.querySelectorAll(el)[0]; 
  }

  quoter.setQuoteTrigger = function(eventType, handler){ 
      addEvent(this.triggerElement, eventType, handler); // adds showQuoteData as onclick 
                                                         // event handler function, to triggerElement
                                                         // we chose.
  }.bind(quoter);

 quoter.getQuote() // Requesting quote data from server, also doesn't need DOM to be loaded. Preloads one quote.
 whenPageReady(quoter.setQuotePlace); // Selecting html elements for placing quote data into. Needs DOM tree.
 whenPageReady(quoter.chooseTriggerElement.bind(null,".owlet"));// This function uses CSS selector syntax
                                                                 // to select html element.

 whenPageReady(quoter.setQuoteTrigger.bind(null,"click", quoter.showAndGetQuote)); // When page is loaded,
                                                                                  // set "clicking the owlet"
                                                                                  // to be event that triggers
                                                                                 // display of quote data on page
 

 
////////////// wingRadiate animation (on click event) /////////////////////////
  var owletCssClass = Object.create(cssClassMgr); // Instance of an object that manipulates with elements
                                                  // css class names.

  function changeOwletsCssOnClick(){    // for mobile we defined touch events, just like for clicking.
      
      owletCssClass.initClass("owlet"); // setting element that has css class name 'owlet'
      addEvent(owletCssClass.el, "mousedown", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
       
      addEvent(owletCssClass.el,"mouseup", function(){ 
           setTimeout(function(){ owletCssClass.toggleClass.call(owletCssClass, "quoteClickRadiate") }, 350) 
       });
        
      addEvent(owletCssClass.el, "touchstart", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
  }

  whenPageReady(changeOwletsCssOnClick); // when dom ready set click event handler on element with class "owlet".

////////// left and right wings animation fix (cross browser)////////
 var leftWingClass = Object.create(cssClassMgr);
 var rightWingClass = Object.create(cssClassMgr);
 var mainStyleSheet = styleRulesMgr(); // Instance of object that handles  css style rules of particular 
                                       // css style sheet. It uses css selector sintax to select rules.

 function removeWingAnimationsOnEnd(){ // Removes css animations we used for owlets wingsFlap, tuckWing
                                       // and wingRadiate, after last animation(wingRadiate) in sequence ends.
                                       // All in order to correct animation bugs across browsers.
    
     mainStyleSheet.initStyleSheet();  // If no argument it defaults to first stylesheet for document

     leftWingClass.initClass("left");  // Elements that have "left" and "right" class names
     rightWingClass.initClass("right");

     addPrefAnimEvent(leftWingClass.el, "AnimationEnd", function(handle){ 
       setTimeout(function(){
         if(handle.animationName === "wingRadiate"){
           mainStyleSheet.addStyle(".left","line-height","1.3em");  
           leftWingClass.removeClass.call(leftWingClass,"lwAnimation"); // "lwAnimation" is css class name 
         }
       },100)                                                              // responsible for all 3 animations
     })
     addPrefAnimEvent(rightWingClass.el, "animationend", function(handle){
         setTimeout(function(){ 
          if(handle.animationName === "wingRadiate"){
            mainStyleSheet.addStyle(".right","line-height","1.3em");  
            rightWingClass.removeClass.call(rightWingClass, "rwAnimation");
  	        }
         }, 100);
     })
  } 

  whenPageReady(removeWingAnimationsOnEnd);
                                    
  var sheetRules = styleRulesMgr();
  sheetRules.initStyleSheet(); // initialize style sheet of this document;

  
  
/////////////// chrome mobile fix  /////////////////////
  var chromeCssBugFix = {};    // fix the css bug on chrome mobile
  chromeCssBugFix.checkChromeMob = function(){  // sniff chrome mobile
     var browser = window.navigator.userAgent 
     this.chrome = /Chrome/g.test(browser); 
     this.mobile = /Mobi/g.test(browser);
  }
  chromeCssBugFix.fixIt = function(){ 
     this.checkChromeMob(); // checking for chrome for mobile
     if(!this.chrome || !this.mobile) return; // dont apply fix if it's other browser
     
     var chroMobEl = document.getElementsByClassName("chroMob")[0]; 
     this.dispatchFix();
     
     
  }.bind(chromeCssBugFix);
  
  chromeCssBugFix.dispatchFix =  function (){
    var htmlEl = document.getElementsByTagName("html"); // get html element
    var running = false;
    
    function adjustHeight(){
        if(running) return; // if we've already called abjustHeight and it didnt finish executing, then return
      
        running = true;
        setTimeout(function(){ requestAnimationFrame(function(){ // reqAnimFrame func is called but not before 
                                                                 // 160 ms has passed
             mainStyleSheet.addStyle("html","min-height", window.innerHeight.toString() + "px") // adjust height
                                                                                 // of element. "html" has white
                                                                                 // border, it requires repaint.
             running = false; 
           }) 
        }, 160);
    }
    
    addEvent(window, "resize", adjustHeight)
  }
  
    
  whenPageReady(chromeCssBugFix.fixIt);

 ////////////////// twitter button animation //////////////////////////////
  var cssEvents = cssEventMgr(); 
  var twitterButton = Object.create(cssEvents);
  
  
  whenPageReady(twitterButton.initEvent.bind(twitterButton, "twitterButton","logoOnClick",  
               {"events": ["mousedown","mouseup","touchstart","touchmove"],
                "actions": ["add", "remove","add", "remove"]          
  }));
 
/////////////// twitter OAuth (for SPA cases) //////
  var quoteData = {};

  quoteData.getQuoteElements = function(){
     this.quoteEl = document.querySelectorAll('.showQuote')[0]; // get element
     this.authorEl = document.querySelectorAll('.showAuthor')[0];
     
  }

  whenPageReady(quoteData.getQuoteElements.bind(quoteData))     // when page is ready sellect the quote elements
 
  quoteData.setQuoteData = function(sessionData){  
        console.log("sessionData ====== ", sessionData),
        console.log("this.quoteEl: ", this.quoteEl);            
     textContent(this.quoteEl, sessionData.quote);
     textContent(this.authorEl, sessionData.author);
  }
  
  whenPageReady( function(){  // on click authenticate to twitter
      addEvent(document.getElementsByClassName("twitterButton")[0], "click", function authenticate(){
                
           console.log("Taking this data: ====",textContent(quoteData.quoteEl), textContent(quoteData.authorEl))
              var options = {      "server_url":  'https://quoteowlet.herokuapp.com',//'http://localhost:5000',
                                   "redirection_url":"https://gits2501.github.io/QuoteOwlet/index.html",//"https://gits2501.github.io/QuoteOwlet/pages/tweeting.html",
      
                                    "session_data": { // redirection data
                                        'quote': textContent(quoteData.quoteEl), 
                                        'author': textContent(quoteData.authorEl), 
                                        'hobbit':{
                                            'name': 'Peregrin',
                                            'lastName': 'Tuk'
                                         },
                                        'id': 209
                                     },
                                   /* 'new_window':{
                                        'name': 'nw',
                                        'features':'resizable=yes,height=613,width=400,left=400,top=300'
                                     }, */ 
                                     'options':{
                                        'method': 'GET',
                                        'path': 'users/search.json',
                                        'params':{
                                          
                                          q:"DaiMokuroku"
                                          
                                           
                                          /*status: '\"'+ textContent(document.querySelector('.showQuote')) +'\"'
                                                    +'\n ~ ' + textContent(document.querySelector('.showAuthor'))
                                            */
                                         }
                                      },
                                      'callback_func': function(o){
                                            if(o.error) console.log('error (callback_func): ', error)
                                             
                                            if(o.window){
                                               console.log('in callback_func has Window: ', o.window);
                                            }
                                            window.temp = o.token.oauth_token

                                      }
                              }
             
	      var twty = twizClient();
              var p =  twty.getRequestToken(options);
              if(p) p.then(function onFulfilled(w){
                           console.log("Promised: ", w)
                            if (!w.error && w.data){
                               userID = w.data[0]['id_str']; 
                               console.log('userID:', userID)
                              return new Promise(function(res, rej){
                                    var twiz = twizClient();
                                    delete options.options.params;
                                    options.options = {
                                      'method': "POST", 
                                      'path':'direct_messages/events/new.json',
                                       'body': {
                                                  "event": {
                                                      "type": "message_create",
                                                      "message_create": {
                                                         "target": {
                                                           "recipient_id": userID
                                                         },
                                                         "message_data": {
                                                           "text": "In order to cover first you must show."
                                                         }
                                                      }
                                                  }
                                               },
                                       'encoding': 'json'
                                          
                                    }
                                    var p = twiz.getRequestToken(options);
                                    if(p) p.then(function(w){
                                          if(!w.error){ res(w); return}
                                          console.log('error posting direct mesage:', w.error);
                                    })
                              })
                           }
                          
                      }
                    ).then(function(o){
                                            })
              else{ console.log('NO Promise available')
                
              }
       })
     
  })
  whenPageReady(function(){            // when testing SPA case
     var twtSecondPart = twizClient();
     var sessionData = twtSecondPart.getSessionData();
    quoteData.setQuoteData.apply(quoteData, [sessionData]);
    console.log("ACCESS twitter ===================");
    var options = { 
       server_url :'https://quoteowlet.herokuapp.com',
       options:{
          method: "POST",
          path:'statuses/update.json',
          params:{
            status: '\"'+ sessionData.quote + '\"' + '\n ~ ' + sessionData.author
                      

          }
       }
    }

   var p = twtSecondPart.accessTwitter(options); // pass here options object as argument 
                                          //(needed just server url and options)
   if(p) p.then(function(o){
      if(o.error) console.log("error in promise: ", error)
       
      if(o.data)console.log("data in promise:", o.data);
  
   })
     
  })


})()

console.log("main loaded");	
