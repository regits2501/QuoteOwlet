/* Defines utility functions and modules: 

 whenReady() - checks dom load event
 addEvent()  - adds event listener
 textContent() - set/get text content from element
 formEncode    - encodes to www-url-form-encoded mime type

*/ if (typeof _pS_.modulMgr === "object" && _pS_.modulMgr !== null) {
    var mgr = _pS_.modulMgr;
    mgr.define("whenReady", [], function whenReady() {
        // "name_of_a_modul_or_function", ["dependancy"], function (dependancy)
        // are arguments that define() takes.
        var ready = false;
        var funcs = [];
        function handler(ev) {
            if (ready) return;
            if (ev.type === "readystatechange" && document.readyState !== "complete") return;
            for(var i = 0; i < funcs.length; i++)funcs[i].call(document) // not sure why whould you envoke funs on documnet
            ;
            ready = true;
            funcs = null; // ready for garabge colection 
        }
        if (document.addEventListener) document.addEventListener("DOMContentLoaded", handler, false) // After all deffer-ed script finished
        ;
        else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", handler);
            window.attachEvent("onload", handler);
        }
        return function(fn) {
            if (ready) fn.call(document); // USE .apply(document, arguments)   wtf!
            else funcs.push(fn);
        };
    });
    mgr.define("addEvent", [], function addEvent(target, type, handler, flg) {
        var captOption = false; // for older browsers support, we always need a boolean value for this option
        if (flg) captOption = true;
        if (target.addEventListener) target.addEventListener(type, handler, captOption); // flg for setting the capturing event handler
        else if (target.attachEvent) {
            // element.
            target.attachEvent("on" + type, function handl1(event) {
                event = event || window.event; // for IE < 9
                return handler.call(target, event);
            });
            return handl; // when registering event handler in IE return wrapper handl so it can be removed
        // with removeEvent()
        }
    }, true);
    mgr.define("textContent", [], function textContent(element, value) {
        // two arguments = set text. 
        var text = element.textContent; // If its defined and doesnt have any character set 
        // it HAS an empty string ("") by default DOM setting.
        if (value === undefined) {
            if (text !== undefined) return text;
            else return element.innerText; // then it must mean that its an IE < 9, so return the innerText prop'.
        } else if (text !== undefined) element.textContent = value;
        else element.innerText = value;
    }, true);
    mgr.define("formEncode", [], function formEncode(dataObj, spaces) {
        var pairs = [];
        var value;
        var key;
        var type;
        for(var name in dataObj){
            type = typeof dataObj[name];
            if (dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null") {
                // in dataObj 
                key = encodeURIComponent(name); // encode property name
                if (type === 'object') {
                    value = formEncode(dataObj[name], spaces); // form encode object
                    value = encodeURIComponent(value) // since return value is string, uri encode it
                    ;
                } else value = encodeURIComponent(dataObj[name]) // property is not object, just uri encode it
                ;
                if (!spaces) {
                    key = key.replace(/%20/g, "+");
                    value = value.replace(/%20/g, "+"); // substitute space encoding for +
                }
                pairs.push(key + "=" + value);
            }
        }
        return pairs.join("&");
    }, true);
    mgr.define("percentEncode", [], function(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            // it follows RFC3986 and percent encodes
            // reserved characters in sqere brackets.
            return '%' + c.charCodeAt(0).toString(16); // takes binary representation of every reserved char
        // , coverts it to hex string char and appends to "%".
        });
    }, true);
    mgr.define("classList", [], function classList() {
        // It uses behaviour delegation pattern with private vars as
        // explained here -> https://stackoverflow.com/questions/32748078/variable-privacy-in-javascripts-behaviour-delegation-pattern/43476020#43476020
        var cssClassList = {};
        cssClassList.messages = {
            invalidClsName: "Class name invalid ",
            existClsName: "Class name already exist ",
            doesntExistClsname: "Class name doesn't exists "
        };
        cssClassList.init = function(e) {
            this.e = e;
        };
        cssClassList.contains = function(clsName, pocket) {
            // returns true or false
            if (clsName.length === 0 || clsName.indexOf(" ") != -1) throw new Error(this.messages.invalidClsName + " " + clsName);
            if (this.e.className === clsName) return true; // Return true if its exact match
            pocket.regexpS = new RegExp("\\b" + clsName + "\\b", "g"); // Search whole words only
            return pocket.regexpS.test(this.e.className);
        };
        cssClassList.add = function(clsName) {
            if (this.contains(clsName)) {
                console.log(this.messages.existClsName);
                return;
            }
            var clss = this.e.className;
            if (clss && clss[clss.lenght - 1] !== " ") clsName = " " + clsName; // append it in front of one we want to add.
            this.e.className += clsName;
        };
        cssClassList.remove = function(clsName, pocket) {
            pocket.regexpRm = new RegExp("\\b" + clsName + "\\b\\s*", "g") // For removal, whole words plus any
            ;
            //  trailing white space.
            console.log("to Remove: " + clsName);
            if (this.contains(clsName)) {
                this.e.className = this.e.className.replace(pocket.regexpRm, "");
                console.log(this.e.className);
            } else console.log(this.messages.desntExistClsName + " " + clsName);
        };
        cssClassList.toggle = function(clsName) {
            if (this.contains(clsName)) {
                this.remove(clsName);
                return false; // false is to notify "turn of"   
            } else {
                this.add(clsName); // doesn't exists so add it.
                return true;
            }
        };
        cssClassList.toString = function() {
            return this.e.className;
        };
        return function(e) {
            if (e.classList) return e.classList; // If there already is HTML5 classList support, just return it. 
            function attachPocket(cList) {
                var funcsForPocket = Array.prototype.slice.call(arguments, 1); // take arguments after cList
                var len = funcsForPocket.length;
                var pocket = {}; // object for placing private properties (not exposed directly to outside scopes
                var instance = Object.create(cList);
                for(var i = 0; i < len; i++)(function() {
                    var func = funcsForPocket[i];
                    instance[func] = function() {
                        var args = Array.prototype.slice.call(arguments);
                        args = args.concat([
                            pocket
                        ]); // append pocket to arguments
                        return cList[func].apply(this, args);
                    };
                })();
                instance.init(e);
                return instance;
            }
            return attachPocket(cssClassList, "contains", "remove");
        };
    });
    mgr.define('cssClassMgr', [
        'classList'
    ], function(classList) {
        var cssClassMgr = {}; // manipulates with css class names of an element
        cssClassMgr.initClass = function(element) {
            if (typeof element === "string") this.el = document.getElementsByClassName(element)[0];
            else this.el = element;
            this.cssList = classList(this.el); // Using classList, module that emulates HTML5 classList property
        };
        cssClassMgr.addClass = function(clsName) {
            this.cssList.add(clsName); // Adding css class name to the html element
        };
        cssClassMgr.removeClass = function(clsName) {
            this.cssList.remove(clsName);
        };
        cssClassMgr.toggleClass = function(clsName) {
            this.cssList.toggle(clsName);
        };
        cssClassMgr.toString = function() {
            return this.cssList.toString();
        };
        return function() {
            return inst = Object.create(cssClassMgr);
        };
    });
    mgr.define('cssEventMgr', [
        'cssClassMgr',
        'addEvent'
    ], function(cssClassMgr, addEvent) {
        var cssEventMgr = Object.create(cssClassMgr()); // (link to the cssClassMgr Object)
        cssEventMgr.initEvent = function(className, classToManage, eventDesc) {
            // on events
            this.element = document.getElementsByClassName(className)[0] // gets element with css selector specified
            ;
            this.initClass(this.element); // Initiate element's css class menager
            var evt, action, delay; // delay we want to pass before managing css class
            for(var i = 0; i < eventDesc.events.length; i++){
                evtType = eventDesc.events[i];
                action = eventDesc.actions[i];
                console.log("evtType:" + evtType);
                delay = eventDesc.delays ? eventDesc.delays[i] : "";
                addEvent(this.element, evtType, this[action].bind(this, classToManage, delay));
            }
        };
        cssEventMgr.add = function(classToAdd, delay) {
            if (delay) setTimeout(function() {
                this.elementCss.addClass(classToAdd);
            }, delay);
            this.addClass(classToAdd);
        };
        cssEventMgr.remove = function(classToRemove, delay) {
            if (delay) setTimeout(function() {
                this.elementCss.removeClass(classToRemove);
            }, delay);
            this.removeClass(classToRemove);
        };
        return function() {
            return Object.create(cssEventMgr);
        };
    });
    mgr.define("styleRulesMgr", [], function() {
        var styleRulesUtils = {}; // object use css selector syntax to find rules
        styleRulesUtils.findRule = function(ruleName) {
            // has bugs when ivoking this line before domContentLoaded event
            this.rules = this.styleSheet.cssRules ? this.styleSheet.cssRules : this.styleSheet.rules; // IE has
            //  "rules"
            var len = this.rules.length;
            for(var i = 0; i < len; i++){
                if (this.rules[i].selectorText === ruleName) return this.rules[i];
            }
        };
        var styleRules = Object.create(styleRulesUtils);
        styleRules.messages = {
            provideRuleName: "You must provide a rule name when calling this function.",
            invalidRuleName: "Rule name is invalid",
            ruleDoesntExist: "Rule doesn't exist"
        };
        styleRules.returnRuleOrPrintMsg = function(ruleName, msg) {
            // returns rule.
            var rule = this.contains(ruleName);
            if (!rule) throw new Error(msg + ": " + ruleName);
            return rule;
        };
        styleRules.initStyleSheet = function(styleSheet) {
            this.styleSheet = styleSheet || document.styleSheets[0]; // Use passed or first stylesheet in doc.
        };
        styleRules.contains = function(ruleName) {
            if (ruleName.length === 0) throw new Error(this.messages.provideRuleName);
            return this.findRule(ruleName); // returns style object or undefined
        };
        styleRules.addStyle = function(ruleName, cssPropName, propValue) {
            var rule = this.returnRuleOrPrintMsg(ruleName, this.messages.ruleDoesntExist);
            if (rule) rule.style[cssPropName] = propValue; // set provided css property and value for that rule  
        };
        styleRules.removeStyle = function(ruleName, cssPropName) {
            var rule = this.returnRuleOrPrintMsg(ruleName, this.messages.ruleDoesntExist);
            if (rule) rule.style[cssPropName] = "";
            console.log("" + rule.selectorText + "[" + cssPropName + "]=" + rule[cssPropName]);
        };
        return function() {
            return Object.create(styleRules);
        };
    });
    mgr.define("addPrefixedAnimationEvent", [
        "addEvent"
    ], function(addEvent, element, type, handler, flg) {
        // this function expects CamelCased animation type 
        // values like: "AnimationStart".
        var pref = [
            "",
            "moz",
            "webkit",
            "o",
            "MS"
        ]; // prefixes
        var len = pref.length;
        for(var i = 0; i < len; i++){
            if (!pref[i]) type = type.toLowerCase(); // when prefix is "" toLowerCase the event type.
            addEvent(element, type, handler, flg);
        }
    }, true);
    mgr.define("request", [
        "formEncode"
    ], function(formEncode) {
        var request = {};
        request.messages = {
            cbAlreadyCalled: "Callback function has already been called.",
            cbWasNotCalled: "Calback function provided was not called.",
            urlNotSet: "You must provide url for the reqest you make.",
            callbackNotProvided: "Callback function was not provided.",
            encodingNotSupported: "Encoding you provided is not supported"
        };
        request.initRequest = function(args) {
            //  url, queryParams, callback, httpMethod, body, beforeSend
            this.request = this.createRequest(); // Creates XMLHttpRequest object
            this.temp; // Temporary place holder
            for(var prop in args){
                temp = args[prop];
                switch(prop){
                    case "url":
                        this.setUrl(temp); // sets the reqest url
                        break;
                    case "queryParams":
                        this.setQuery(temp); // Makes query string for url
                        break;
                    case "callback":
                        this.addListener(temp); // Adds listener for succesful data retrieval and invokes callback
                        break;
                    case "method":
                        this.method = temp.toUpperCase() || "GET" // request method
                        ;
                        break;
                    case "body":
                        console.log("has DATA");
                        this.body = temp; // add body for request
                        break;
                    case "parse":
                        this.parse = temp;
                        break;
                    case "encoding":
                        this.encoding = temp;
                    case "beforeSend":
                        this.beforeSend = temp // For instance, if we need to set additonal request specific headers 
                        ;
                        break;
                }
            }
            if (!this.url) throw new Error(this.messages.urlNotSet); // Throw error if url was not provided in args
            if (!this.method) this.method = "GET"; // Defaults to "GET" method if one was not provided in args object
            if (!this.request.onreadystatechange) throw new Error(this.messages.callbackNotProvided); // cb missing
            console.log(args);
            this.sendRequest(); // Makes the actual http request
        };
        request.createRequest = function() {
            try {
                return new XMLHttpRequest(); // standard
            } catch (e) {
                console.log(e);
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP"); // IE specific ...
                } catch (e) {
                    return new ActiveXObject("Msxml12.XMLHTTP");
                }
            }
        };
        request.setUrl = function(url) {
            if (!this.url) this.url = url;
            else this.url = url + this.url; // if setQueryParams() run before set url, we already have query string
        //  in "this.url". So "url" needs to go first.
        };
        request.setQuery = function(queryParams) {
            this.queryString = formEncode(queryParams); // Function uses form-url-encoded scheme to return query string
            if (this.url.indexOf("?") === -1) this.url += "?"; // if doesnt have query delimiter add it. 
            this.url += this.queryString; // Adds query string to url 
        };
        request.addListener = function(callback) {
            var alreadyCalled = false;
            this.request.onreadystatechange = (function() {
                if (this.request.readyState === 4 && this.request.status === 200) {
                    if (alreadyCalled) {
                        console.log(this.messages.cbAlreadyCalled);
                        return;
                    } else alreadyCalled = true;
                    var type = this.request.getResponseHeader("Content-type"); // Get the response's content type
                    switch(type){
                        case "application/json":
                            try {
                                if (this.parse) callback(JSON.parse(data)); // parse json data and send it as argument
                                else callback(data);
                            } catch (e) {
                                console.log(this.messages.cbWasNotCalled + " \n" + e); // if parsing failed note it
                            }
                            break;
                        case "application/xml":
                            callback(this.request.responseXML); // responceXML already parsed as a DOM object
                            break;
                        default:
                            callback(this.request.responseText); // text/html , text/css and others are treated as text
                    }
                }
            }).bind(this); // Async functions lose -this- context because they start executing when functions that 
        // invoked them already finished their execution. Here we pass whatever "this" references 
        // in the moment addListener() is invoked. Meaning, "this" will repesent each 
        // instance of request, see return function below. 
        };
        request.setHeader = function(header, value) {
            this.request.setRequestHeader(header, value);
        };
        request.setBody = function() {
            console.log("In setBody");
            if (this.body) {
                if (!this.encoding) this.setHeader("Content-Type", "text/plain"); // default to text, set the content type (was formEnc)
                else switch(this.encoding.toLowerCase()){
                    case "form":
                        this.body = formEncode(this.body) // encode the body
                        ;
                        this.setHeader("Content-Type", "application/x-www-url-formencoded"); // set header
                        break;
                    case "json":
                        this.body = JSON.stringify(this.body);
                        this.setHeader("Content-Type", "application/json");
                    case "text":
                        this.setHeader("Content-Type", 'text/plain');
                        break;
                    default:
                        throw new Error(this.messages.encodingNotSupported);
                }
            } else this.body.data = null; // set the body to null
        };
        request.sendRequest = function() {
            if (this.request.readyState == "0") this.request.open(this.method, this.url); // "0" means open() not called
            if (this.beforeSend) this.beforeSend(this.request) // if user supplied beforeSend() func, call it.
            ;
            console.log("This before setBody!", "req state:" + this.request.readyState);
            if (this.body) this.setBody();
            else if (this.method === "POST") this.body = null; // set it to 'null' if there is no body and method 
            //is POST. This is just xmlhttp request spec.
            if (this.method === "GET") this.request.send(null);
            if (this.method === "POST") this.request.send(this.body);
        };
        return function(args) {
            var r = Object.create(request); // behavior delegation link
            if (args) r.initRequest(args); // Initialise request and sends it, if args are provided
            else // an instance of request API (here it is "r").
            return phantomHead = {
                initRequest: r.initRequest.bind(r) // "borrow" method from instance, bind it to instance
            };
        };
    });
}

//# sourceMappingURL=index.e718ce74.js.map
