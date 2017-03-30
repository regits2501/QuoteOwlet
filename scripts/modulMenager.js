
( function () {
  if(!_pS_ && _pS_ == null) console.log("_pS_ (protoScope) object doesnt exists."); // emit message if _pS_ 
                                                                                    // objet doesn't exist.
  else if(typeof _pS_ == "object") _pS_.modulMgr = (function (){

    var modules = {};
  
    var modulController = {
        modules: {}, // object where all defined modules reside
        messages: {
           modulNotDefined: "Modul is not defined:",
           modulDefinitionFails: "Modul definition fails.",
           partialLoad:"Some modules have not been loaded. Check returned object's properties."
        },
        isDefined: function isDefined(dep){  // dep is name of dependency we look for
          var dpn = modules[dep];
          if(dpn && (typeof dpn == "object" || typeof dpn == "function"))return true;
          else return false;
          
               
        },
        showNotDefined: function notDefined(dep){
          console.log(this.messages.modulNotDefined + dep )
        },
        markNotDefined: function markNotDefined(deps, idx){
             deps[idx] = "notDefined " + deps[idx]; // put "notDefined" string in front of name of missing dep
        },
        loadDeps: function loadDeps(deps, skipMissing){ //
          var loaded = [];
          if(skipMissing === undefined) skipMissing = false; // default is not to skip any missing dependency 
 
          for(var i = 0; i < deps.length; i++){
             if(this.isDefined(deps[i])) loaded.push(modules[[deps[i]]] ); 
             else if(!skipMissing){         // if we are not skipping any missing dependency  
                     this.showNotDefined(deps[i]); // emit which one is not defined(missing).
                     return false;            
                  }
                  else {  // if we are skipping them, then just mark them
                     this.markNotDefined(deps, i);
                  }                 
                                            
          }
           
           return loaded;
        },
        define: function define(name, deps, func){
           var depsRdy = loadDeps(deps);
           if(depsRdy) modules[name] = func.apply(func, depsRdy); // It is exepted that every module func
                                                                 // returns public API object. 
           else console.log(this.messages.moduleDefinitionFails);
        },
        makeModulesObject: function(deps, loadedDeps){ // makes new object that has dependancies we requered
                                                       
           var modulesObj = {};
           var missCount = 0;
          
           for(var j = 0; j < deps.length; j++){ // if there is a miss we count it. So dependency from 
                                                       // loadedDeps will be in j-missCount index place. 
               var matched;                            // Simple hack for doing everything in one loop.
              if(!deps[j].match("notDefined")){    // if  
                modulesObj[deps[j]] = loadedDeps[j-missCount]; //  deps[j] is dependancy name and right hand side
                                                             // is implementation of that dependancy.
              }
              else {
                modulesObj[dep[j]] = undefined; // if dependancie doesn't exist set value of undefined
                missCount++;
              } 
           } 
             
           return modulesObj;
        },
        require: function require(deps){ // function to be used directly in programs or module programmer
                                         // could use it in modules to dynamicaly call deps.  
           var needed = deps.length;
           var loaded = loadDeps(deps, true); // Load dependencies, but skipp any missing. 
                                              // So modules that use require() function can feature test                                                       // returned object for modules, and apply there own if missing. 
           if(needed < loaded.length){      
              console.log(this.messages.partialLoad);
           }

           return  makeModulesObject(deps, loaded); 
        }
   }
   
   modules._require = modulController.require.bind(modulController);// We want another refference to require 
                      // function in modules object, so modul programmers can dynamically -require- dependancies.                      // But for "this" constructs inside require function to work properly we bind them  
                      // to modulController object(that is where all properties, that function uses, are).  
                                 
   return publicAPI =  { 
      isDefined: modulController.isDefined.bind(modulController),
      define: modulController.define.bind(modulController),
      require: modulController.require.bind(modulController)
   }
 })()
   console.log("OK")
})()
   console.log("modulMenager.js loaded");
