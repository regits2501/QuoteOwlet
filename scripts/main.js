import xwizClient from "./xwiz-client_bundle.js";

// add xwiz-client to global scope
window.xwizClient = xwizClient;

(function () {
   if (typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

   var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need

   var request = require(["request"]).request; // importing xmlhttp request API
   var textContent = require(["textContent"]).textContent;
   var whenPageReady = require(["whenReady"]).whenReady;
   var addEvent = require(["addEvent"]).addEvent;
   var cssClassMgr = require(['cssClassMgr']).cssClassMgr(); // adds, removes css classes for an element
   var cssEventMgr = require(['cssEventMgr']).cssEventMgr;
   var styleRulesMgr = require(["styleRulesMgr"]).styleRulesMgr;
   var addPrefAnimEvent = require(["addPrefixedAnimationEvent"]).addPrefixedAnimationEvent;
   var byteLength = require(["byteLength"]).byteLength;
   var quoter = {}; // Object that handles getting data from server and showing it on page


   whenPageReady(function addTwitterUserName() {                   // adds twitter user name to element on page 
      var sessionData = xwizClient().getSessionData();           // get sessiondata fomr redirection url, if any
      var user = document.createElement('div');
      var screenName = sessionData ? sessionData.screenName : 'guest' // userName from xwiz-client session data 
      // or put 'guest'        

      user.setAttribute('class', 'user');                 // add style - attach '.user' class from stylesheet
      user.innerText = screenName;

      document.body.insertBefore(user, document.querySelector('.quoteCont')) // add element before quote container
   })

   //// no owlet flying animation on redirections /////
   var leftWing = Object.create(cssClassMgr);
   var rightWing = Object.create(cssClassMgr);
   var owlet = Object.create(cssClassMgr);


   var mainStyleSheet = styleRulesMgr(); // Instance of object that handles css rules of a style sheet 

   whenPageReady(function removeOwletsAnimation() {// remove owlets animation on redirection urls

      if (!xwizClient().getSessionData()) return;   // not redirection urls 

      // css style sheet. It uses css selector sintax to select rules.
      mainStyleSheet.initStyleSheet(); // initiate style sheet contenxt

      leftWing.initClass("left");  // Elements that have "left" and "right" class names
      rightWing.initClass("right");
      owlet.initClass('owletCont');

      leftWing.removeClass('lwAnimation')   // remove left wing wing animations
      leftWing.addClass('wingsRedir')       // add css for redirection pages (wings position not for flight)


      rightWing.removeClass('rwAnimation');  // remove right wing wing animations
      rightWing.addClass('wingsRedir');      //  add css for redirection pages (wings position not for flight) 

      owlet.removeClass('owletCont')        // removes 'page glide' animation in cross browser way
      owlet.addClass('owletContRedir')      // add just css with no page glide animation

   })

   quoter.messages = {
      noQuoteInArray: "There is no quote in array."
   }

   quoter.url = "https://quote-owlet-twiz-server-1.onrender.com/proxy/fetch/https://zenquotes.io/api/random"; // server url

   quoter.queryParams = {                   // making data object specific to JSONP server we are connnecting to. 
      method: 'getQuote',
      format: 'text',
      key: 0,
      lang: 'en'
   };

   quoter.callback = function (data) { // Setting  callback function which will be invoked with server data  
      let parsedData = JSON.parse(data);
      let quote = parsedData[0]; // get quote object
      _pS_.quotes.push(quote);  // We are putting server data into quotes array
      // which is a propertie of _pS_ global var.
   }
   quoter.getQuote = function (thisMany) { // Gets data from server and initiates callback function which puts that 
      // data in "quotes" array. 
      this.setQuoteKey(); // Generates random quote key
      thisMany = thisMany || 1; // Defaults to 1, if it's negative it doesnt get any quote, see loop.
      for (thisMany; thisMany > 0; thisMany--) {
         request({ "url": this.url, "queryParams": this.queryParams, "callback": this.callback });// uses

         // request API
      }
   }.bind(quoter)

   quoter.setQuotePlace = function () {
      quoter.textPlace = document.getElementsByClassName("showQuote")[0]; // html element to put quote text 
      // into.
      quoter.authorPlace = document.getElementsByClassName("showAuthor")[0];
   }

   quoter.showQuote = function () { // inserts quote data into paragraphs elements, shows quote data on page.

      let quotes = _pS_.quotes;

      let quoteText = "They sasy the owlet brings wisdom";
      let quoteAuthor = "Trough random quotes";

      if (quotes.length !== 0) {

         let quote = quotes.pop();

         quoteText = quote.q;
         quoteAuthor = quote.a;
      }
      else {
         console.info(this.messages.noQuoteInArray);
         return;
      }

      textContent(this.textPlace, quoteText);
      textContent(this.authorPlace, quoteAuthor);


   }.bind(quoter);

   quoter.setQuoteKey = function () { // sets random quote key that server is using to generates data.
      var value = Math.round(Math.random() * 100000);
      this.queryParams.key = value;

   }.bind(quoter);
   
   quoter.showAndGetQuote = function () {
      this.showQuote(); // show quote data on page
      this.getQuote();

   }.bind(quoter)

   quoter.chooseTriggerElement = function (el) { // picks element to be "trigger" for showing data on page. This is
      // owlet (div) element to which we attach onclick handler later.
      quoter.triggerElement = document.querySelectorAll(el)[0];
   }

   quoter.setQuoteTrigger = function (eventType, handler) {
      addEvent(this.triggerElement, eventType, handler); // adds showQuoteData as onclick 
      // event handler function, to triggerElement
      // we chose.
   }.bind(quoter);

   quoter.getQuote() // Requesting quote data from server, also doesn't need DOM to be loaded. Preloads one quote.
   whenPageReady(quoter.setQuotePlace); // Selecting html elements for placing quote data into. Needs DOM tree.ggg
   whenPageReady(quoter.chooseTriggerElement.bind(null, ".owlet"));// This function uses CSS selector syntax
   // to select html element.

   whenPageReady(quoter.setQuoteTrigger.bind(null, "click", quoter.showAndGetQuote)); // When page is loaded,
   // set "clicking the owlet"
   // to be event that triggers
   // display of quote data on page



   ////////////// wingRadiate animation (on click event) /////////////////////////
   var owletCssClass = Object.create(cssClassMgr); // Instance of an object that manipulates with elements
   // css class names.

   function changeOwletsCssOnClick() {    // for mobile we defined touch events, just like for clicking.

      owletCssClass.initClass("owlet"); // setting element that has css class name 'owlet'
      addEvent(owletCssClass.el, "mousedown", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));

      addEvent(owletCssClass.el, "mouseup", function () {
         setTimeout(function () { owletCssClass.toggleClass.call(owletCssClass, "quoteClickRadiate") }, 350)
      });

      addEvent(owletCssClass.el, "touchstart", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
   }

   whenPageReady(changeOwletsCssOnClick); // when dom ready set click event handler on element with class "owlet".

   ////////// left and right wings animation fix (cross browser)////////


   function removeWingAnimationsOnEnd() { // Removes css animations we used for owlets wingsFlap, tuckWing
      // and wingRadiate, after last animation(wingRadiate) in sequence ends.
      // All in order to correct animation bugs across browsers.

      mainStyleSheet.initStyleSheet();  // If no argument it defaults to first stylesheet for document

      leftWing.initClass("left");  // Elements that have "left" and "right" class names
      rightWing.initClass("right");

      addPrefAnimEvent(leftWing.el, "AnimationEnd", function (handle) {
         setTimeout(function () {
            if (handle.animationName === "wingRadiate") {
               mainStyleSheet.addStyle(".left", "line-height", "1.3em");
               leftWing.removeClass.call(leftWing, "lwAnimation"); // "lwAnimation" is css class name 
            }
         }, 100)                                                              // responsible for all 3 animations
      })
      addPrefAnimEvent(rightWing.el, "animationend", function (handle) {
         setTimeout(function () {
            if (handle.animationName === "wingRadiate") {
               mainStyleSheet.addStyle(".right", "line-height", "1.3em");
               rightWing.removeClass.call(rightWing, "rwAnimation");
            }
         }, 100);
      })
   }

   whenPageReady(removeWingAnimationsOnEnd);

   var sheetRules = styleRulesMgr();
   sheetRules.initStyleSheet(); // initialize style sheet of this document;



   /////////////// chrome mobile fix  /////////////////////
   var chromeCssBugFix = {};    // fix the css bug on chrome mobile
   chromeCssBugFix.checkChromeMob = function () {  // sniff chrome mobile
      var browser = window.navigator.userAgent
      this.chrome = /Chrome/g.test(browser);
      this.mobile = /Mobi/g.test(browser);
   }
   chromeCssBugFix.fixIt = function () {
      this.checkChromeMob(); // checking for chrome for mobile
      if (!this.chrome || !this.mobile) return; // dont apply fix if it's other browser

      var chroMobEl = document.getElementsByClassName("chroMob")[0];
      this.dispatchFix();


   }.bind(chromeCssBugFix);

   chromeCssBugFix.dispatchFix = function () {
      var htmlEl = document.getElementsByTagName("html"); // get html element
      var running = false;

      function adjustHeight() {
         if (running) return; // if we've already called abjustHeight and it didnt finish executing, then return

         running = true;
         setTimeout(function () {
            requestAnimationFrame(function () { // reqAnimFrame func is called but not before 
               // 160 ms has passed
               mainStyleSheet.addStyle("html", "min-height", window.innerHeight.toString() + "px") // adjust height
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
   var xButton = Object.create(cssEvents);


   whenPageReady(xButton.initEvent.bind(xButton, "xButton", "logoOnClick",
      {
         "events": ["mousedown", "mouseup", "touchstart", "touchmove"],
         "actions": ["add", "remove", "add", "remove"]
      }));

   /////////////// twitter OAuth (for SPA cases) //////
   var quoteData = {};

   quoteData.getQuoteElements = function () {
      this.quoteEl = document.querySelectorAll('.showQuote')[0]; // get element
      this.authorEl = document.querySelectorAll('.showAuthor')[0];

   }

   whenPageReady(quoteData.getQuoteElements.bind(quoteData))     // when page is ready sellect the quote elements

   quoteData.setQuoteData = function (sessionData) {
      if (sessionData) {
         textContent(this.quoteEl, sessionData.quote);
         textContent(this.authorEl, sessionData.author);
      }
   }

   function oauth() {

      let options = {

         server_url: 'https://quote-owlet-twiz-server-1.onrender.com/xwiz-server',

         redirection_url: "https://regits2501.github.io/QuoteOwlet/",

         // data that is appended to redirection_url as query parameters
         session_data: {
            quote: textContent(quoteData.quoteEl),
            author: textContent(quoteData.authorEl),
            screenName: textContent(document.querySelector('.user'))

         },

         // X request options
         options: {
            method: 'POST',
            path: '/2/tweets',
            body: {

               text: '\"' + textContent(document.querySelector('.showQuote')) + '\"'
                  + '\n ~ ' + textContent(document.querySelector('.showAuthor'))
            },

            encoding: 'json'
         },

         callback: function (o) {
            if (o.error) console.log('error (callback_func): ', o.error)
            if (o.data) console.log('data in redirection: ', o.data)
            if (o.window) {
               console.log('in callback_func has Window: ', o.window);
            }
            window.temp = o.token.oauth_token

         },

         endpoints: {
            authorize: 'authenticate'
         }
      }

      const xwizlent = xwizClient();
      const response = xwizlent.OAuth(options);

      if (response) {
         response.then(function onFulfilled(o) {

            if (o.redirection) {
               console.info('no token on server: Redirection');
               return
            }

            if (o.error) { // check that we got success code

               xButtonEpilog('tweetFailed'); // add css animation for failure to btn 
            }

            if (o.data) {

               xButtonEpilog('tweetOk'); // add css animation for success to btn
               setUserName(o.data.screen_name);
            }

         })
      }
   }

   function Authenticate() {  // on click authenticate to twitter
      addEvent(document.getElementsByClassName("xButton")[0], "click", oauth);
   }

   whenPageReady(Authenticate);

   whenPageReady(function () { // when testing SPA case

      const xwizlent = xwizClient();
      let sessionData = xwizlent.getSessionData();
      quoteData.setQuoteData.apply(quoteData, [sessionData]);

      const options = {
         server_url: 'https://quote-owlet-twiz-server-1.onrender.com/xwiz-server',
         options: {
            method: "POST",
            path: '/2/tweets',
            body: {
               text: '\"' + textContent(document.querySelector('.showQuote')) + '\"'
                  + '\n ~ ' + textContent(document.querySelector('.showAuthor'))
            },
            encoding: 'json'
         }
      }

      try {

         const response = xwizlent.finishOAuth(options); // pass arguments 
         // (needed just server url and options)
         if (response) {
            response.then(function (o) {

               if (o.error) { // check that we got success code

                  xButtonEpilog('tweetFailed'); // add css animation for failure to btn 
               }

               if (o.data) {

                  xButtonEpilog('tweetOk'); // add css animation for success to btn
                  setUserName(o.data.screen_name);
               }

            })
               .catch(function (e) {
                  console.info('finish OAuth: ', e)
               })
         }

      } catch (e) {
         console.log('finish OAuth error: ', e)
      }
   })

   var xButtonEpilog = function (selector) { // adds animation to twitter button

      var btn = Object.create(cssClassMgr);
      btn.initClass('xButton');

      btn.addClass(selector); // adds tweet Ok or tweet failure animation to btn
      var btnEl = document.getElementsByClassName('xButton')[0]
      btnEl.removeEventListener('click', oauth, false); // remove oauth on click while animation lasts

      setTimeout(function () {
         btn.removeClass(selector);                    // remove animation
         addEvent(btnEl, 'click', oauth);               // bring back oauth
         // on animation end
      }, 3201)                                         // 2201 is on track with css animation timings (see css)
   }

   var setUserName = function (name) {
      textContent(document.querySelector('.user'), name); // set user name as text of the user element
   }

})()

console.log("main loaded");
