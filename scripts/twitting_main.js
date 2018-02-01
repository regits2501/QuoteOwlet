(function(){

  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

  var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
     
  var request = require(["request"]).request; // importing xmlhttp request API
  var textContent = require(["textContent"]).textContent; 
  var cssEventMgr = require(['cssEventMgr']).cssEventMgr;
  var whenPageReady = require(["whenReady"]).whenReady;
  var addEvent = require(["addEvent"]).addEvent;
  // var twizClient = require(["twizClient"]).twizClient; // requiring twiz-client from jsDelvr CDN from now
 
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
 textArea.getQuote = function(){
   return textContent(this.textEl);
 }

 whenPageReady(textArea.init.bind(textArea, '.twittText')) // when DOM is ready initialize the object

 whenPageReady(function addQuoteData_SendOnClick(){
    var secondPhase = twizClient();
    var sessionData = secondPhase.getSessionData();
 
    
    sessionData.replace("/\'", "");
    console.log('afther replace - quote :', sessionData)
    var tweetBtn = document.querySelectorAll('.twittButton')[0];
    var options = { 
       server_url :'https://quoteowlet.herokuapp.com',
       options:{
          method: "POST",
          path:'statuses/update.json',
       }
    }
    addEvent(tweetBtn, 'click', function(){
         console.log('quote:', textArea.getQuote.call(textArea))
         options.options.params = {
            status: textArea.getQuote.call(textArea)
         }
         secondPhase.accessTwitter(options);
    });
 });


})()
console.log('twitting_main loaded');

