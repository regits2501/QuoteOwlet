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

 mgr.define("classList",[], function classList(){ // function that simulates HTML5 classList property of Element
                                                   // It uses behaviour delegation pattern with private vars as
  // explained here -> https://stackoverflow.com/questions/32748078/variable-privacy-in-javascripts-behaviour-delegation-pattern/43476020#43476020
    
      var cssClassList = {};
      cssClassList.messages = {
          invalidClsName:"Class name invalid ",
          existClsName: "Class name already exist ",
          doesntExistClsname: "Class name doesn't exists "
      };
      cssClassList.init = function(e){      
        this.e = e; 
        
      };
      cssClassList.contains = function(clsName, pocket){ // Checks of for existance of class name,
                                                        // returns true or false
        if(clsName.length === 0 || clsName.indexOf(" ") != -1){// Throw error if its illegal css class name
                throw new Error(this.messages.invalidClsName + " " + clsName);
        }
        if(this.e.className === clsName) return true; // Return true if its exact match
        
        pocket.regexpS = new RegExp("\\b" + clsName + "\\b", "g"); // Search whole words only
        return pocket.regexpS.test(this.e.className);
      };   

      cssClassList.add = function(clsName){
        if(this.contains(clsName)){
               console.log(this.messages.existClsName);
               return;
        }
         
        var clss = this.e.className;
        if(clss && clss[clss.lenght-1] !== " "){ // If there is any class name and last sign is not a space,
             clsName = " " + clsName;   // append it in front of one we want to add.
             
        }
       
        this.e.className += clsName;      
         
      };
     
      cssClassList.remove = function(clsName, pocket){
          
          pocket.regexpRm = new RegExp("\\b" + clsName + "\\b\\s*", "g") // For removal, whole words plus any
                                                                         //  trailing white space.
          console.log("to Remove: "+clsName); 
          if(this.contains(clsName)){ // on false this.contains() throws an error.
                this.e.className = this.e.className.replace(pocket.regexpRm, "");
               console.log(this.e.className);
          }
          else console.log(this.messages.desntExistClsName + " " + clsName)
      };
      cssClassList.toggle = function(clsName){ // on-off switch
          if(this.contains(clsName)){ // if exists remove it
             this.remove(clsName);
             return false; // false is to notify "turn of"   
          }
          else {
             this.add(clsName);  // doesn't exists so add it.
             return true;
          }
      };

      cssClassList.toString = function(){
            return this.e.className;
      };

    /*   cssClassList.toArray = function(pocket){   // HTML5 classList property doesn't have this method.  
            pocket.regexpMch = new RegExp("\\b\\w+\\b\\s*", "g"); 
            return this.e.className.match(pocket.regexpMch)
         };
    
    */

  
 
   return function(e){
     if(e.classList) return e.classList; // If there already is HTML5 classList support, just return it. 
         console.log("e from classList: "+ e);
      function attachPocket(cList){  

        var funcsForPocket = Array.prototype.slice.call(arguments,1); // take arguments after cList
        var len = funcsForPocket.length;
      
        var pocket = {}; // object for placing private properties (not exposed directly to outside scopes)
        var instance = Object.create(cList);

        for (var i = 0; i < len; i++){
           (function(){
                var func = funcsForPocket[i];
              
                instance[func] = function(){
                     var args = Array.prototype.slice.call(arguments);
                     args = args.concat([pocket]); // append pocket to arguments

                     return cList[func].apply(this, args);
                }
            })()
        }
 
         instance.init(e);
         return instance;
      }
     
  
     return attachPocket(cssClassList,"contains","remove");
      
   }
 })

 mgr.define("styleRulesMgr",[], function(){
        
        var styleRulesUtils = {};  // object use css selector syntax to find rules
        styleRulesUtils.findRule = function(ruleName){ // returns rule object or undefined
              var len = this.rules.length; console.log("rules .length = "+ len,this.rules)
              for(var i = 0; i < len; i++){
                 if (this.rules[i].selectorText === ruleName) return this.rules[i];
                 
              }
              
         }

        var styleRules = Object.create(styleRulesUtils);
         styleRules.messages = {
              provideRuleName: "You must provide a rule name when calling this function.",
              invalidRuleName : "Rule name is invalid",
              ruleDoesntExist: "Rule doesn't exist" 
         };
         styleRules.returnRuleOrPrintMsg = function(ruleName,msg){ // prints message if rule doesnt exist or 
                                                                   // returns rule.
               var rule = this.contains(ruleName);
               if(!rule){
                console.log(msg + ": " + ruleName);
                return;
               }

               return rule;
         }
         styleRules.initStyleSheet = function(styleSheet){
             this.styleSheet = styleSheet || document.styleSheets[0]; // Use passed or first stylesheet in doc.
              console.log("this.sheet = "+this.styleSheet); console.log("sheetRules = "+this.styleSheet.cssRules)
             this.rules = this.styleSheet.cssRules ? this.styleSheet.cssRules : this.styleSheet.rules; // IE has
                                                                                                      // "rules" 
         }
         styleRules.contains = function (ruleName){ 
            if(ruleName.length === 0){
                throw new Error(this.messages.provideRuleName);
            }
            return this.findRule(ruleName); // returns style object or undefined
         }
         styleRules.addStyle = function(ruleName, cssPropName, propValue){
            var rule = this.returnRuleOrPrintMsg(ruleName, this.messages.ruleDoesntExist);
            if(rule) rule.style[cssPropName] = propValue;  // set provided css property and value for that rule  
         }
         styleRules.removeStyle = function(ruleName, cssPropName){
                var rule = this.returnRuleOrPrintMsg(ruleName, this.messages.ruleDoesntExist);
                if(rule) rule.style[cssPropName] = "";                 
                console.log(""+rule.selectorText+"["+ cssPropName+"]="+ rule[cssPropName])
         }


        
       return function(){
          return Object.create(styleRules);
       }

 }) 
 

 mgr.define("PrefixedAnimationEvents",[], function(){

      var animationEvents = {};

      animationEvents.prefixes = ["","moz","webkit",""];

 }) 

}



