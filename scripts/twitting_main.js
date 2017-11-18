(function(){

  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

  var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
     
  var request = require(["request"]).request; // importing xmlhttp request API
  var textContent = require(["textContent"]).textContent; 
  var cssEventMgr = require(['cssEventMgr']).cssEventMgr;
  var whenPageReady = require(["whenReady"]).whenReady;
  var addEvent = require(["addEvent"]).addEvent;
  var twtOAuth = require(["twtOAuth"]).twtOAuth;
 
//////// twitt button css /////////////////
 var cssEvents = cssEventMgr();
 var twittButton = Object.create(cssEvents); // link to css event mgr
 
 whenPageReady(twittButton.initEvent.bind(twittButton, "twittButton","logoOnClick",  
               {"events": ["mousedown","mouseup","touchstart","touchmove"],
                "actions": ["add", "remove","add", "remove"]          
 }));







 ////////////////////////
 var textArea = {};
 textArea.init = function (element){
    this.textEl = document.querySelectorAll(element)[0]
 }
 textArea.insertQuote = function(sessionData){           // inserts received data from redirection (callback) url
     console.log('sessionData =====', sessionData);
    textContent(this.textEl, "\" " + sessionData.quote + '\"\n~ ' + sessionData.author);
 }

 whenPageReady(textArea.init.bind(textArea, '.twittText')) // when DOM is ready initialoze the object

 whenPageReady(function addQuoteData_SendOnClick(){
    var secondPhase = twtOAuth();
    var sessionData = secondPhase.getSessionData();

    textArea.insertQuote.call(textArea, sessionData);
    var tweetBtn = document.querySelectorAll('.twittButton')[0];
    addEvent(tweetBtn, 'click', function(){
         secondPhase.accessTwitter();
    });
 });


})()
console.log('twitting_main loaded')

