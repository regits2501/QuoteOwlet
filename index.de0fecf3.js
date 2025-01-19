if (!this._pS_ && !this.hasOwnProperty("_pS_")) {
    // _pS_ propertie  and that _pS_ doesnt have a value assotiated. 
    // eqvivalent to :
    // if(typeof _pS_ == undefined && !window.hasOwnProperty("_pS_"))
    this._pS_ = {};
    console.log("Initiated -  global object.");
}
(function() {
    if (!_pS_ && _pS_ == null) console.log("_pS_ (protoScope) object doesnt exists."); // emit message if _pS_ 
    else if (typeof _pS_ == "object") _pS_.modulMgr = function() {
        var modules = {};
        var modulController = {
            modules: {},
            messages: {
                prefix: "notDefined ",
                notDefined: "Not defined: ",
                requirementFails: "Requirement fails.",
                requirementNotInArray: "Requirement must be passed as element of an array. Try again.",
                modulDefinitionFails: "Modul definition fails.",
                funcDefinitonFails: "Function definition fails.",
                partialLoad: "Some dependancies have not been loaded. Check returned object's properties."
            },
            isDefined: function isDefined(dep) {
                var dpn = modules[dep];
                if (dpn && (typeof dpn == "object" || typeof dpn == "function")) return true;
                else return false;
            },
            showNotDefined: function notDefined(dep) {
                console.log(this.messages.notDefined + dep);
            },
            markNotDefined: function markNotDefined(deps, idx) {
                deps[idx] = this.messages.prefix + deps[idx]; // put prefix "notDefined" in front of name of 
            // missing dependency
            },
            unmarkNotDefined: function unmarkNotDefined(marked) {
                var nomark = marked.substr(this.messages.prefix.length);
                return nomark;
            },
            loadDeps: function loadDeps(deps, skipMissing) {
                var loaded = [];
                if (skipMissing === undefined) skipMissing = false; // default is not to skip any missing dep'. 
                for(var i = 0; i < deps.length; i++){
                    if (this.isDefined(deps[i])) loaded.push(modules[[
                        deps[i]
                    ]]);
                    else if (!skipMissing) {
                        this.showNotDefined(deps[i]); // emit which one is not defined(missing).
                        return false;
                    } else this.markNotDefined(deps, i);
                }
                return loaded;
            },
            define: function define(name, deps, func, asFunction) {
                if (asFunction === "undefined") asFunction = false; // default is to define it as a module
                var depsRdy = this.loadDeps(deps); // depsRdy can have one of 3 values. Array with elements ,
                // empty array or boolean value false.
                if (!asFunction) this.asModule(name, depsRdy, func);
                else this.asFunction(name, depsRdy, func);
            },
            hasLoadedAny: function hesLoadedAny(depsRdy) {
                if (depsRdy.length == 0) return undefined; // If we have array with no elements (like when 
                else return depsRdy;
            },
            asFunction: function(name, depsRdy, func) {
                //function, that's what asFunction() serves for.
                if (depsRdy.length > 0) modules[name] = function() {
                    // So if function has a "this" reference inside own
                    var args = Array.prototype.slice.call(arguments); // definition then that  function should be
                    // passed as part of public API of module 
                    // pattern. That is, created as a modul.
                    return func.apply(func, depsRdy.concat(args)); // Put dependencies first then arguments     
                };
                else if (depsRdy.length === 0) modules[name] = function() {
                    return func.apply(func, arguments);
                };
                else console.log(this.messages.funcDefinitionFails);
            },
            asModule: function(name, depsRdy, func) {
                depsRdy = this.hasLoadedAny(depsRdy); // returns undefined if there was no dependency
                if (depsRdy !== false) modules[name] = func.apply(func, depsRdy);
                else console.log(this.messages.moduleDefinitionFails);
            },
            makeModulesObject: function(deps, loadedDeps) {
                var modulesObj = {};
                var missCount = 0;
                for(var j = 0; j < deps.length; j++){
                    // loadedDeps will be in j-missCount index place. 
                    var matched; // Simple hack for doing everything in one loop.
                    if (!deps[j].match("notDefined")) modulesObj[deps[j]] = loadedDeps[j - missCount]; // deps[j] is dependancy name and right
                    else {
                        modulesObj[this.unmarkNotDefined(deps[j])] = undefined; // if dependancy doesn't exist set
                        // value of undefined. Remove 
                        // prefix from dependancy name.
                        missCount++;
                    }
                }
                return modulesObj;
            },
            require: function require(deps) {
                // to dynamically call dependencies or trough "_pS_.modulMgr"
                // refference.
                if (typeof deps === "string") {
                    console.log(this.messages.requirementNotInArray);
                    return;
                }
                var needed = deps.length;
                var loaded = this.loadDeps(deps, true); // Load dependencies, but skipp any missing. 
                // So modules that use require() function can feature test                                              // returned object for modules, and apply there own if missing. 
                if (loaded === false) {
                    console.log(this.messages.requirementFails);
                    return;
                } else return this.makeModulesObject(deps, loaded);
            }
        };
        modules._require = modulController.require.bind(modulController);
        // We want another refference to the require() 
        // function in modules object, so modul programmers can dynamically -require-
        // dependancies. But for "this" constructs inside require function to work properly
        //  we bind function to modulController object(that is where all properties, that 
        // function uses are).
        _pS_.hook = {} // Here we are defining a hook object that some asynchronous funtions require. 
        ;
        // Like in JSONP modul implementation (see getJSONPcontroller.js). 
        return publicAPI = {
            isDefined: modulController.isDefined.bind(modulController),
            define: modulController.define.bind(modulController),
            require: modulController.require.bind(modulController)
        };
    }();
// SET modulMgr object writable FALSE
})();
console.log("modulMenager.js loaded");

//# sourceMappingURL=index.de0fecf3.js.map
