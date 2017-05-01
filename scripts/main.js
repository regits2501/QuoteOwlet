
(function(){
  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];


     
  var getJSON = _pS_.modulMgr.require(["getJSONcontroller"]).getJSONcontroller; // importing getJSON API
  var textContent = _pS_.modulMgr.require(["textContent"]).textContent;
  var whenPageReady = _pS_.modulMgr.require(["whenReady"]).whenReady;
  var addEvent = _pS_.modulMgr.require(["addEvent"]).addEvent;
  var classList = _pS_.modulMgr.require(["classList"]).classList;  
  var styleRulesMgr = _pS_.modulMgr.require(["styleRulesMgr"]).styleRulesMgr;
  var addPrefAnimEvent = _pS_.modulMgr.require(["addPrefixedAnimationEvent"]).addPrefixedAnimationEvent;


  var quoter = {}; // Object that handles getting data from server and showing it on page

  quoter.messages = {
      noQuoteInArray: "There is no quote in array."
  }                 /* https://thingproxy.freeboard.io/fetch/ is the forward proxy we use to avoid 
                       "mixed content" loading since api.forismatic.com doesnt support https */
  quoter.url = "https://thingproxy.freeboard.io/fetch/http://api.forismatic.com/api/1.0/"; // server url
  quoter.queryParams = {                   // making data object specific to JSONP server we are connnecting to. 
      method: 'getQuote',
      format: 'json',
      lang: 'en'
  };   
  quoter.callback = function (data) { // Setting  callback function which will be invoked with server data               
       _pS_.quotes.push(data);  // We are putting server data into quotes array
                                // which is a propertie of _pS_ global var.
     
        for(var i = 0; i < _pS_.quotes.length; i++)
        console.log(_pS_.quotes[i]);
  }
  quoter.getQuote = function(thisMany){ // Gets data from server and initiates callback function which puts that 
                                        // data in "quotes" array. 
      thisMany = thisMany || 1 ; // Defaults to 1, if it's negative it doesnt get any quote, see loop.

      for( thisMany; thisMany > 0; thisMany--){ 
          getJSON(this.url, this.queryParams, this.callback); // new instance od getJSON API
      }
  }.bind(quoter)
  quoter.setQuotePlace = function(){
     quoter.textPlace = document.getElementsByClassName("showQuote")[0]; // html element to put quote text 
                                                                           // into.
     quoter.authorPlace = document.getElementsByClassName("showAuthor")[0];
 }

 quoter.showQuote = function(){ // inserts quote data into paragraphs elements, shows quote data on page.
       
      if(_pS_.quotes.length !== 0){
         var q = _pS_.quotes.splice(0,1)[0] // take (remove) first element from quotes 
         var quoteText = q.quoteText;   // get text
         var quoteAuthor = q.quoteAuthor;   // get author
      }
      else console.log(this.messages.noQuoteInArray);  
      
      textContent(this.textPlace, quoteText);
      textContent(this.authorPlace, quoteAuthor);

        
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

 cssClassMgr.initClass = function(name){  
   this.el = document.getElementsByClassName(name)[0];

   this.owletCssList = classList(this.el); // Using classList, module that emulates HTML5 classList property
                           
 }
 cssClassMgr.addClass = function(clsName){
    this.owletCssList.add(clsName);  // adding css class name to the owlet html element
    
 }
 cssClassMgr.removeClass = function(clsName){
   
    this.owletCssList.remove(clsName); 
 } 
 cssClassMgr.toggleClass = function(clsName){
    this.owletCssList.toggle(clsName);
 }
 cssClassMgr.toString = function(){
    return this.owletCssList.toString();

 }

 ////////////////////////////////////////////
 

////////////////////////////////////////////

  
  var owletCssClass = Object.create(cssClassMgr); // Instance of an object that manipulets with elements
                                                  // css class names.

  function changeOwletsCssOnClick(){  // for mobile we defined touch events, just like for clicking.
      
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
                                       // and wingRadiate. After last animation(wingRadiate) in sequence ends.
                                       // All in order to correct animation bugs across browsers.
    
     mainStyleSheet.initStyleSheet(); // If no argument it defaults to first stylesheet for document

     leftWingClass.initClass("left"); // Elements that have "left" and "right" class names
     rightWingClass.initClass("right");

     addPrefAnimEvent(leftWingClass.el, "AnimationEnd", function(handle){ 
       setTimeout(function(){
         if(handle.animationName === "wingRadiate"){
           mainStyleSheet.addStyle(".left","line-height","1.3em");  
           leftWingClass.removeClass.call(leftWingClass,"lwAnimation"); // "lwAnimation" is css class name (rule)
         }
       },100)                                                              // responcible for all 3 animaitons
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
 })()

console.log("main loaded");
