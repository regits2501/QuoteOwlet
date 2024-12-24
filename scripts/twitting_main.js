(function(){

  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

  var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
     
  var request = require(["request"]).request; // importing xmlhttp request API
  var textContent = require(["textContent"]).textContent; 
  var cssEventMgr = require(['cssEventMgr']).cssEventMgr;
  var cssClassMgr = require(['cssClassMgr']).cssClassMgr();
  var whenPageReady = require(["whenReady"]).whenReady;
  var addEvent = require(["addEvent"]).addEvent;
  // var twizClient = require(["twizClient"]).twizClient; // requiring twiz-client from jsDelvr CDN from now
 
//////// twitt button css /////////////////
 var cssEvents = cssEventMgr();
 var twittButton = Object.create(cssEvents); // link to css event mgr
 
 whenPageReady(twittButton.initEvent.bind(twittButton, "twtButton","btnOnClick",  
               {"events": ["mousedown","mouseup","touchstart","touchmove"],
                "actions": ["add", "remove","add", "remove"]          
 }));
 
 whenPageReady(function addTwitterUserName(){                   // adds twitter user name to element on page 
     var sessionData = twizClient().getSessionData();           // get sessiondata fomr redirection url, if any
     var userName = sessionData ? sessionData.userName : 'guest' // userName from twiz-client session data 
                                                                 // or put 'guest'        
     textContent(window.opener.document.querySelector('.user'), userName);
   
 })
 ////////////////////////
 var textArea = {};
 textArea.init = function (element){
    this.textEl = document.querySelectorAll(element)[0]
 }
 textArea.insertQuote = function(sessionData){           // inserts received data from redirection (callback) url
    console.log('sessionData =====', sessionData);
    if (sessionData && typeof sessionData !== 'string'){
          textContent(this.textEl, "\" " + sessionData.quote + '\"\n~ ' + sessionData.author);
          return
    }
   
    textContent(this.textEl, sessionData);
    
 }

 textArea.getQuote = function(){
   return textContent(this.textEl);
 }

 whenPageReady(textArea.init.bind(textArea, '.twittText')) // when DOM is ready initialize the object

 whenPageReady(function addQuoteData_SendOnClick(){

    var secondPhase = twizClient();
    var sessionData = secondPhase.getSessionData();     // get session data from url
 
    console.log('before')
    textArea.insertQuote.call(textArea, sessionData);     // insert into text area quote text we got from url
   
    var twtButton = document.querySelector('.twtButton');

    var options = { 
       server_url :'https://quoteowlet.herokuapp.com',
       options:{
          method: "POST",
          path:'statuses/update.json',
          params:{
            status: textArea.getQuote.call(textArea)
         }

       }
    }
    addEvent(twtButton, 'click', oauth.bind(null, secondPhase, options));

 })
 
 function oauth(secondPhase, options){

        try{  
           var p = secondPhase.finishOAuth(options);
           if(p)
                p.then(function(o){
                  if(o.error){
                      console.log('error (twitter)', o.error);
                      xButtonEpilog('tweetFailed');      // add animation that indicates that tweet failed  
                  }
                  
                  if(o.data){ 
                     console.log('success data: ', o.data);
                      xButtonEpilog('tweetOk');         // add animation that indicaties tweet was success
                      setUserName(o.data.user.name) 
                  }

                }, function rejected(err){

                   console.log('error promise rejected with: ', err);
               })
               .catch(function(e){
                  console.log('error in promise: ', e )
                })
        }
        catch(e){
          console.log('error in try-catch: ', e);
        }
 }
var xButtonEpilog = function(selector){ // adds animation to twitter button
     var btnText = 'tweet'
     var btn = Object.create(cssClassMgr);
     var btnEl = document.getElementsByClassName('twtButton')[0]
     
     btn.initClass('twtButton');
     btn.addClass(selector);                           // adds tweet Ok or tweet failure animation to btn
     btnEl.removeEventListener('click', oauth, false); // remove oauth on click while animation lasts
     textContent(btnEl, '');                           // remove button text

     setTimeout(function(){
        btn.removeClass(selector);                    // remove animation
        addEvent(btnEl,'click', oauth);               // bring back oauth
        textContent(btnEl, btnText)                   // bring back button text
     }, 3201)                                         // 2201 is on track with css animation timings (see css)
 }
 
 var setUserName = function (name){ console.log('.user', window.opener.document.querySelector('.user'));
     textContent(window.opener.document.querySelector('.user'), name); // set user name as text of the user element in parent window
 }
 
})()
console.log('twitting_main loaded');

