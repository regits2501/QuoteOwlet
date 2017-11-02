
(function(){
  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

  var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
     
  var request = require(["request"]).request; // importing xmlhttp request API
  var textContent = require(["textContent"]).textContent; 
  var whenPageReady = require(["whenReady"]).whenReady;
  var addEvent = require(["addEvent"]).addEvent;
  var classList = require(["classList"]).classList;  
  var styleRulesMgr = require(["styleRulesMgr"]).styleRulesMgr;
  var addPrefAnimEvent = require(["addPrefixedAnimationEvent"]).addPrefixedAnimationEvent;
  var byteLength = require(["byteLength"]).byteLength;
  var twtOAuth = require(["twtOAuth"]).twtOAuth; 
  var quoter = {}; // Object that handles getting data from server and showing it on page
  var request = require(["request"]).request;

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
 ////

 quoter.getQuote() // Requesting quote data from server, also doesn't need DOM to be loaded. Preloads one quote.
 whenPageReady(quoter.setQuotePlace); // Selecting html elements for placing quote data into. Needs DOM tree.
 whenPageReady(quoter.chooseTriggerElement.bind(null,".owlet"));// This function uses CSS selector syntax
                                                                 // to select html element.

 whenPageReady(quoter.setQuoteTrigger.bind(null,"click", quoter.showAndGetQuote)); // When page is loaded,
                                                                                  // set "clicking the owlet"
                                                                                  // to be event that triggers
                                                                                 // display of quote data on page
 
//// 
 var cssClassMgr =  {}; // manipulates with css class names of an element

 cssClassMgr.initClass = function(element){

    if(typeof element === "string") this.el = document.getElementsByClassName(element)[0]
    else this.el = element;
    this.cssList = classList(this.el); // Using classList, module that emulates HTML5 classList property
                           
 }
 cssClassMgr.addClass = function(clsName){
    this.cssList.add(clsName);        // Adding css class name to the html element
    
 }
 cssClassMgr.removeClass = function(clsName){
   
    this.cssList.remove(clsName); 
 } 
 cssClassMgr.toggleClass = function(clsName){
    this.cssList.toggle(clsName);
 }
 cssClassMgr.toString = function(){
    return this.cssList.toString();

 }

 ////////////////////////////////////////////
 
////////////////////////////////////////////

  
  var owletCssClass = Object.create(cssClassMgr); // Instance of an object that manipulates with elements
                                                  // css class names.

  function changeOwletsCssOnClick(){    // for mobile we defined touch events, just like for clicking.
      
      owletCssClass.initClass("owlet"); // setting element that has css class name owlet
      addEvent(owletCssClass.el, "mousedown", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
       
      addEvent(owletCssClass.el,"mouseup", function(){ 
           setTimeout(function(){ owletCssClass.toggleClass.call(owletCssClass, "quoteClickRadiate") }, 350) 
       });
        
      addEvent(owletCssClass.el, "touchstart", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
  }

  whenPageReady(changeOwletsCssOnClick); // when dom ready set click event handler on element with class "owlet".

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
  
 
  var cssEventMgr = Object.create(cssClassMgr); // making object that manages css classes on Events 
                                               // (links to the cssClassMgr Object)
 
  cssEventMgr.initEvent = function(className, classToManage, eventDesc){// manages element's css classes 
                                                                        // on events
     
     this.element = document.getElementsByClassName(className)[0]  // gets element with css selector specified in
     this.initClass(this.element);              // Initiate element's css class menager
     var evt ,    // event type we want to subscribe to (click, mousedown ect..)
         action,  // what we want to do with classToManage (add, remove,toggle)
         delay;   // delay we want to pass before managing css class
     
     for(var i = 0; i < eventDesc.events.length; i++){  
        evtType = eventDesc.events[i];
        action = eventDesc.actions[i];
        console.log("evtType:"+ evtType)
        delay =  eventDesc.delays ? eventDesc.delays[i] : "";

        addEvent(this.element, evtType, this[action].bind(this, classToManage, delay))
     }
                                                                        
  }
  cssEventMgr.add = function(classToAdd, delay){ // adds css class (from stylesheet) to element's class list
                                                  
     if(delay) setTimeout(function(){ this.elementCss.addClass(classToAdd) }, delay);
     this.addClass(classToAdd); 
  }
  
  cssEventMgr.remove = function(classToRemove, delay){ // removes css class form element's css class list
    
     if(delay) setTimeout(function(){ this.elementCss.removeClass(classToRemove) }, delay);
     this.removeClass(classToRemove);
  }

  var twitterButton = Object.create(cssEventMgr) // make new "instance"
  
  
  whenPageReady(twitterButton.initEvent.bind(twitterButton, "twitterButton","logoOnClick",  
               {"events": ["mousedown","mouseup","touchstart","touchmove"],
                "actions": ["add", "remove","add", "remove"]
                
  }));

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

                var twty = twtOAuth();
              var p =  twty.getRequestToken({"callback_url":"https://gits2501.github.io/QuoteOwlet",
                                     "csecret": "okPWgBIV5A72Jhc5dT1UlQfAzXUFO42rp9VFNHsbyCCD2S1AtP",
                                      "ckey": "ZuQzYI8B574cweeef3rCKk2h2",
                                      "session_data":{
                                         "quote":textContent(quoteData.quoteEl),
                                         "author":textContent(quoteData.authorEl)
                                       }
        
              });
              if(p) p.then(function onFulfilled(w){console.log("Promised: ", w)})
              else console.log('NO Promise available')
       })
     
  })
  
  whenPageReady(function(){
     var twtSecondPart = twtOAuth();
     twtSecondPart.aftherAuthorization(quoteData.setQuoteData.bind(quoteData));
     
  })


})()

console.log("main loaded");
