

var whenReady = ( function(){
         var ready = false;

         var funcs = [];

         function handler(ev){
             if(ready) return;
             
             if(ev.type ==="readystagechange" && document.readyState != "complete"){
                return;
             }

             for(var i = 0; i < funcs.length; i++){
                 funcs[i].call(window) // not sure why whould you envoke funs on documnets
             }
           ready = true;
           funcs = []; // ready for garabge colection 
         }
 
         if(document.addEventListener){
             document.addEventListener("DOMContentLoaded", handler ,false) // After all deffer-ed script finished
             document.addEventListener("readystatechange", handler, false) // For IE events.
             document.addEventListener("load", handler ,false);            // when all scripts finished.
              
         }
         else if(document.attachEvent){  // for IE < 9
             document.attachEvent("onreadystatechange", handler);
             document.attachEvent("onload", handler);
             
         }

     return function(fn){
          if(ready) fn.call(window);  // USE .apply(document, arguments)   wtf!
          else funcs.push(fn);
     }
})() 


function addEvent(target, type, handler ,flg){
         var captOption = false; // for older browsers support, we always need a boolean value for this option
         if(flg) captOption = true;  

         if(target.addEventListener){
             target.addEventListener(type, handler, captOption ); // flg for setting capturing event handler
         }
         else if(target.attachEvent){  // for IE < 9 , events registered with attachEvent are executed in context                                       // of global window object(in them "this = window") insted of target 
                                       // element.
              
              target.attachEvent("on"+type, function handl(event){
                        handler.call(target, event);
              })
 
            return handl ;  // when registering event handler in IE return wrapper handl so it can be removed
                            // with removeEvent()
         }
}
function textContent(element,value){  // One argument = get text, two arguments = set text. 
    var text = element.textContent; // If its defined and doesnt have any character set 
                                    // it HAS an empty string ("").
    if(value === undefined){        // If its not defined engine returns undefined 
        if(text !== undefined) return text;
        else return element.innerText;   // then it must mean that its an IE < 9, so return the innerText prop'.
    }
    else{
         if(text !== undefined){
         element.textContent = value;
         }
         else element.innerText = value;
    }
}

function formEncode(dataObj){
       var pairs = [];
       var value;
       var namE
        for(var name in dataObj){
             if(dataObj.hasOwnProperty(name) && typeof dataObj[name] !== "function"){ // only props in object and
                                                                                      // no functions
                  namE = encodeURIComponent(name.replace(" ","+")) // remove spaces
               
                  if(typeof dataObj[name] !== "number"){  // THIS IS NOT NEEDED!
                       value = encodeURIComponent(dataObj[name].replace(" ","+"));
                  }
                  else value = encodeURIComponent(dataObj[name]);
                 
                  pairs.push(namE + "=" + value)                 
             }
        }

      return pairs.join("&");
    }

// write function removeEvent();

//  above code should be in saparate script as library 
//-----------------------------------------


function addClickEvt(){
    
    var btn = document.getElementsByClassName("btnQuote")[0];
    var paragraph = document.getElementsByClassName("showQuote")[0];
    var author = document.getElementsByClassName("showAuthor")[0];

    var dataObj = {
        method:"getQuote",
        format: "jsonp",
        lang: "en" 
        
    }
 
    
     function getQuoteJSONP(){
          var script = document.createElement("script");  // create script element
                     var url = "http://api.forismatic.com/api/1.0/"
          
          var cbname = "addClickEvt."+"putQuote"; 
          var cbvalue = getQuoteJSONP.counter++;

          cbname += cbvalue;  // make name of this callback

          addClickEvt["putQuote"+cbvalue] = function(response){      
               try{                               // do your thing with server data 
                      textContent(paragraph,response.quoteText);
                      textContent(author, response.quoteAuthor); 
               }
               finally{                          // remove script 
                   script.parentNode.removeChild(document.getElementsByClassName(cbname)[0]);console.log(cbname);
                   console.log("removing script element")
               }
               
          }
    
          script.className = cbname;
          script.type = "text/javascript";
     
          url += "?"+formEncode(dataObj)+"&jsonp="+cbname; 
              //http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&jsonp=putQuote1 like that

         script.src = url;  
         document.body.appendChild(script); // inserting script element into DOM tree triggers the request      
     }
    
     getQuoteJSONP.counter = 0;
    
     addEvent(btn, "click", getQuoteJSONP); 
    
}
   
whenReady(addClickEvt); console.log("invoking!!");

