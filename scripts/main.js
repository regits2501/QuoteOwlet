
(function(){
  if(typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];


     
  
  var requestJSONP = _pS_.modulMgr.require(["getJSONPcontroller"]).getJSONPcontroller; // importing getJSONP API
  var textContent = _pS_.modulMgr.require(["textContent"]).textContent;
  var whenPageReady = _pS_.modulMgr.require(["whenReady"]).whenReady;
  var addEvent = _pS_.modulMgr.require(["addEvent"]).addEvent;

  var quoter = {}; 

  quoter.messages = {
      noQuoteInArray: "There is no quote in array."
  }
  quoter.url = "http://api.forismatic.com/api/1.0/"; // server url
  quoter.queryData = {                     // making data object specific to JSONP server we are connnecting to. 
      method: 'getQuote',
      format: 'jsonp',
      lang: 'en'
  };   
  quoter.scriptsPlace = document.getElementsByTagName('head')[0]; // chosing where to put our script tags
  quoter.callback = function (data) { // Setting  callback function which will be invoked with server data                                       // as argument.
       _pS_.quotes.push(data);  // We are putting server data into quotes array
                                // which is a propertie of _pS_ global var.
     
        for(var i = 0; i < _pS_.quotes.length; i++)
        console.log(_pS_.quotes[i]);
  }
  quoter.setQuoteRequest = function(){ 
      
      requestJSONP.setUrl(this.url);  //set server url
      requestJSONP.setQueryData(this.queryData); 
      requestJSONP.setScriptPlace(this.scriptsPlace);
      requestJSONP.setCallback(this.callback) 
    
  } 
  quoter.getQuote = function(thisMany){

      thisMany = thisMany || 1 ; // defaults to 1, if it's negative it doesnt get any quote, see loop.

      for( thisMany; thisMany > 0; thisMany--){
         requestJSONP.getData(); // getData() triggers callback function invocation when data from server arives
      }
  }
  quoter.setQuotePlace = function() {
     quoter.textPlace = document.getElementsByClassName("showQuote")[0]; // html element to put text content
                                                                           // into.
     quoter.authorPlace = document.getElementsByClassName("showAuthor")[0];
 }

 quoter.putQuote = function(){
       
      if(_pS_.quotes.length !== 0){
         var q = _pS_.quotes.pop();    // take element from quotes
         var quoteText = q.quoteText;   // get text
         var quoteAuthor = q.quoteAuthor;   // get author
      }
      else console.log(this.messages.noQuoteInArray);  // here could go putQuote again
      textContent(this.textPlace, quoteText);
      textContent(this.authorPlace, quoteAuthor);

        
  }.bind(quoter);

  quoter.preLoadQuote = function (num){
      this.getQuote(num); // Gets data from server and initiates callback function that puts that 
                              // data in "quotes" array. "preLoads" data into array before showing it on page.
  }
  quoter.showQuoteData = function(){
       
      this.putQuote(); // show quote data on page
      this.preLoadQuote(); // preloads one more quote in quotes array for eventual next invocation  
  }.bind(quoter)

  quoter.chooseTriggerElement = function (el){ // picks element to be "trigger" for showing data on page. This is
                                               // button element to which we attach onclick handler later.
      quoter.triggerElement = document.querySelectorAll(el)[0]; 
  }

  quoter.setQuoteTrigger = function(){ 
      addEvent(this.triggerElement, "click", this.showQuoteData); // adds showQuoteData as onclick 
                                                                  // event handler function, to triggerElement
                                                                  // we chose.
  }.bind(quoter);
 
  
  quoter.setQuoteRequest();// Setting parameters needed for getJSONPcontroller api,
                           // can go even when DOM not loaded.
  quoter.preLoadQuote() // Requesting quote data from server, also doesn't need DOM to be fully loaded.
  whenPageReady(quoter.setQuotePlace); // Selecting html elements for placing quote data into. Needs DOM tree.
  whenPageReady(quoter.chooseTriggerElement.bind(null,".quoteClick"));//This function uses CSS selector syntax                                                                        //to select html element.
  whenPageReady(quoter.setQuoteTrigger); // When page is loaded, set "clicking the button"                                                    // as event that triggers display of quote data on page
                                                       

  
  
})()

console.log("main loaded");
