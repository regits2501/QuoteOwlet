// src/lib/twiz-client-utils/src/utils.js
function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return `%${c.charCodeAt(0).toString(16)}`;
  });
}
function formEncode(dataObj, spaces) {
  const pairs = [];
  let value;
  let key;
  let type;
  for (let name in dataObj) {
    type = typeof dataObj[name];
    if (dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null") {
      key = percentEncode(name);
      if (type === "object") {
        value = formEncode(dataObj[name], spaces);
        value = percentEncode(value);
      } else value = percentEncode(dataObj[name]);
      if (!spaces) {
        key = key.replace(/%20/g, "+");
        value = value.replace(/%20/g, "+");
      }
      pairs.push(`${key}=${value}`);
    }
  }
  return pairs.join("&");
}
function CustomError() {
  this.messages = {};
  this.addCustomErrors = function(errors) {
    Object.getOwnPropertyNames(errors).map(function(name) {
      this.messages[name] = errors[name];
    }, this);
  };
  this.CustomError = function(name) {
    let err = Error(this.messages[name]);
    err.name = name;
    return err;
  };
}
function throwAsyncError(error) {
  if (Promise) return this.reject(error);
  throw error;
}

// src/lib/twiz-client-options/src/Options.js
var Options = class {
  constructor() {
    this.leg = ["request_token", "authorize", "access_token"];
    this.httpMethods = {};
    this.httpMethods[this.leg[0]] = "POST";
    this.httpMethods[this.leg[1]] = "GET";
    this.httpMethods[this.leg[2]] = "POST";
    this.twtUrl = {
      "protocol": "https://",
      "domain": "api.x.com",
      "path": "/oauth/"
      // 'path' is actualy just a part of the complete path used in 3-leg dance 
    };
    this.apiUrl = this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.path;
    this.absoluteUrls = {};
    this.absoluteUrls[this.leg[0]] = this.apiUrl + this.leg[0];
    this.absoluteUrls[this.leg[1]] = this.apiUrl + this.leg[1];
    this.absoluteUrls[this.leg[2]] = this.apiUrl + this.leg[2];
    this.UserOptions = {
      host: "",
      path: "",
      method: "",
      params: "",
      paramsEncoded: "",
      SBS: "",
      AH: "",
      body: "",
      encoding: ""
    };
    this.options = {};
    this.options.url = "";
    this.options.method = "";
    this.options.queryParams = {
      legHost: "",
      // oauth leg params     
      legPath: "",
      legMethod: "",
      legSBS: "",
      legAH: ""
    };
    this.options.body = "";
    this.options.encoding = "";
    this.options.beforeSend = "";
    this.options.callback = "";
    this.options.chunked = "";
    this.options.parse = true;
    CustomError.call(this);
    this.addCustomErrors({
      redirectionUrlNotSet: "You must provide a redirection_url to which users will be redirected.",
      noStringProvided: "You must provide a string as an argument.",
      serverUrlNotSet: "You must proivide server url to which request will be sent",
      optionNotSet: "Check that 'method' and 'path' are set."
    });
  }
  setUserParams(args) {
    let temp;
    for (let prop in args) {
      temp = args[prop];
      switch (prop) {
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
          for (let data in temp) {
            if (temp.hasOwnProperty(data)) {
              switch (data) {
                case "name":
                  this.newWindow[data] = temp[data];
                  break;
                case "features":
                  this.newWindow[data] = temp[data];
                  break;
              }
            }
          }
          break;
        case "callback":
          this.callback_func = temp;
          break;
        case "session_data":
          this.session_data = temp;
          break;
        case "stream":
          this.options.queryParams.stream = temp;
          break;
        case "options":
          for (let opt in temp) {
            switch (opt) {
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
          }
          break;
        case "endpoints":
          for (let leg in temp) {
            switch (leg) {
              case "request_token":
                this.absoluteUrls[leg] = this.apiUrl + temp[leg];
                break;
              case "authorize":
                this.absoluteUrls[leg] = this.apiUrl + temp[leg];
                break;
              case "access_token":
                this.absoluteUrls[leg] = this.apiUrl + temp[leg];
                break;
            }
          }
          break;
      }
    }
  }
  // check for needed params
  checkUserParams(leg) {
    if (!this.server_url) throw this.CustomError("serverUrlNotSet");
    if (leg === this.leg[0]) this.checkRedirectionCallback();
    this.checkApiOptions();
  }
  // check that redirection url is set (oauth_callback)
  checkRedirectionCallback() {
    if (!this[this.leg[0]].oauth_callback) throw this.CustomError("redirectionUrlNotSet");
  }
  checkApiOptions() {
    for (let opt in this.UserOptions) {
      if (opt === "path" || opt == "method") {
        if (!this.UserOptions[opt])
          throw this.CustomError("optionNotSet");
      }
    }
  }
  // set request options we send to twiz-server
  setRequestOptions(leg) {
    this.options.url = this.server_url;
    this.options.method = this.method || this.httpMethods[leg];
    this.options.body = this.UserOptions.body;
    this.options.encoding = this.UserOptions.encoding;
    this.options.beforeSend = this.UserOptions.beforeSend;
    this.options.chunked = this.UserOptions.chunked;
  }
};

// src/lib/twiz-client-oauth/src/OAuth.js
var btoa = window.btoa;
var OAuth = class extends Options {
  constructor() {
    super();
    this.leadPrefix = "OAuth ";
    this.prefix = "oauth_";
    this.oauth = {};
    this.oauth[this.prefix + "consumer_key"] = "";
    this.oauth[this.prefix + "signature"] = "";
    this.oauth[this.prefix + "nonce"] = "";
    this.oauth[this.prefix + "signature_method"] = "";
    this.oauth[this.prefix + "timestamp"] = "";
    this.oauth[this.prefix + "version"] = "";
    this[this.leg[0]] = {};
    this[this.leg[0]][this.prefix + "callback"] = "";
    this[this.leg[2]] = {};
    this[this.leg[2]][this.prefix + "token"] = "";
    this[this.leg[2]][this.prefix + "verifier"] = "";
    this.apiCall = {};
    this.apiCall[this.prefix + "token"] = "";
    this.OAuthParams = function(action, o1, o2) {
      Object.getOwnPropertyNames(o2).map(function(key) {
        if (action === "add") o1[key] = o2[key];
        else delete o1[key];
      });
      return o1;
    };
  }
  // set OAuth params
  setNonUserParams() {
    this.setSignatureMethod();
    this.setNonce();
    this.setTimestamp();
    this.setVersion();
  }
  setSignatureMethod(method) {
    this.oauth[this.prefix + "signature_method"] = method || "HMAC-SHA1";
  }
  setVersion(version) {
    this.oauth[this.prefix + "version"] = version || "1.0";
  }
  // set X session identifier (nonce) and return base64 encoding of that string, striped of "=" sign.
  setNonce() {
    const seeds = "AaBb1CcDd2EeFf3GgHh4IiJjK5kLl6MmN7nOo8PpQqR9rSsTtU0uVvWwXxYyZz";
    let nonce = "";
    for (let i = 0; i < 31; i++) {
      nonce += seeds[Math.round(Math.random() * (seeds.length - 1))];
    }
    nonce = btoa(nonce).replace(/=/g, "");
    this.oauth[this.prefix + "nonce"] = nonce;
  }
  setTimestamp() {
    this.oauth[this.prefix + "timestamp"] = (Date.now() / 1e3 | 0) + 1;
  }
  addQueryParams(phase, leg) {
    this.options.queryParams[phase + "Host"] = this.twtUrl.domain;
    this.options.queryParams[phase + "Path"] = phase === "leg" ? this.twtUrl.path + leg : this.UserOptions.path + this.UserOptions.paramsEncoded;
    this.options.queryParams[phase + "Method"] = phase === "leg" ? this.httpMethods[leg] : this.UserOptions.method;
    this.options.queryParams[phase + "SBS"] = this.genSignatureBaseString(leg);
    this.options.queryParams[phase + "AH"] = this.genAuthorizationHeaderString();
  }
  // generate Signature Base String (SBS)
  genSignatureBaseString(leg) {
    this.signatureBaseString = "";
    const a = [];
    for (let name in this.oauth) {
      if (this.oauth.hasOwnProperty(name)) a.push(name);
    }
    a.sort();
    let pair;
    let key;
    let value;
    for (let i = 0; i < a.length; i++) {
      key = a[i];
      switch (key) {
        // In case of consumer and user keys we leave them to server logic
        case "oauth_callback":
          value = this.session_data ? this.appendToCallback(this.session_data) : this.oauth[this.prefix + "callback"];
          break;
        case "oauth_consumer_key":
          value = "";
          break;
        case "oauth_signature":
          continue;
        // We dont add signature to singatureBaseString at all (notice no break)
        default:
          value = this.oauth[key];
      }
      pair = percentEncode(key) + "=" + percentEncode(value);
      if (i !== a.length - 1) pair += "&";
      this.signatureBaseString += pair;
    }
    let method;
    let url;
    if (typeof leg === "string") {
      method = this.httpMethods[leg];
      method = method.toUpperCase() + "&";
      url = this.absoluteUrls[leg];
      url = percentEncode(url) + "&";
    } else {
      method = leg.method.toUpperCase() + "&";
      url = this.twtUrl.protocol + this.twtUrl.domain + leg.path;
      url = percentEncode(url) + "&";
    }
    this.signatureBaseString = method + url + percentEncode(this.signatureBaseString);
    return this.signatureBaseString;
  }
  // generate Auhtorization Header String (AHS)
  genAuthorizationHeaderString() {
    const a = [];
    Object.getOwnPropertyNames(this.oauth).forEach(function(el) {
      if (!/^oauth/.test(el)) delete this[el];
    }, this.oauth);
    for (let name in this.oauth) {
      a.push(name);
    }
    a.sort();
    let headerString = this.leadPrefix;
    let key;
    let value;
    let pair;
    for (let i = 0; i < a.length; i++) {
      key = a[i];
      value = this.oauth[key];
      key = percentEncode(key);
      value = '"' + percentEncode(value) + '"';
      pair = key + "=" + value;
      if (i !== a.length - 1) pair = pair + ", ";
      headerString += pair;
    }
    return headerString;
  }
  // append query parameters to oauth_callback url
  appendToCallback(data, name) {
    if (!name) name = "data";
    let callback = this.oauth[this.prefix + "callback"];
    let fEncoded = formEncode(data, true);
    let queryString = name + "=" + percentEncode(fEncoded);
    if (!/\?/.test(callback)) callback += "?";
    else queryString = "&" + queryString;
    this.oauth[this.prefix + "callback"] = callback + queryString;
    return this.oauth[this.prefix + "callback"];
  }
};

// src/lib/twiz-client-accesstoken/src/AccessToken.js
var AccessToken = class _AccessToken extends OAuth {
  constructor() {
    super();
    this.name = this.leg[2];
    this.redirectionUrlParsed;
    this.redirectionData;
    this.loadedRequestToken;
    this.authorized;
    this.winLoc = window.location.href;
    this.addCustomErrors({
      verifierNotFound: '"oauth_verifier" string was not found in redirection(callback) url.',
      tokenNotFound: '"oauth_token" string was not found in redirection(callback) url.',
      tokenMissmatch: "Request token and token from redirection(callback) url do not match",
      requestTokenNotSet: "Request token was not set",
      requestTokenNotSaved: "Request token was not saved. Check that page url from which you make request match your redirection_url.",
      noRepeat: "Cannot make another request with same redirection(callback) url",
      urlNotFound: "Current window location (url) not found",
      noSessionData: "Unable to find session data in current url",
      spaWarning: "Authorization data not found in url"
    });
  }
  static throwAsyncError = throwAsyncError;
  // set oauth token and verifier for access token request
  setAuthorizedTokens() {
    this.parseRedirectionUrl(this.winLoc);
    if (this.isAuthorizationDataInURL()) {
      this.authorize(this.redirectionData);
      this.oauth[this.prefix + "verifier"] = this.authorized.oauth_verifier;
      this.oauth[this.prefix + "token"] = this.authorized.oauth_token;
    }
  }
  // parse the url we got from X redirection
  parseRedirectionUrl(url) {
    var str = this.getQueryString(url, /\?/g, /#/g);
    this.redirectionData = this.parseQueryParams(str);
    this.redirectionUrlParsed = true;
  }
  // get query string
  getQueryString(str, delimiter1, delimiter2) {
    if (!str) throw this.CustomError("urlNotFound");
    let start = str.search(delimiter1);
    let end;
    if (!delimiter2 || str.search(delimiter2) === -1) end = str.length;
    else end = str.search(delimiter2);
    return str.substring(start, end);
  }
  parseQueryParams(str) {
    let arr = [];
    if (str[0] === "?") str = str.substring(1);
    arr = str.split("&").map(function(el) {
      let arr2 = el.split("=");
      return arr2;
    });
    return this.objectify(arr);
  }
  objectify(array) {
    const data = {};
    let len = array.length;
    for (let i = 0; i < len; i++) {
      let arr = array[i];
      for (let j = 0; j < arr.length; j++) {
        if (j == 0) data[arr[j]] = arr[j + 1];
      }
    }
    return data;
  }
  isAuthorizationDataInURL() {
    if (!this.redirectionData.oauth_token && !this.redirectionData.oauth_verifier) {
      throw this.CustomError("spaWarning");
    } else return true;
  }
  // authorize redirection data
  authorize(redirectionData) {
    if (this.isRequestTokenUsed(window.localStorage))
      throw this.CustomError("noRepeat");
    if (!redirectionData.oauth_verifier) throw this.CustomError("verifierNotFound");
    if (!redirectionData.oauth_token) throw this.CustomError("tokenNotFound");
    this.loadRequestToken(window.localStorage, redirectionData);
    if (redirectionData.oauth_token !== this.loadedRequestToken) throw this.CustomError("tokenMissmatch");
    return this.authorized = redirectionData;
  }
  // check if request token is already used
  isRequestTokenUsed(storage) {
    if (storage.requestToken_ === "null") return true;
    return false;
  }
  // load request token from local storage
  loadRequestToken(storage) {
    if (!storage.hasOwnProperty("requestToken_")) throw this.CustomError("requestTokenNotSaved");
    this.loadedRequestToken = storage.requestToken_;
    storage.requestToken_ = null;
    if (!this.loadedRequestToken) throw this.CustomError("requestTokenNotSet");
  }
  // get session data from redirection url 
  getSessionData() {
    if (!this.redirectionUrlParsed)
      this.parseRedirectionUrl(window.location.href);
    if (!this.redirectionData.data) {
      console.warn(this.messages["noSessionData"]);
      return;
    }
    this.sessionData = this.parseSessionData(this.redirectionData.data);
    return this.sessionData;
  }
  // parse session data from query string
  parseSessionData(str) {
    if (/%[0-9A-Z][0-9A-Z]/g.test(str))
      str = decodeURIComponent(decodeURIComponent(str));
    return this.parseQueryParams(str);
  }
  deliverData(resolve, res) {
    if (resolve) {
      resolve(res);
      return;
    }
    if (this.callback_func) {
      this.callback_func(res);
      return;
    }
    _AccessToken.throwAsyncError(this.CustomError("noCallbackFunc"));
  }
};

// src/lib/twiz-client-redirect/src/Redirect.js
var Redirect = class _Redirect {
  constructor(args) {
    this.newWindow = args.newWindow;
    this.url = args.redirectionUrl;
    this.callback_func = args.callback_func;
    this.reject = args.reject;
    this.requestToken;
    CustomError.call(this);
    this.addCustomErrors({
      noCallbackFunc: "You must specify a callback function",
      callbackURLnotConfirmed: "Redirection(callback) url you specified wasn't confirmed by X"
    });
  }
  // redirect user to X for authorization (second OAuth leg)
  redirection(resolve, res) {
    this.res = res;
    if (res.error || !res.data.oauth_token) {
      this.deliverData(resolve, res);
      return;
    }
    this.requestToken = res.data;
    this.confirmCallback(res.data);
    this.saveRequestToken(window.localStorage, res.data.oauth_token);
    this.redirect(resolve);
  }
  deliverData(resolve, res) {
    if (resolve) {
      resolve(res);
      return;
    }
    if (this.callback_func) {
      this.callback_func(res);
      return;
    }
    _Redirect.throwAsyncError(this.CustomError("noCallbackFunc"));
  }
  // make sure callback we provided was confirmed by X
  confirmCallback(sent) {
    if (sent.oauth_callback_confirmed !== "true")
      _Redirect.throwAsyncError(this.CustomError("callbackURLnotConfirmed"));
  }
  // save the request token
  saveRequestToken(storage, token) {
    storage.requestToken_ = null;
    storage.requestToken_ = token;
  }
  // redirect to X with app's authorization token (received in first OAuth step)
  redirect(resolve) {
    const url = this.url + "?oauth_token=" + this.requestToken.oauth_token;
    this.adjustResponse(this.res);
    if (!this.newWindow) {
      this.SPA(resolve, url);
      return;
    }
    this.site(resolve, url);
  }
  adjustResponse(res) {
    res.data = "";
  }
  // redirect the user in SPA (singel page app) use case
  SPA(resolve, url) {
    function redirectCurrentWindow() {
      window.location = url;
    }
    this.res.redirection = true;
    if (resolve) {
      resolve(this.res);
      Promise.resolve().then(function() {
        redirectCurrentWindow();
      });
      return;
    }
    if (this.callback_func) {
      this.callback_func(this.res);
      setTimeout(function() {
        redirectCurrentWindow();
      }, 0);
      return;
    }
    _Redirect.throwAsyncError(this.CustomError("noCallbackFunc"));
  }
  // redirect the user in Web site use case
  site(resolve, url) {
    let opened = this.openWindow();
    opened.location = url;
    this.res.window = opened;
    this.deliverData(resolve, this.res);
  }
  // opens the new window with specified parameters
  openWindow() {
    this.newWindow.window = window.open("", this.newWindow.name, this.newWindow.features);
    return this.newWindow.window;
  }
  static throwAsyncError = throwAsyncError;
};

// src/lib/twiz-client-requesttoken/src/RequestToken.js
var RequestToken = class extends OAuth {
  constructor() {
    super();
    [this.name] = this.leg;
  }
};

// src/lib/twiz-client-request/src/request.js
var request = function() {
  let request2 = {};
  CustomError.call(request2);
  request2.addCustomErrors({
    // add custom errors
    cbAlreadyCalled: "Callback function has already been called.",
    cbWasNotCalled: "Calback function provided was not called.",
    urlNotSet: "You must provide url for the request you make",
    callbackNotProvided: "Callback function was not provided.",
    notJSON: "Received data not in JSON format",
    encodingNotSupported: "Encoding you provided is not supported",
    noContentType: "Failed to get content-type header from response. Possible CORS restrictions or header missing.",
    methodMustBePOST: "If request has body, method must be POST",
    chunkedResponseWarning: "Stream is consumed chunk by chunk in xhr.onprogress(..) callback"
  });
  request2.initRequest = function(args) {
    this.request = this.createRequest();
    let temp;
    for (let prop in args) {
      if (!args.hasOwnProperty(prop)) continue;
      temp = args[prop];
      switch (prop) {
        case "url":
          this.setUrl(temp);
          break;
        case "queryParams":
          this.setQuery(temp);
          break;
        case "callback":
          this.addListener(temp);
          break;
        case "method":
          this.method = temp.toUpperCase() || "GET";
          break;
        case "body":
          this.body = temp;
          break;
        case "parse":
          this.parse = temp;
          break;
        case "encoding":
          this.encoding = temp;
          break;
        case "beforeSend":
          this.beforeSend = temp;
          break;
        case "chunked":
          this.chunked = temp;
          break;
        case "reject":
          this.reject = temp;
          break;
      }
    }
    if (!this.url) throw this.CustomError("urlNotSet");
    if (!this.method) this.method = "GET";
    if (!this.request.onreadystatechange) throw this.CustomError("callbackNotProvided");
    this.sendRequest();
  };
  request2.createRequest = function() {
    try {
      return new XMLHttpRequest();
    } catch (e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
        return new ActiveXObject("Msxml12.XMLHTTP");
      }
    }
  };
  request2.setUrl = function(url) {
    if (!this.url) this.url = url;
    else this.url = url + this.url;
  };
  request2.setQuery = function(queryParams) {
    this.queryString = formEncode(queryParams);
    if (this.url.indexOf("?") === -1) this.url += "?";
    this.url += this.queryString;
  };
  request2.addListener = function(callback) {
    let alreadyCalled = false;
    this.request.onreadystatechange = function() {
      if (this.request.readyState === 4) {
        if (alreadyCalled) this.throwAsyncError(this.CustomError("cbAlreadyCalled"));
        alreadyCalled = true;
        let statusCode = this.request.status;
        let contentType = this.request.getResponseHeader("Content-type");
        this.invokeCallback(statusCode, contentType, callback);
      }
    }.bind(this);
  };
  request2.throwAsyncError = throwAsyncError;
  request2.invokeCallback = function(statusCode, contentType, callback) {
    let err;
    let data;
    let temp;
    if (this.chunked) {
      this.throwAsyncError(this.CustomError("chunkedResponseWarning"));
      return;
    }
    ;
    if (!contentType) throw this.throwAsyncError(this.CustomError("noContentType"));
    contentType = contentType.split(";")[0];
    switch (contentType) {
      // parse data as indicated in contentType header 
      case "application/json":
        try {
          if (this.parse) temp = JSON.parse(this.request.responseText);
          else temp = this.request.responseText;
        } catch (e) {
          this.throwAsyncError(this.CustomError("notJSON"));
        }
        break;
      case "application/xml":
        temp = this.request.responseXML;
        break;
      case "application/x-www-url-formencoded":
        temp = {};
        this.request.responseText.trim().split("&").forEach(function(el) {
          let pairs = el.split("=");
          let name = decodeURIComponent(pairs[0].replace(/\+/g, " "));
          let value = decodeURIComponent(pairs[1].replace(/\+/g, " "));
          temp[name] = value;
        }, temp);
        break;
      default:
        temp = this.request.responseText;
    }
    if (statusCode >= 400) {
      err = {
        "statusCode": statusCode,
        "statusText": this.request.statusText,
        "data": temp
      };
    } else data = temp;
    callback({
      // invoke callback
      "error": err,
      "data": data,
      "xhr": this.request
      // set reference to xhr request/response
    });
  };
  request2.setHeader = function(header, value) {
    this.request.setRequestHeader(header, value);
  };
  request2.setBody = function() {
    if (this.method === "GET") throw this.CustomError("methodMustBePOST");
    if (!this.encoding) {
      this.setHeader("Content-Type", "text/plain");
      return;
    }
    switch (this.encoding.toLowerCase()) {
      // when there is encoding string
      case "form":
        this.body = formEncode(this.body);
        this.setHeader("Content-Type", "application/x-www-url-formencoded;charset=utf-8");
        break;
      case "json":
        this.body = JSON.stringify(this.body);
        this.setHeader("Content-Type", "application/json;charset=utf-8");
        break;
      case "text":
        this.setHeader("Content-Type", "text/plain;charset=utf-8");
        break;
      default:
        throw this.CustomError("encodingNotSupported");
    }
  };
  request2.sendRequest = function() {
    if (this.request.readyState == "0") this.request.open(this.method, this.url);
    if (this.beforeSend) this.beforeSend(this.request);
    if (!this.body) this.body = null;
    else this.setBody();
    this.request.send(this.body);
  };
  return function(args) {
    let r = Object.create(request2);
    if (args) {
      r.initRequest(args);
      return;
    }
    return { initRequest: r.initRequest.bind(r) };
  };
}();
var request_default = request;

// src/twiz-client.js
function buildOAuthLeg(leg_) {
  class OAuthLegBuilder extends leg_ {
    constructor() {
      super();
      this.legParams = this[this.name];
      this.phases = {
        leg: "",
        // any of oauth legs (steps)
        api: "",
        // api calls (calls afther we've acquired access token)
        other: ""
      };
      const setOAuthLeg = function(args) {
        this.setUserParams(args);
        this.checkUserParams(this.name);
        this.setNonUserParams();
        this.OAuthParams("add", this.oauth, this.legParams);
        if (this.specificAction)
          this.specificAction();
        this.setRequestOptions(this.name);
        this.addQueryParams(this.phases.leg.toString(), this.name);
      }.bind(this);
      setOAuthLeg.toString = function() {
        return "leg";
      };
      const setAPI = function() {
        this.OAuthParams("remove", this.oauth, this.legParams);
        this.OAuthParams("add", this.oauth, this.apiCall);
        if (this.UserOptions.params) {
          this.oauth = this.OAuthParams("add", this.UserOptions.params, this.oauth);
        }
        this.addQueryParams(this.phases.api.toString(), this.UserOptions);
      }.bind(this);
      setAPI.toString = function() {
        return "api";
      };
      this.phases.leg = setOAuthLeg;
      this.phases.api = setAPI;
    }
    // define steps for an OAuth leg and following phase
    OAuthLegPlus(args, resolve, reject) {
      this.reject = reject;
      this.phases.leg(args);
      this.phases.api();
      if (this.phases.other) {
        this.phases.other();
      }
      this.send(this.options, this.callback.bind(this, resolve));
    }
    // send request to twiz-server with provided options
    send(options, cb) {
      options.callback = cb;
      options.reject = this.reject;
      request_default(options);
    }
  }
  return new OAuthLegBuilder();
}
var TwizOAuth = class {
  constructor() {
    this.OAuth = function(args) {
      if (Promise)
        return this.promised(args, this.RequestTokenLeg());
      this.RequestTokenLeg().OAuthLegPlus(args);
    };
    this.finishOAuth = function(args) {
      if (Promise)
        return this.promised(args, this.AccessTokenLeg());
      this.AccessTokenLeg().OAuthLegPlus(args);
    };
    this.promised = function(args, leg) {
      return new Promise(function(resolve, reject) {
        leg.OAuthLegPlus(args, resolve, reject);
      });
    };
    this.getSessionData = function() {
      this.accessTokenLeg = this.accessTokenLeg || this.AccessTokenLeg();
      return this.accessTokenLeg.getSessionData();
    };
    this.RequestTokenLeg = function() {
      const requestTokenLeg = buildOAuthLeg(RequestToken);
      requestTokenLeg.phases.other = function setVerifyCredentials() {
        let credentialOptions = {
          options: {
            path: "/1.1/account/verify_credentials.json",
            method: "GET",
            params: {
              include_entities: false,
              skip_status: true,
              include_email: true
            },
            paramsEncoded: ""
          }
        };
        this.setUserParams(credentialOptions);
        this.oauth = this.OAuthParams("add", this.UserOptions.params, this.oauth);
        this.addQueryParams("ver", this.UserOptions);
      }.bind(requestTokenLeg);
      requestTokenLeg.callback = function(resolve, res) {
        let authorize = new Redirect({
          newWindow: this.newWindow,
          // pass newWindow specs
          redirectionUrl: this.absoluteUrls[this.leg[1]],
          callback_func: this.callback_func,
          // callback function user supplied 
          reject: this.reject
          // for  promise (async) awere error throwing  
        });
        authorize.redirection(resolve, res);
      };
      return requestTokenLeg;
    };
    this.AccessTokenLeg = function() {
      const accessTokenLeg = buildOAuthLeg(AccessToken);
      accessTokenLeg.specificAction = function() {
        this.setAuthorizedTokens();
      };
      accessTokenLeg.callback = function(resolve, res) {
        this.deliverData(resolve, res);
      };
      return accessTokenLeg;
    };
  }
};
function twizClient() {
  let twiz = new TwizOAuth();
  const head = {
    // none of the 'this' references in 'twiz' are exposed to outside code
    OAuth: twiz.OAuth.bind(twiz),
    finishOAuth: twiz.finishOAuth.bind(twiz),
    getSessionData: twiz.getSessionData.bind(twiz)
  };
  return head;
}
var twiz_client_default = twizClient;
export {
  twiz_client_default as default
};
