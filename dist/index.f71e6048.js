// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"h81tc":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "c26ef22bf71e6048";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && ![
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
    ].includes(hostname) ? 'wss' : 'ws';
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        disposedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === 'reload') fullReload();
        else if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
                await hmrApplyUpdates(assets);
                hmrDisposeQueue();
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                let processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ('reload' in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"8VGZO":[function(require,module,exports,__globalThis) {
// add twiz-client to global scope
var _twizClientBundleJs = require("./twiz-client_bundle.js");
(function() {
    if (typeof _pS_ === "object" && _pS_ !== null) _pS_.quotes = [];
    var require1 = _pS_.modulMgr.require; // getting the "require" function so we can use it to add modules we need
    var request = require1([
        "request"
    ]).request; // importing xmlhttp request API
    var textContent = require1([
        "textContent"
    ]).textContent;
    var whenPageReady = require1([
        "whenReady"
    ]).whenReady;
    var addEvent = require1([
        "addEvent"
    ]).addEvent;
    var cssClassMgr = require1([
        'cssClassMgr'
    ]).cssClassMgr(); // adds, removes css classes for an element
    var cssEventMgr = require1([
        'cssEventMgr'
    ]).cssEventMgr;
    var styleRulesMgr = require1([
        "styleRulesMgr"
    ]).styleRulesMgr;
    var addPrefAnimEvent = require1([
        "addPrefixedAnimationEvent"
    ]).addPrefixedAnimationEvent;
    var byteLength = require1([
        "byteLength"
    ]).byteLength;
    var quoter = {}; // Object that handles getting data from server and showing it on page
    whenPageReady(function addTwitterUserName() {
        var sessionData = twizClient().getSessionData(); // get sessiondata fomr redirection url, if any
        var user = document.createElement('div');
        var userName = sessionData ? sessionData.userName : 'guest' // userName from twiz-client session data 
        ;
        // or put 'guest'        
        user.setAttribute('class', 'user'); // add style - attach '.user' class from stylesheet
        user.innerText = userName;
        document.body.insertBefore(user, document.querySelector('.quoteCont')) // add element before quote container
        ;
    });
    //// no owlet flying animation on redirections /////
    var leftWing = Object.create(cssClassMgr);
    var rightWing = Object.create(cssClassMgr);
    var owlet = Object.create(cssClassMgr);
    var mainStyleSheet = styleRulesMgr(); // Instance of object that handles css rules of a style sheet 
    whenPageReady(function removeOwletsAnimation() {
        if (!twizClient().getSessionData()) return; // not redirection urls 
        // css style sheet. It uses css selector sintax to select rules.
        mainStyleSheet.initStyleSheet(); // initiate style sheet contenxt
        leftWing.initClass("left"); // Elements that have "left" and "right" class names
        rightWing.initClass("right");
        owlet.initClass('owletCont');
        leftWing.removeClass('lwAnimation') // remove left wing wing animations
        ;
        leftWing.addClass('wingsRedir') // add css for redirection pages (wings position not for flight)
        ;
        rightWing.removeClass('rwAnimation'); // remove right wing wing animations
        rightWing.addClass('wingsRedir'); //  add css for redirection pages (wings position not for flight) 
        owlet.removeClass('owletCont') // removes 'page glide' animation in cross browser way
        ;
        owlet.addClass('owletContRedir') // add just css with no page glide animation
        ;
    });
    quoter.messages = {
        noQuoteInArray: "There is no quote in array."
    };
    /* https://thingproxy.freeboard.io/fetch/ is the forward proxy we use to avoid 
    "mixed content" loading since api.forismatic.com doesnt support https.     
   */ quoter.url = "https://quote-owlet-twiz-server-1.onrender.com/proxy/fetch/https://zenquotes.io/api/random"; // server url
    quoter.queryParams = {
        method: 'getQuote',
        format: 'text',
        key: 0,
        lang: 'en'
    };
    quoter.callback = function(data) {
        let parsedData = JSON.parse(data);
        let quote = parsedData[0]; // get quote object
        _pS_.quotes.push(quote); // We are putting server data into quotes array
    // which is a propertie of _pS_ global var.
    };
    quoter.getQuote = (function(thisMany) {
        // data in "quotes" array. 
        this.setQuoteKey(); // Generates random quote key
        thisMany = thisMany || 1; // Defaults to 1, if it's negative it doesnt get any quote, see loop.
        for(thisMany; thisMany > 0; thisMany--)request({
            "url": this.url,
            "queryParams": this.queryParams,
            "callback": this.callback
        }); // uses
    }).bind(quoter);
    quoter.setQuotePlace = function() {
        quoter.textPlace = document.getElementsByClassName("showQuote")[0]; // html element to put quote text 
        // into.
        quoter.authorPlace = document.getElementsByClassName("showAuthor")[0];
    };
    quoter.showQuote = (function() {
        let quotes = _pS_.quotes;
        let quoteText = "They sasy the owlet brings wisdom";
        let quoteAuthor = "Trough random quotes";
        if (quotes.length !== 0) {
            let quote = quotes.pop();
            quoteText = quote.q;
            quoteAuthor = quote.a;
        } else {
            console.log(this.messages.noQuoteInArray);
            return;
        }
        textContent(this.textPlace, quoteText);
        textContent(this.authorPlace, quoteAuthor);
    }).bind(quoter);
    quoter.setQuoteKey = (function() {
        var value = Math.round(Math.random() * 100000);
        this.queryParams.key = value;
    }).bind(quoter);
    quoter.showAndGetQuote = (function() {
        this.showQuote(); // show quote data on page
        this.getQuote();
    }).bind(quoter);
    quoter.chooseTriggerElement = function(el) {
        // owlet (div) element to which we attach onclick handler later.
        quoter.triggerElement = document.querySelectorAll(el)[0];
    };
    quoter.setQuoteTrigger = (function(eventType, handler) {
        addEvent(this.triggerElement, eventType, handler); // adds showQuoteData as onclick 
    // event handler function, to triggerElement
    // we chose.
    }).bind(quoter);
    quoter.getQuote() // Requesting quote data from server, also doesn't need DOM to be loaded. Preloads one quote.
    ;
    whenPageReady(quoter.setQuotePlace); // Selecting html elements for placing quote data into. Needs DOM tree.ggg
    whenPageReady(quoter.chooseTriggerElement.bind(null, ".owlet")); // This function uses CSS selector syntax
    // to select html element.
    whenPageReady(quoter.setQuoteTrigger.bind(null, "click", quoter.showAndGetQuote)); // When page is loaded,
    // set "clicking the owlet"
    // to be event that triggers
    // display of quote data on page
    ////////////// wingRadiate animation (on click event) /////////////////////////
    var owletCssClass = Object.create(cssClassMgr); // Instance of an object that manipulates with elements
    // css class names.
    function changeOwletsCssOnClick() {
        owletCssClass.initClass("owlet"); // setting element that has css class name 'owlet'
        addEvent(owletCssClass.el, "mousedown", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
        addEvent(owletCssClass.el, "mouseup", function() {
            setTimeout(function() {
                owletCssClass.toggleClass.call(owletCssClass, "quoteClickRadiate");
            }, 350);
        });
        addEvent(owletCssClass.el, "touchstart", owletCssClass.addClass.bind(owletCssClass, "quoteClickRadiate"));
    }
    whenPageReady(changeOwletsCssOnClick); // when dom ready set click event handler on element with class "owlet".
    ////////// left and right wings animation fix (cross browser)////////
    function removeWingAnimationsOnEnd() {
        // and wingRadiate, after last animation(wingRadiate) in sequence ends.
        // All in order to correct animation bugs across browsers.
        mainStyleSheet.initStyleSheet(); // If no argument it defaults to first stylesheet for document
        leftWing.initClass("left"); // Elements that have "left" and "right" class names
        rightWing.initClass("right");
        addPrefAnimEvent(leftWing.el, "AnimationEnd", function(handle) {
            setTimeout(function() {
                if (handle.animationName === "wingRadiate") {
                    mainStyleSheet.addStyle(".left", "line-height", "1.3em");
                    leftWing.removeClass.call(leftWing, "lwAnimation"); // "lwAnimation" is css class name 
                }
            }, 100) // responsible for all 3 animations
            ;
        });
        addPrefAnimEvent(rightWing.el, "animationend", function(handle) {
            setTimeout(function() {
                if (handle.animationName === "wingRadiate") {
                    mainStyleSheet.addStyle(".right", "line-height", "1.3em");
                    rightWing.removeClass.call(rightWing, "rwAnimation");
                }
            }, 100);
        });
    }
    whenPageReady(removeWingAnimationsOnEnd);
    var sheetRules = styleRulesMgr();
    sheetRules.initStyleSheet(); // initialize style sheet of this document;
    /////////////// chrome mobile fix  /////////////////////
    var chromeCssBugFix = {}; // fix the css bug on chrome mobile
    chromeCssBugFix.checkChromeMob = function() {
        var browser = window.navigator.userAgent;
        this.chrome = /Chrome/g.test(browser);
        this.mobile = /Mobi/g.test(browser);
    };
    chromeCssBugFix.fixIt = (function() {
        this.checkChromeMob(); // checking for chrome for mobile
        if (!this.chrome || !this.mobile) return; // dont apply fix if it's other browser
        var chroMobEl = document.getElementsByClassName("chroMob")[0];
        this.dispatchFix();
    }).bind(chromeCssBugFix);
    chromeCssBugFix.dispatchFix = function() {
        var htmlEl = document.getElementsByTagName("html"); // get html element
        var running = false;
        function adjustHeight() {
            if (running) return; // if we've already called abjustHeight and it didnt finish executing, then return
            running = true;
            setTimeout(function() {
                requestAnimationFrame(function() {
                    // 160 ms has passed
                    mainStyleSheet.addStyle("html", "min-height", window.innerHeight.toString() + "px") // adjust height
                    ;
                    // of element. "html" has white
                    // border, it requires repaint.
                    running = false;
                });
            }, 160);
        }
        addEvent(window, "resize", adjustHeight);
    };
    whenPageReady(chromeCssBugFix.fixIt);
    ////////////////// twitter button animation //////////////////////////////
    var cssEvents = cssEventMgr();
    var xButton = Object.create(cssEvents);
    whenPageReady(xButton.initEvent.bind(xButton, "xButton", "logoOnClick", {
        "events": [
            "mousedown",
            "mouseup",
            "touchstart",
            "touchmove"
        ],
        "actions": [
            "add",
            "remove",
            "add",
            "remove"
        ]
    }));
    /////////////// twitter OAuth (for SPA cases) //////
    var quoteData = {};
    quoteData.getQuoteElements = function() {
        this.quoteEl = document.querySelectorAll('.showQuote')[0]; // get element
        this.authorEl = document.querySelectorAll('.showAuthor')[0];
    };
    whenPageReady(quoteData.getQuoteElements.bind(quoteData)) // when page is ready sellect the quote elements
    ;
    quoteData.setQuoteData = function(sessionData) {
        console.log("sessionData ====== ", sessionData);
        if (sessionData) {
            textContent(this.quoteEl, sessionData.quote);
            textContent(this.authorEl, sessionData.author);
        }
    };
    function oauth() {
        console.log("Taking this data: ====", textContent(quoteData.quoteEl), textContent(quoteData.authorEl));
        var options = {
            server_url: 'https://quote-owlet-twiz-server-1.onrender.com',
            redirection_url: "https://regits2501.github.io/QuoteOwlet/",
            session_data: {
                quotor: textContent(quoteData.quoteEl),
                author: textContent(quoteData.authorEl),
                userName: textContent(document.querySelector('.user'))
            },
            options: {
                method: 'POST',
                path: '/2/tweets',
                body: {
                    text: '\"' + textContent(document.querySelector('.showQuote')) + '\"' + '\n ~ ' + textContent(document.querySelector('.showAuthor'))
                },
                encoding: 'json'
            },
            callback: function(o) {
                if (o.error) console.log('error (callback_func): ', o.error);
                if (o.data) console.log('data in callback_func: ', o.data);
                if (o.window) console.log('in callback_func has Window: ', o.window);
                window.temp = o.token.oauth_token;
            },
            endpoints: {
                authorize: 'authenticate'
            }
        };
        var twiz = twizClient();
        var p = twiz.OAuth(options);
        if (p) p.then(function onFulfilled(w) {
            console.log('in promise (main.js)');
            if (w.redirection) {
                console.log('no token on server: Redirection');
                return;
            }
            console.log("Promised: ", w);
        });
    }
    function Authenticate() {
        addEvent(document.getElementsByClassName("xButton")[0], "click", oauth);
    }
    whenPageReady(Authenticate);
    whenPageReady(function() {
        var twtSecondPart = twizClient();
        var sessionData = twtSecondPart.getSessionData();
        quoteData.setQuoteData.apply(quoteData, [
            sessionData
        ]);
        console.log("ACCESS twitter ===================");
        var options = {
            server_url: 'https://quote-owlet-twiz-server-1.onrender.com',
            options: {
                method: "POST",
                path: '/2/tweets',
                body: {
                    text: "New post on X!"
                },
                encoding: 'json'
            }
        };
        try {
            var p = twtSecondPart.finishOAuth(options); // pass arguments 
            // (needed just server url and options)
            if (p) p.then(function(o) {
                if (o.error) {
                    console.log("error in promise: ", o.error);
                    xButtonEpilog('tweetFailed'); // add css animation for failure to btn 
                }
                if (o.data) {
                    console.log("data in promise:", o.data);
                    xButtonEpilog('tweetOk'); // add css animation for success to btn
                    setUserName(o.data.user.name);
                }
            }).catch(function(e) {
                console.log('error in promise (failure):', e);
            });
        } catch (e) {
            console.log('error in try-catch: ', e);
        }
    });
    var xButtonEpilog = function(selector) {
        var btn = Object.create(cssClassMgr);
        btn.initClass('xButton');
        btn.addClass(selector); // adds tweet Ok or tweet failure animation to btn
        var btnEl = document.getElementsByClassName('xButton')[0];
        btnEl.removeEventListener('click', oauth, false); // remove oauth on click while animation lasts
        setTimeout(function() {
            btn.removeClass(selector); // remove animation
            addEvent(btnEl, 'click', oauth); // bring back oauth
        // on animation end
        }, 3201) // 2201 is on track with css animation timings (see css)
        ;
    };
    var setUserName = function(name) {
        textContent(document.querySelector('.user'), name); // set user name as text of the user element
    };
})();
console.log("main loaded");

},{"./twiz-client_bundle.js":"fXRIo"}],"fXRIo":[function(require,module,exports,__globalThis) {
(function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = undefined;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function(r) {
                    var n = e[i][1][r];
                    return o(n || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for(var u = undefined, i = 0; i < t.length; i++)o(t[i]);
        return o;
    }
    return r;
})()({
    1: [
        function(require, module, exports) {
            var OAuth = require('twiz-client-oauth');
            var deliverData = require('twiz-client-redirect').prototype.deliverData;
            function AccessToken() {
                // Checks that oauth data is in redirection(callback) url, and makes sure
                // that oauth_token from url matches the one we saved in first step. 
                OAuth.call(this);
                this.name = this.leg[2];
                this.redirectionUrlParsed; // redirection(callback) url parsing status
                this.redirectionData; // parsed data from redirection url
                this.loadedRequestToken; // place to load token 
                this.authorized; // redirection data that was autorized; 
                this.winLoc = window.location.href; // get current url
                this.addCustomErrors({
                    verifierNotFound: '"oauth_verifier" string was not found in redirection(callback) url.',
                    tokenNotFound: '"oauth_token" string was not found in redirection(callback) url.',
                    tokenMissmatch: 'Request token and token from redirection(callback) url do not match',
                    requestTokenNotSet: 'Request token was not set',
                    requestTokenNotSaved: 'Request token was not saved. Check that page url from which you make request match your redirection_url.',
                    noRepeat: "Cannot make another request with same redirection(callback) url",
                    urlNotFound: "Current window location (url) not found",
                    noSessionData: 'Unable to find session data in current url',
                    spaWarning: 'Authorization data not found in url'
                });
            }
            AccessToken.prototype = Object.create(OAuth.prototype);
            AccessToken.prototype.setAuthorizedTokens = function() {
                this.parseRedirectionUrl(this.winLoc); // parse url 
                /* istanbul ignore else */ if (this.isAuthorizationDataInURL()) {
                    this.authorize(this.redirectionData); // authorize token
                    // set params for access token leg explicitly 
                    this.oauth[this.prefix + 'verifier'] = this.authorized.oauth_verifier // Put authorized verifier
                    ;
                    this.oauth[this.prefix + 'token'] = this.authorized.oauth_token; // Authorized token
                }
            };
            AccessToken.prototype.parseRedirectionUrl = function(url) {
                // console.log('in parseRedirectionUrl');
                var str = this.parse(url, /\?/g, /#/g); // parses query string
                this.redirectionData = this.parseQueryParams(str); // parse parameters from query string
                this.redirectionUrlParsed = true; // indicate that the url was already parsed  
            // console.log('redirectionData: >>', this.redirectionData);
            };
            AccessToken.prototype.parse = function(str, delimiter1, delimiter2) {
                if (!str) throw this.CustomError('urlNotFound');
                var start = str.search(delimiter1); // calculate from which index to take 
                var end;
                if (!delimiter2 || str.search(delimiter2) === -1) end = str.length; // if del2 was not passed as argument
                else end = str.search(delimiter2); // calcualte to which index to take                                                             
                // console.log(str); 
                return str.substring(start, end); // return substring
            };
            AccessToken.prototype.parseQueryParams = function(str) {
                var arr = [];
                if (str[0] === "?") str = str.substring(1); // remove "?" if we have one at beggining
                arr = str.split('&') // make new array element on each "&" 
                .map(function(el) {
                    var arr2 = el.split("="); // for each element make new array element on each "=" 
                    return arr2;
                });
                // console.log(arr);
                return this.objectify(arr); // makes an object from query string parametars
            };
            AccessToken.prototype.objectify = function(array) {
                // elements
                var data = {};
                var len = array.length;
                for(var i = 0; i < len; i++){
                    var arr = array[i];
                    for(var j = 0; j < arr.length; j++)if (j == 0) data[arr[j]] = arr[j + 1]; // if we are at element that holds name of property, 
                }
                return data;
            };
            // 
            AccessToken.prototype.isAuthorizationDataInURL = function() {
                if (!this.redirectionData.oauth_token && !this.redirectionData.oauth_verifier) throw this.CustomError('spaWarning');
                else return true;
            };
            AccessToken.prototype.authorize = function(sent) {
                //console.log('in authorize');
                if (this.isRequestTokenUsed(window.localStorage)) throw this.CustomError('noRepeat');
                if (!sent.oauth_verifier) throw this.CustomError('verifierNotFound');
                if (!sent.oauth_token) throw this.CustomError('tokenNotFound');
                this.loadRequestToken(window.localStorage, sent); // load token from storage  
                // check that tokens match
                if (sent.oauth_token !== this.loadedRequestToken) throw this.CustomError('tokenMissmatch');
                return this.authorized = sent; // data passed checks, so its authorized;                     
            };
            AccessToken.prototype.isRequestTokenUsed = function(storage) {
                if (storage.requestToken_ === "null") return true; // token whould be "null" only when  loadRequestToken() 
                // runs twice on same redirection(callback) url
                return false;
            };
            AccessToken.prototype.loadRequestToken = function(storage) {
                if (!storage.hasOwnProperty('requestToken_')) throw this.CustomError('requestTokenNotSaved');
                this.loadedRequestToken = storage.requestToken_; // load token from storage
                // console.log('storage after: ', storage.requestToken_);
                // console.log('this.loadedRequestToken :', this.loadedRequestToken);
                storage.requestToken_ = null; // since we've loaded the token, mark it as 
                // used/erased with null 
                // console.log('after erasing storage.requestToken :', storage.requestToken_);  
                // console.log('loadedRequestToken',this.loadedRequestToken);
                if (!this.loadedRequestToken) throw this.CustomError('requestTokenNotSet');
            };
            AccessToken.prototype.getSessionData = function() {
                //  console.log('in getSessionData')
                if (!this.redirectionUrlParsed) this.parseRedirectionUrl(window.location.href); // parse data from url 
                if (!this.redirectionData.data) {
                    console.warn(this.messages['noSessionData']);
                    return;
                }
                this.sessionData = this.parseSessionData(this.redirectionData.data) // further parsing of session data
                ;
                //console.log('sessionData: ',this.sessionData);
                return this.sessionData;
            };
            AccessToken.prototype.parseSessionData = function(str) {
                if (/%[0-9A-Z][0-9A-Z]/g.test(str)) str = decodeURIComponent(decodeURIComponent(str)); // Decoding twice, since it was encoded twice
                // (by OAuth 1.0a specification). See genSBS function.
                return this.parseQueryParams(str); // Making an object from parsed key/values.
            };
            AccessToken.prototype.deliverData = deliverData; // borrow function from Redirect module
            module.exports = AccessToken;
        },
        {
            "twiz-client-oauth": 2,
            "twiz-client-redirect": 4
        }
    ],
    2: [
        function(require, module, exports) {
            var Options = require('twiz-client-options');
            var percentEncode = require('twiz-client-utils').percentEncode;
            var formEncode = require('twiz-client-utils').formEncode;
            var btoa = window.btoa // use browser's btoa 
            ;
            function OAuth() {
                Options.call(this);
                this.leadPrefix = "OAuth " // leading string afther all key-value pairs go. Notice space at the end. 
                ;
                this.prefix = "oauth_"; // Prefix for each oauth key in a http request
                this.oauth = {} // Holds parameters that are used to generate SBS and AH
                ;
                this.oauth[this.prefix + 'consumer_key'] = ""; // This is very sensitive data. Server sets the value.
                this.oauth[this.prefix + 'signature'] = ""; // This value is also inserted in server code.
                this.oauth[this.prefix + 'nonce'] = ""; // Session id, twitter api uses this to determines duplicates
                this.oauth[this.prefix + 'signature_method'] = ""; // Signature method we are using
                this.oauth[this.prefix + 'timestamp'] = ""; // Unix epoch timestamp
                this.oauth[this.prefix + 'version'] = "" // all request use ver 1.0
                ;
                this[this.leg[0]] = {}; // oauth param for request token step
                this[this.leg[0]][this.prefix + 'callback'] = ''; // User is return to this link, 
                // if approval is confirmed   
                // this[this.leg[1]] = {}                     // there is no oauth params for authorize step. request_token                                                    // is sent as redirection url query parameter.
                this[this.leg[2]] = {} // oauth params for access token step
                ;
                this[this.leg[2]][this.prefix + 'token'] = '';
                this[this.leg[2]][this.prefix + 'verifier'] = '';
                this.apiCall = {};
                this.apiCall[this.prefix + 'token'] = ''; // oauth param for api calls. Here goes just users acess token
                // (inserted by server code)
                this.OAuthParams = function(action, o1, o2) {
                    Object.getOwnPropertyNames(o2).map(function(key) {
                        if (action === 'add') o1[key] = o2[key]; // add property name and value from o2 to o1
                        else delete o1[key]; // removes property name we found in o2 from o1 
                    });
                    return o1;
                };
            }
            OAuth.prototype = Object.create(Options.prototype);
            OAuth.prototype.setNonUserParams = function() {
                this.setSignatureMethod();
                this.setNonce();
                this.setTimestamp();
                this.setVersion();
            };
            OAuth.prototype.setSignatureMethod = function(method) {
                this.oauth[this.prefix + 'signature_method'] = method || "HMAC-SHA1";
            };
            OAuth.prototype.setVersion = function(version) {
                this.oauth[this.prefix + 'version'] = version || "1.0";
            };
            OAuth.prototype.setNonce = function() {
                // then returns base64 encoding of that string, striped of "=" sign.
                var seeds = "AaBb1CcDd2EeFf3GgHh4IiJjK5kLl6MmN7nOo8PpQqR9rSsTtU0uVvWwXxYyZz";
                var nonce = "";
                for(var i = 0; i < 31; i++)nonce += seeds[Math.round(Math.random() * (seeds.length - 1))]; // pick a random ascii from seeds string
                nonce = btoa(nonce).replace(/=/g, ""); // encode to base64 and strip the "=" sign
                //  console.log("nonce: " + nonce)
                this.oauth[this.prefix + 'nonce'] = nonce; // set twitter session identifier (nonce)
            };
            OAuth.prototype.setTimestamp = function() {
                this.oauth[this.prefix + 'timestamp'] = (Date.now() / 1000 | 0) + 1; // cuting off decimal part by 
            // converting it to 32 bit integer in bitwise OR operation. 
            };
            OAuth.prototype.addQueryParams = function(phase, leg) {
                // adding params. 
                console.log(`addQueryParams(): \n phase: ${phase}`);
                this.options.queryParams[phase + 'Host'] = this.twtUrl.domain;
                this.options.queryParams[phase + 'Path'] = phase === 'leg' ? this.twtUrl.path + leg : // this.twtUrl.api_path +
                this.UserOptions.path + this.UserOptions.paramsEncoded;
                this.options.queryParams[phase + 'Method'] = phase === 'leg' ? this.httpMethods[leg] : this.UserOptions.method;
                this.options.queryParams[phase + 'SBS'] = this.genSignatureBaseString(leg);
                this.options.queryParams[phase + 'AH'] = this.genHeaderString();
            };
            OAuth.prototype.genSignatureBaseString = function(leg) {
                this.signatureBaseString = '';
                var a = [];
                for(var name in this.oauth)if (this.oauth.hasOwnProperty(name)) a.push(name); // and pushes them to array
                a.sort(); // sorts alphabeticaly
                var pair; // key value pair
                var key; // parameter name
                var value; // param value   
                // Collects oauth params
                for(var i = 0; i < a.length; i++){
                    // between each pair of key/value it puts "&" sign.
                    key = a[i]; // Thakes key that was sorted alphabeticaly
                    switch(key){
                        case "oauth_callback":
                            // Check to see if there is data to append to calback as query string:
                            value = this.session_data ? this.appendToCallback(this.session_data) : this.oauth[this.prefix + 'callback'];
                            break;
                        case "oauth_consumer_key":
                            value = ""; // Sensitive data we leave for server to add
                            break;
                        case "oauth_signature":
                            continue; // We dont add signature to singatureBaseString at all (notice no break)
                        default:
                            value = this.oauth[key]; // Takes value of that key
                    }
                    pair = percentEncode(key) + "=" + percentEncode(value); // Encodes key value and inserts "="
                    //console.log(pair)                                     // in between.
                    if (i !== a.length - 1) pair += "&"; // Dont append "&" on last pair    
                    this.signatureBaseString += pair; // Add pair to SBS
                }
                var method; // Collecting the reqest method and url
                var url;
                if (typeof leg === 'string') {
                    method = this.httpMethods[leg] // Get the method for this leg
                    ;
                    method = method.toUpperCase() + "&"; // upercase the method, add "&"
                    url = this.absoluteUrls[leg]; // Get the absolute url for this leg of authentication
                    url = percentEncode(url) + "&"; // Encode the url, add "&".
                } else {
                    method = leg.method.toUpperCase() + "&"; // Upercase the method, add "&"
                    url = this.twtUrl.protocol + this.twtUrl.domain + leg.path; // + this.twtUrl.api_path 
                    // Get the absoute url for api call + user provided path
                    url = percentEncode(url) + "&"; // Encode the url, add "&".
                    console.log('genSignatureBaseString(): url', url);
                //debugger;
                }
                // Finaly we assemble the sbs string. PercentEncoding again the signature base string.
                this.signatureBaseString = method + url + percentEncode(this.signatureBaseString);
                return this.signatureBaseString;
            };
            OAuth.prototype.genHeaderString = function() {
                var a = [];
                Object.getOwnPropertyNames(this.oauth).forEach(function(el) {
                    if (!/^oauth/.test(el)) delete this[el];
                }, this.oauth) // delete non oauth params
                ;
                for(var name in this.oauth)a.push(name);
                //console.log("a; " + a);
                a.sort(); // Aphabeticaly sort array of property names
                var headerString = this.leadPrefix; // Adding "OAuth " in front everthing
                var key; // Temp vars
                var value;
                var pair;
                for(var i = 0; i < a.length; i++){
                    key = a[i]; // Take the key name (sorted in a)
                    value = this.oauth[key]; // Get it from oauth object
                    key = percentEncode(key); // Encode the key
                    value = "\"" + percentEncode(value) + "\""; // Adding double quotes to value
                    pair = key + "=" + value; // Adding "=" between
                    if (i !== a.length - 1) pair = pair + ", " // Add trailing comma and space, until end
                    ;
                    headerString += pair;
                }
                return headerString;
            };
            OAuth.prototype.appendToCallback = function(data, name) {
                //console.log('Data: ==> ', data)
                if (!name) name = "data";
                var callback = this.oauth[this.prefix + 'callback'];
                var fEncoded = formEncode(data, true);
                //console.log(fEncoded);
                var queryString = name + '=' + percentEncode(fEncoded); // Make string from object then                                                                                  // percent encode it.  
                //console.log("queryString: ", queryString)
                if (!/\?/.test(callback)) callback += "?"; // Add "?" if one not exist
                else queryString = '&' + queryString // other queryString exists, so add '&' to this qs
                ;
                this.oauth[this.prefix + 'callback'] = callback + queryString; // Add queryString to callback
                //   console.log("OAUTH CALLBACK: "+this.oauth[ this.prefix + 'callback'])
                return this.oauth[this.prefix + 'callback'];
            };
            module.exports = OAuth;
        },
        {
            "twiz-client-options": 3,
            "twiz-client-utils": 7
        }
    ],
    3: [
        function(require, module, exports) {
            var utils = require('twiz-client-utils');
            var formEncode = utils.formEncode;
            var request = utils.request;
            var CustomError = utils.CustomError;
            function Options() {
                this.leg = [
                    "request_token",
                    "authorize",
                    "access_token"
                ]; // Names of each leg (step) in 3-leg OAuth
                // to twitter. Names are also url path ends:
                // http://api.twitter.com/oauth/request_token
                this.httpMethods = {} // This is the current sequence of http methods we use in 3-leg authentication 
                ;
                this.httpMethods[this.leg[0]] = "POST";
                this.httpMethods[this.leg[1]] = "GET";
                this.httpMethods[this.leg[2]] = "POST";
                this.twtUrl = {
                    "protocol": "https://",
                    "domain": "api.twitter.com",
                    "path": "/oauth/"
                };
                this.apiUrl = this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.path; // here we store absolute url                                                                                   // without leg.
                this.absoluteUrls = {} // Here we put together the complete url for each leg (step) in authentication
                ;
                this.absoluteUrls[this.leg[0]] = this.apiUrl + this.leg[0];
                this.absoluteUrls[this.leg[1]] = this.apiUrl + this.leg[1];
                this.absoluteUrls[this.leg[2]] = this.apiUrl + this.leg[2];
                this.lnkLabel = {
                    name: 'twiz_',
                    data: {
                        'id': 'he who dares '
                    }
                };
                this.UserOptions = {
                    host: '',
                    path: '',
                    method: '',
                    params: '',
                    paramsEncoded: '',
                    SBS: '',
                    AH: '',
                    body: '',
                    encoding: ''
                };
                this.options = {}; // request options we send to server
                this.options.url = '';
                this.options.method = '';
                this.options.queryParams = {
                    legHost: '',
                    legPath: '',
                    legMethod: '',
                    legSBS: '',
                    legAH: ''
                };
                this.options.body = '';
                this.options.encoding = '';
                this.options.beforeSend = '';
                this.options.callback = ''; // Callback function
                this.options.chunked = '';
                this.options.parse = true; // if json string, parse it
                CustomError.call(this); // add CustomError feature
                this.addCustomErrors({
                    redirectionUrlNotSet: "You must provide a redirection_url to which users will be redirected.",
                    noStringProvided: "You must provide a string as an argument.",
                    serverUrlNotSet: "You must proivide server url to which request will be sent",
                    optionNotSet: "Check that \'method\' and \'path\' are set."
                });
            }
            Options.prototype.setUserParams = function(args) {
                var temp;
                for(var prop in args){
                    temp = args[prop];
                    switch(prop){
                        case "server_url":
                            this.server_url = temp;
                            break;
                        case "redirection_url":
                            this[this.leg[0]].oauth_callback = temp;
                            break;
                        case "method":
                            this.method = temp;
                            break;
                        case "new_window":
                            this.newWindow = {};
                            for(var data in temp)/* istanbul ignore else */ if (temp.hasOwnProperty(data)) switch(data){
                                case "name":
                                    this.newWindow[data] = temp[data];
                                    break;
                                case "features":
                                    this.newWindow[data] = temp[data];
                                    break;
                            }
                            break;
                        case 'callback':
                            this.callback_func = temp;
                            break;
                        case "session_data":
                            this.session_data = temp;
                            break;
                        case "stream":
                            this.options.queryParams.stream = temp; // set stream indication in query params
                            break;
                        case "options":
                            for(var opt in temp)switch(opt){
                                case "method":
                                    this.UserOptions[opt] = temp[opt];
                                    break;
                                case "path":
                                    this.UserOptions[opt] = temp[opt];
                                    break;
                                case "params":
                                    this.UserOptions[opt] = temp[opt];
                                    this.UserOptions.paramsEncoded = "?" + formEncode(temp[opt], true);
                                    break;
                                case "body":
                                    this.UserOptions[opt] = temp[opt];
                                    break;
                                case "encoding":
                                    this.UserOptions[opt] = temp[opt];
                                    break;
                                case "beforeSend":
                                    this.UserOptions[opt] = temp[opt];
                                    break;
                                case "chunked":
                                    this.UserOptions[opt] = temp[opt];
                                    break;
                            }
                            break;
                        case "endpoints":
                            // for each leg (part) of the 3-leg authentication.
                            for(var leg in temp)switch(leg){
                                case "request_token":
                                    this.absoluteUrls[leg] = this.apiUrl + temp[leg]; // if leg is request_token, update with new url    
                                    break;
                                case "authorize":
                                    this.absoluteUrls[leg] = this.apiUrl + temp[leg];
                                    break;
                                case "access_token":
                                    this.absoluteUrls[leg] = this.apiUrl + temp[leg];
                                    break;
                            }
                            break;
                    }
                }
            };
            Options.prototype.checkUserParams = function(leg) {
                if (!this.server_url) throw this.CustomError('serverUrlNotSet'); // We need server url to send request 
                if (leg === this.leg[0]) this.checkRedirectionCallback(); // Check only in request token step 
                this.checkApiOptions();
            };
            Options.prototype.checkRedirectionCallback = function() {
                if (!this[this.leg[0]].oauth_callback) throw this.CustomError('redirectionUrlNotSet');
            // throw an error if one is not set
            };
            Options.prototype.checkApiOptions = function() {
                for(var opt in this.UserOptions)if (opt === 'path' || opt == 'method') {
                    if (!this.UserOptions[opt]) throw this.CustomError('optionNotSet');
                }
            };
            Options.prototype.setRequestOptions = function(leg) {
                this.options.url = this.server_url; // server address
                this.options.method = this.method || this.httpMethods[leg]; // user set method or same as leg method
                this.options.body = this.UserOptions.body; // api call have a body, oauth dance requires no body
                this.options.encoding = this.UserOptions.encoding; // encoding of a body
                this.options.beforeSend = this.UserOptions.beforeSend; // manipulates request before it is sent
                this.options.chunked = this.UserOptions.chunked; // indicates chunk by chunk stream consuming
            };
            module.exports = Options;
        },
        {
            "twiz-client-utils": 7
        }
    ],
    4: [
        function(require, module, exports) {
            var CustomError = require('twiz-client-utils').CustomError;
            var throwAsyncError = require('twiz-client-utils').throwAsyncError;
            function Redirect(args) {
                this.newWindow = args.newWindow; // new tap / popup features
                this.url = args.redirectionUrl; // url whre twitter will direct user after authorization
                this.callback_func = args.callback_func; // callback if there is no promise
                this.reject = args.reject;
                this.requestToken; // data from request token step   
                CustomError.call(this); // add CustomError feature
                this.addCustomErrors({
                    noCallbackFunc: 'You must specify a callback function',
                    callbackURLnotConfirmed: "Redirection(callback) url you specified wasn't confirmed by Twitter"
                });
            }
            Redirect.prototype.redirection = function(resolve, res) {
                //  console.log(res);
                //console.log("From twitter request_token: ", res.data);
                //console.log('res.data type: ',typeof res.data);
                this.res = res; // save response reference
                //  console.log('|redirection res|:', res.data || 'no data')
                if (res.error || !res.data.oauth_token) {
                    this.deliverData(resolve, res);
                    return;
                }
                this.requestToken = res.data; // set requestToken data
                this.confirmCallback(res.data); // confirm that twitter accepted user's redirection(callback) url
                this.saveRequestToken(window.localStorage, res.data.oauth_token); // save token for url authorization 
                this.redirect(resolve) // redirect user to twitter for authorization 
                ;
            };
            Redirect.prototype.deliverData = function(resolve, res) {
                // by callback function
                if (resolve) {
                    resolve(res);
                    return;
                }
                if (this.callback_func) {
                    this.callback_func(res);
                    return;
                }
                this.throwAsyncError(this.CustomError('noCallbackFunc')); // raise error when there is no promise or
            // callback present
            };
            Redirect.prototype.throwAsyncError = throwAsyncError; // promise (async) aware error throwing
            Redirect.prototype.confirmCallback = function(sent) {
                // console.log('confirmed: +++ ',sent.oauth_callback_confirmed)
                if (sent.oauth_callback_confirmed !== "true") this.throwAsyncError(this.CustomError('callbackURLnotConfirmed'));
            };
            Redirect.prototype.saveRequestToken = function(storage, token) {
                storage.requestToken_ = null; // erase any previous tokens, note null is
                // actualy transformed to string "null"
                storage.requestToken_ = token; // save token to storage
            //console.log('storage before: ', storage); 
            };
            Redirect.prototype.redirect = function(resolve) {
                //console.log('RESOLVE : ', resolve);
                var url = this.url + "?" + 'oauth_token=' + this.requestToken.oauth_token; // assemble url for second leg
                this.adjustResponse(this.res); // removes this.res.data                                                                               
                if (!this.newWindow) {
                    this.SPA(resolve, url); // redirects current window to url
                    return;
                }
                this.site(resolve, url); // site 
            };
            Redirect.prototype.adjustResponse = function(res) {
                res.data = ''; // never send (request token) data to user 
            };
            Redirect.prototype.SPA = function(resolve, url) {
                function redirectCurrentWindow() {
                    window.location = url;
                } // redirects window we are currently in (no popUp)
                this.res.redirection = true; // since there is no newWindow reference indicate that redirection happens
                if (resolve) {
                    resolve(this.res); // resolve with response object
                    Promise.resolve().then(function() {
                        redirectCurrentWindow();
                    });
                    return;
                }
                if (this.callback_func) {
                    this.callback_func(this.res); // run callback with token
                    setTimeout(function() {
                        redirectCurrentWindow();
                    }, 0); // redirect asap
                    return;
                }
                this.throwAsyncError(this.CustomError('noCallbackFunc')); // raise error when there is no promise or callback present
            };
            Redirect.prototype.site = function(resolve, url) {
                var opened = this.openWindow(); // open new window/popup and save its reference
                opened.location = url; // change location (redirect)
                this.res.window = opened; // newWindow reference
                this.deliverData(resolve, this.res);
            };
            Redirect.prototype.openWindow = function() {
                this.newWindow.window = window.open('', this.newWindow.name, this.newWindow.features);
                return this.newWindow.window;
            };
            module.exports = Redirect;
        },
        {
            "twiz-client-utils": 7
        }
    ],
    5: [
        function(require, module, exports) {
            var CustomError = require('twiz-client-utils').CustomError;
            var formEncode = require('twiz-client-utils').formEncode;
            var throwAsyncError = require('twiz-client-utils').throwAsyncError;
            var request = function() {
                var request = {};
                CustomError.call(request); // add CustomError functionality
                request.addCustomErrors({
                    cbAlreadyCalled: "Callback function has already been called.",
                    cbWasNotCalled: "Calback function provided was not called.",
                    urlNotSet: "You must provide url for the request you make",
                    callbackNotProvided: "Callback function was not provided.",
                    notJSON: "Received data not in JSON format",
                    encodingNotSupported: "Encoding you provided is not supported",
                    noContentType: "Failed to get content-type header from response. Possible CORS restrictions or header missing.",
                    methodMustBePOST: "If request has body, method must be POST",
                    chunkedResponseWarning: 'Stream is consumed chunk by chunk in xhr.onprogress(..) callback'
                });
                request.initRequest = function(args) {
                    //  url,method, queryParams, callback, httpMethod, body, beforeSend
                    this.request = this.createRequest(); // Creates XMLHttpRequest object
                    var temp; // Temporary place holder
                    for(var prop in args){
                        if (!args.hasOwnProperty(prop)) continue;
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
                                this.body = temp; // add body for request
                                break;
                            case "parse":
                                this.parse = temp;
                                break;
                            case "encoding":
                                this.encoding = temp;
                                break;
                            case "beforeSend":
                                this.beforeSend = temp // For instance, if we need to set additonal request specific headers 
                                ;
                                break;
                            case "chunked":
                                this.chunked = temp;
                                break;
                            case "reject":
                                this.reject = temp;
                                break;
                        }
                    }
                    if (!this.url) throw this.CustomError('urlNotSet'); // Throw error if url was not provided in args
                    if (!this.method) this.method = "GET"; // Defaults to "GET" method 
                    if (!this.request.onreadystatechange) throw this.CustomError('callbackNotProvided'); // cb missing
                    // console.log(args);
                    this.sendRequest(); // Makes the actual http request
                };
                request.createRequest = function() {
                    try {
                        return new XMLHttpRequest(); // standard
                    } catch (e) {
                        try {
                            // since it cannot presume older browser environment
                            return new ActiveXObject("Microsoft.XMLHTTP"); // IE specific ...
                        } catch (e) {
                            return new ActiveXObject("Msxml12.XMLHTTP");
                        }
                    }
                };
                request.setUrl = function(url) {
                    if (!this.url) this.url = url;
                    else this.url = url + this.url; // if setQuery() run before set url, we already have query string
                // in "this.url". So "url" needs to go first.
                };
                request.setQuery = function(queryParams) {
                    this.queryString = formEncode(queryParams); // Form-url-encoded object 
                    if (this.url.indexOf("?") === -1) this.url += "?"; // If doesnt have query delimiter add it
                    this.url += this.queryString; // Adds query string to url 
                };
                request.addListener = function(callback) {
                    var alreadyCalled = false;
                    this.request.onreadystatechange = (function() {
                        if (this.request.readyState === 4) {
                            if (alreadyCalled) this.throwAsyncError(this.CustomError('cbAlreadyCalled')); // callback is run 
                            // only once
                            alreadyCalled = true;
                            var statusCode = this.request.status;
                            var contentType = this.request.getResponseHeader("Content-type"); // Get the response's content type
                            this.invokeCallback(statusCode, contentType, callback);
                        }
                    }).bind(this); // Async functions lose -this- context because they start executing when functions that 
                // invoked them already finished their execution. Here we pass whatever "this" references 
                // in the moment addListener() is invoked. Meaning, "this" will repesent each 
                // instance of request. 
                };
                request.throwAsyncError = throwAsyncError;
                request.invokeCallback = function(statusCode, contentType, callback) {
                    var err;
                    var data;
                    var temp;
                    if (this.chunked) {
                        this.throwAsyncError(this.CustomError('chunkedResponseWarning'));
                        return;
                    }
                    if (!contentType) throw this.throwAsyncError(this.CustomError('noContentType'));
                    contentType = contentType.split(';')[0]; // get just type , in case there is charset specified 
                    // console.log('Content-Type: ', contentType);
                    switch(contentType){
                        case "application/json":
                            try {
                                if (this.parse) temp = JSON.parse(this.request.responseText); // only if parse flag is set
                                else temp = this.request.responseText;
                            } catch (e) {
                                this.throwAsyncError(this.CustomError('notJSON')); // if parsing failed note it
                            }
                            break;
                        case "application/xml":
                            temp = this.request.responseXML; // responceXML already parsed as a DOM object
                            break;
                        case "application/x-www-url-formencoded":
                            temp = {}; //console.log('responseText:', this.request.responseText)
                            this.request.responseText.trim().split("&").forEach(function(el) {
                                var pairs = el.split('=');
                                var name = decodeURIComponent(pairs[0].replace(/\+/g, ' ')); // decode key
                                var value = decodeURIComponent(pairs[1].replace(/\+/g, ' ')); // decode value
                                temp[name] = value; // add key and value
                            }, temp);
                            break;
                        default:
                            temp = this.request.responseText; // text/html , text/css and others are treated as text
                    }
                    if (statusCode !== 200) err = {
                        'statusCode': statusCode,
                        'statusText': this.request.statusText,
                        'data': temp
                    };
                    else data = temp; // no error, data is object we got from payload
                    callback({
                        'error': err,
                        'data': data,
                        'xhr': this.request // set reference to xhr request/response
                    });
                };
                request.setHeader = function(header, value) {
                    this.request.setRequestHeader(header, value);
                };
                request.setBody = function() {
                    //console.log("In setBody")
                    if (this.method === 'GET') throw this.CustomError('methodMustBePOST'); // don't set body on GET method
                    if (!this.encoding) {
                        this.setHeader("Content-Type", "text/plain"); // default to text/plain whenno encoding specified
                        return;
                    }
                    switch(this.encoding.toLowerCase()){
                        case "form":
                            this.body = formEncode(this.body) // encode the body
                            ;
                            this.setHeader("Content-Type", "application/x-www-url-formencoded;charset=utf-8");
                            break;
                        case "json":
                            this.body = JSON.stringify(this.body);
                            this.setHeader("Content-Type", "application/json;charset=utf-8");
                            break;
                        case "text":
                            this.setHeader("Content-Type", 'text/plain;charset=utf-8');
                            break;
                        default:
                            throw this.CustomError('encodingNotSupported');
                    }
                    console.log('setBody(): body:', this.body);
                };
                request.sendRequest = function() {
                    if (this.request.readyState == "0") this.request.open(this.method, this.url); // "0" means open() not called
                    if (this.beforeSend) this.beforeSend(this.request) // if user supplied beforeSend() func, call it.
                    ;
                    // console.log("This before setBody!", "req state:"+ this.request.readyState);
                    if (!this.body) this.body = null; // set it to 'null' when there is no body 
                    else this.setBody();
                    this.request.send(this.body);
                };
                return function(args) {
                    var r = Object.create(request); // behavior delegation link
                    if (args) {
                        r.initRequest(args); // Initialise request and sends it, if args are provided
                        return; // if not , then return the object that indirectly, through closures 
                    } // have access to prototype chain of request API. That is it has acess to 
                    // an instance of request API (here it is "r").
                    return {
                        initRequest: r.initRequest.bind(r)
                    } // "borrow" method from instance, bind it to instance
                    ;
                };
            }();
            module.exports = request;
        },
        {
            "twiz-client-utils": 7
        }
    ],
    6: [
        function(require, module, exports) {
            var OAuth = require('twiz-client-oauth');
            function RequestToken() {
                OAuth.call(this);
                this.name = this.leg[0];
            }
            RequestToken.prototype = Object.create(OAuth.prototype);
            module.exports = RequestToken;
        },
        {
            "twiz-client-oauth": 2
        }
    ],
    7: [
        function(require, module, exports) {
            'use strict';
            function percentEncode(str) {
                return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
                    // it follows RFC3986 and percent encodes
                    // reserved characters in sqere brackets.
                    return '%' + c.charCodeAt(0).toString(16); // takes binary representation of every reserved char
                // , coverts it to hex string char and appends to "%".
                });
            }
            function formEncode(dataObj, spaces) {
                var pairs = [];
                var value;
                var key;
                var type;
                for(var name in dataObj){
                    type = typeof dataObj[name];
                    if (dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null") {
                        // in dataObj 
                        key = percentEncode(name); // encode property name
                        if (type === 'object') {
                            value = formEncode(dataObj[name], spaces); // form encode object
                            value = percentEncode(value) // since return value is string, percent encode it
                            ;
                        } else value = percentEncode(dataObj[name]) // property is not object, percent encode it 
                        ;
                        if (!spaces) {
                            key = key.replace(/%20/g, "+");
                            value = value.replace(/%20/g, "+"); // substitute space encoding for +
                        }
                        pairs.push(key + "=" + value);
                    }
                }
                return pairs.join("&");
            }
            function CustomError() {
                this.messages = {}; // error messages place holder    
                this.addCustomErrors = function(errors) {
                    Object.getOwnPropertyNames(errors).map(function(name) {
                        this.messages[name] = errors[name];
                    }, this);
                };
                this.CustomError = function(name) {
                    var err = Error(this.messages[name]); // take message text
                    err['name'] = name; // set error name
                    return err;
                };
            }
            function throwAsyncError(error) {
                if (Promise) return this.reject(error); // if we have promise use reject for async Errors
                throw error; // otherways just throw it
            }
            module.exports = {
                'percentEncode': percentEncode,
                'formEncode': formEncode,
                'CustomError': CustomError,
                'throwAsyncError': throwAsyncError
            };
        },
        {}
    ],
    8: [
        function(require, module, exports) {
            "use strict";
            (function() {
                'use strict';
                var RequestToken = require('twiz-client-requesttoken');
                var Redirect = require('twiz-client-redirect');
                var AccessToken = require('twiz-client-accesstoken');
                var request = require('twiz-client-request');
                function buildOAuthLeg(leg_) {
                    function OAuthLegBuilder() {
                        leg_.call(this); // attach to any of oauth legs
                        this.legParams = this[this.name]; // oauth params for this leg
                        this.phases = {
                            leg: '',
                            api: '',
                            other: ''
                        };
                        var setOAuthLeg = (function(args) {
                            this.setUserParams(args); // parse user suplied params
                            this.checkUserParams(this.name); // check the ones we need for this leg
                            this.setNonUserParams(); // set calculated params
                            this.OAuthParams('add', this.oauth, this.legParams); // add oauth params for this leg
                            if (this.specificAction) this.specificAction(); // action specific to each leg 
                            this.setRequestOptions(this.name);
                            this.addQueryParams(this.phases.leg.toString(), this.name); // add leg params as url parameters
                        }).bind(this);
                        setOAuthLeg.toString = function() {
                            return 'leg';
                        }; // redefine toString to reflect phase name
                        var setAPI = (function() {
                            this.OAuthParams('remove', this.oauth, this.legParams); // remove oauth leg params
                            this.OAuthParams('add', this.oauth, this.apiCall); // add params for api call
                            /* istanbul ignore else */ if (this.UserOptions.params) this.oauth = this.OAuthParams('add', this.UserOptions.params, this.oauth);
                            this.addQueryParams(this.phases.api.toString(), this.UserOptions); // adding user params as url para
                        }).bind(this);
                        setAPI.toString = function() {
                            return 'api';
                        };
                        this.phases.leg = setOAuthLeg;
                        this.phases.api = setAPI;
                    }
                    OAuthLegBuilder.prototype = Object.create(leg_.prototype); // link prototype of any oauth leg
                    OAuthLegBuilder.prototype.OAuthLegPlus = function(args, resolve, reject) {
                        this.reject = reject // make reference to reject for async functions that trow errors
                        ;
                        this.phases.leg(args); // standard oauth leg parameters added as url params
                        this.phases.api(); // add parameters for api call (call after 3-leg dance) as url para
                        /* istanbul ignore else */ if (this.phases.other) this.phases.other();
                         // add any other parameters as url params
                        this.send(this.options, this.callback.bind(this, resolve)); // send request to server
                    };
                    OAuthLegBuilder.prototype.send = function(options, cb) {
                        options.callback = cb // sets callback function
                        ;
                        options.reject = this.reject; // for promise (async) aware error throwing
                        request(options);
                    };
                    return new OAuthLegBuilder();
                }
                function twizClient() {
                    this.OAuth = function(args) {
                        // brings request token (when no access token is present on server) and redirects
                        if (Promise) return this.promised(args, this.RequestTokenLeg()) // promisify request_token step (leg)
                        ;
                        this.RequestTokenLeg().OAuthLegPlus(args);
                    };
                    this.finishOAuth = function(args) {
                        if (Promise) return this.promised(args, this.AccessTokenLeg()); // promisify access token step
                        this.AccessTokenLeg().OAuthLegPlus(args);
                    };
                    this.promised = function(args, leg) {
                        return new Promise(function(resolve, reject) {
                            leg.OAuthLegPlus(args, resolve, reject); // launch request
                        });
                    };
                    this.getSessionData = function() {
                        this.accessTokenLeg = this.accessTokenLeg || this.AccessTokenLeg() // if exist dont make new one
                        ;
                        return this.accessTokenLeg.getSessionData(); // return data from url
                    };
                    this.RequestTokenLeg = function() {
                        var requestTokenLeg = buildOAuthLeg(RequestToken);
                        requestTokenLeg.phases.other = (function setVerifyCredentials() {
                            // leg. Adds access token verification 
                            var credentialOptions = {
                                options: {
                                    path: '/1.1/account/verify_credentials.json',
                                    method: 'GET',
                                    params: {
                                        include_entities: false,
                                        skip_status: true,
                                        include_email: true
                                    },
                                    paramsEncoded: ''
                                }
                            };
                            this.setUserParams(credentialOptions); // use this function to set UserOptions;   
                            this.oauth = this.OAuthParams('add', this.UserOptions.params, this.oauth); // add params to oauth
                            this.addQueryParams('ver', this.UserOptions); // add query params for this phase
                        }).bind(requestTokenLeg);
                        requestTokenLeg.callback = function(resolve, res) {
                            var authorize = new Redirect({
                                newWindow: this.newWindow,
                                redirectionUrl: this.absoluteUrls[this.leg[1]],
                                callback_func: this.callback_func,
                                reject: this.reject // for  promise (async) awere error throwing  
                            });
                            authorize.redirection(resolve, res);
                        };
                        return requestTokenLeg;
                    };
                    this.AccessTokenLeg = function() {
                        var accessTokenLeg = buildOAuthLeg(AccessToken);
                        accessTokenLeg.specificAction = function() {
                            this.setAuthorizedTokens();
                        };
                        accessTokenLeg.callback = function(resolve, res) {
                            this.deliverData(resolve, res); // delivers to user     
                        };
                        return accessTokenLeg;
                    };
                }
                function twiz() {
                    var r = new twizClient();
                    var head = {
                        OAuth: r.OAuth.bind(r),
                        finishOAuth: r.finishOAuth.bind(r),
                        getSessionData: r.getSessionData.bind(r)
                    };
                    return head;
                }
                if (typeof window === 'object' && window !== 'null') window.twizClient = twiz;
                else if (typeof module === 'object' && module !== 'null') module.exports = twiz;
            })();
        },
        {
            "twiz-client-accesstoken": 1,
            "twiz-client-redirect": 4,
            "twiz-client-request": 5,
            "twiz-client-requesttoken": 6
        }
    ]
}, {}, [
    8
]);

},{}]},["h81tc","8VGZO"], "8VGZO", "parcelRequire94c2")

//# sourceMappingURL=index.f71e6048.js.map
