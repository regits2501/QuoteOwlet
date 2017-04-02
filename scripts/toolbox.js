/* Defining utility functions and modules: 

 whenReady() - description
 addEvent()- -//-
 textContent() - 
 formEncode
*/  
if(typeof _pS_.modulMgr ==="object" && _pS_.modulMgr !== null){ // checking to see if modulMgr exists as object
 var mgr = _pS_.modulMgr;
 mgr.define("whenReady",[], function whenReady(){
         var ready = false;

         var funcs = [];
         function handler(ev){ 
             if(ready) return; 
             
             if(ev.type ==="readystagechange" && document.readyState != "complete"){
                return;
             }

             for(var i = 0; i < funcs.length; i++){
                 funcs[i].call(document) // not sure why whould you envoke funs on documnets
             }
           ready = true;
          // funcs = []; // ready for garabge colection 
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
          if(ready) fn.call(document);  // USE .apply(document, arguments)   wtf!
          else {funcs.push(fn);}
         
     }
 }) 


 mgr.define("addEvent",[],function addEvent(target, type, handler ,flg){
         var captOption = false; // for older browsers support, we always need a boolean value for this option
         if(flg) captOption = true;  

         if(target.addEventListener){
            target.addEventListener(type, handler, captOption ); // flg for setting the capturing event handler
         }
         else if(target.attachEvent){  // for IE < 9 , events registered with attachEvent are executed in context                                       // of global window object(in them "this = window") insted of target 
                                       // element.
              target.attachEvent("on"+type, function handl(event){
                  event = event || window.event;  // for IE < 9
                  return handler.call(target, event);
              })
 
            return handl ;  // when registering event handler in IE return wrapper handl so it can be removed
                            // with removeEvent()
         }
 }, true )
 
 mgr.define("textContent",[],function textContent(element,value){// One argument = get text, 
                                                                 // two arguments = set text. 
    var text = element.textContent; // If its defined and doesnt have any character set 
                                    // it HAS an empty string ("") by default DOM setting.
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
 }, true)

 mgr.define("formEncode",[],function formEncode(dataObj){
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
}, true)
// write function removeEvent();

}

