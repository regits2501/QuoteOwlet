(function(){

  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];

  var require = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
     
  var request = require(["request"]).request; // importing xmlhttp request API
  var textContent = require(["textContent"]).textContent; 
  var whenPageReady = require(["whenReady"]).whenReady;
  var addEvent = require(["addEvent"]).addEvent;
  var twtOAuth = require(["twtOAuth"]).twtOAuth; 


var textArea = {};
textArea.init = function (element){
   this.textEl = document.querySelectorAll(element)[0]
}
textArea.insertQuote = function(sessionData){           // inserts received data from redirection (callback) url
    console.log('sessionData =====', sessionData);
   textContent(this.textEl, sessionData.quote + '\n ~' + sessionData.author);
}

whenPageReady(textArea.init.bind(textArea, '.twittText')) // when DOM is ready initialoze the object

whenPageReady(function(){
   var twtOAuthSecond = twtOAuth();
   var sessionData = twtOAuthSecond.getSessionData();

   textArea.insertQuote.call(textArea, sessionData);

});




  








})()
console.log('twitting_main loaded')

