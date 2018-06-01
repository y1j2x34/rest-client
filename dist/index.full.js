(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Rest = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var replacePrefRegExp = /^[/\\]+(.*)/;
    var replaceSufRegExp = /\/$/;
    var replaceSepsRegExp = /[/\\]+/g;
    /**
     *
     * join paths with path separator '/'
     * @export
     * @param {...string[]} paths
     * @returns {string}
     */
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        console.info(paths);
        return paths
            .filter(function (path) { return !!path; })
            .map(function (path) {
            if (path.match(/^[a-z]+:\/{2,}.*/i)) {
                return path.replace(replaceSufRegExp, '');
            }
            return path
                .replace(replacePrefRegExp, '$1')
                .replace(replaceSepsRegExp, '/')
                .replace(replaceSufRegExp, '');
        })
            .join('/');
    }

    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod[HttpMethod["GET"] = 0] = "GET";
        HttpMethod[HttpMethod["POST"] = 1] = "POST";
        HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
        HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
        HttpMethod[HttpMethod["PATCH"] = 4] = "PATCH";
        HttpMethod[HttpMethod["HEAD"] = 5] = "HEAD";
    })(HttpMethod || (HttpMethod = {}));
    var FilterOpportunity;
    (function (FilterOpportunity) {
        FilterOpportunity[FilterOpportunity["REQUEST"] = 0] = "REQUEST";
        FilterOpportunity[FilterOpportunity["RESPONSE_SUCCESS"] = 1] = "RESPONSE_SUCCESS";
        FilterOpportunity[FilterOpportunity["RESPONSE_ERROR"] = 2] = "RESPONSE_ERROR";
    })(FilterOpportunity || (FilterOpportunity = {}));

    var TERMINAL_RESULT = new Promise(function () { return undefined; });
    var FilterChain = /** @class */ (function () {
        /**
         * @constructs FilterChain
         * @hideconstructor
         * @param {Filter[]} filters
         * @param {number} index
         */
        function FilterChain(filters, index) {
            this.filters = filters;
            this.index = index;
            this.filters = filters.slice(0);
            this.index = index;
        }
        FilterChain.isTerminal = function (value) {
            return TERMINAL_RESULT === value;
        };
        FilterChain.prototype.next = function (value) {
            if (this.index >= this.filters.length) {
                return this.finish(value);
            }
            var filter = this.filters[this.index];
            var nextchain = this.nextchain();
            return filter(value, nextchain);
        };
        FilterChain.prototype.retry = function (value) {
            return this.chainAt(0).start(value);
        };
        FilterChain.prototype.start = function (value) {
            return this.next(value);
        };
        FilterChain.prototype.error = function (reason) {
            return Promise.reject(reason);
        };
        FilterChain.prototype.finish = function (result) {
            return result;
        };
        FilterChain.prototype.terminal = function () {
            return TERMINAL_RESULT;
        };
        FilterChain.prototype.chainAt = function (index) {
            return new FilterChain(this.filters, index);
        };
        FilterChain.prototype.nextchain = function () {
            return this.chainAt(this.index + 1);
        };
        return FilterChain;
    }());

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var componentEmitter = createCommonjsModule(function (module) {
    /**
     * Expose `Emitter`.
     */

    {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    });

    /**
     * Check if `obj` is an object.
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */

    function isObject(obj) {
      return null !== obj && 'object' === typeof obj;
    }

    var isObject_1 = isObject;

    /**
     * Module of mixed-in functions shared between node and client code
     */


    /**
     * Expose `RequestBase`.
     */

    var requestBase = RequestBase;

    /**
     * Initialize a new `RequestBase`.
     *
     * @api public
     */

    function RequestBase(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the prototype properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in RequestBase.prototype) {
        obj[key] = RequestBase.prototype[key];
      }
      return obj;
    }

    /**
     * Clear previous timeout.
     *
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.clearTimeout = function _clearTimeout(){
      clearTimeout(this._timer);
      clearTimeout(this._responseTimeoutTimer);
      delete this._timer;
      delete this._responseTimeoutTimer;
      return this;
    };

    /**
     * Override default response body parser
     *
     * This function will be called to convert incoming data into request.body
     *
     * @param {Function}
     * @api public
     */

    RequestBase.prototype.parse = function parse(fn){
      this._parser = fn;
      return this;
    };

    /**
     * Set format of binary response body.
     * In browser valid formats are 'blob' and 'arraybuffer',
     * which return Blob and ArrayBuffer, respectively.
     *
     * In Node all values result in Buffer.
     *
     * Examples:
     *
     *      req.get('/')
     *        .responseType('blob')
     *        .end(callback);
     *
     * @param {String} val
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.responseType = function(val){
      this._responseType = val;
      return this;
    };

    /**
     * Override default request body serializer
     *
     * This function will be called to convert data set via .send or .attach into payload to send
     *
     * @param {Function}
     * @api public
     */

    RequestBase.prototype.serialize = function serialize(fn){
      this._serializer = fn;
      return this;
    };

    /**
     * Set timeouts.
     *
     * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
     * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
     *
     * Value of 0 or false means no timeout.
     *
     * @param {Number|Object} ms or {response, deadline}
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.timeout = function timeout(options){
      if (!options || 'object' !== typeof options) {
        this._timeout = options;
        this._responseTimeout = 0;
        return this;
      }

      for(var option in options) {
        switch(option) {
          case 'deadline':
            this._timeout = options.deadline;
            break;
          case 'response':
            this._responseTimeout = options.response;
            break;
          default:
            console.warn("Unknown timeout option", option);
        }
      }
      return this;
    };

    /**
     * Set number of retry attempts on error.
     *
     * Failed requests will be retried 'count' times if timeout or err.code >= 500.
     *
     * @param {Number} count
     * @param {Function} [fn]
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.retry = function retry(count, fn){
      // Default to 1 if no count passed or true
      if (arguments.length === 0 || count === true) count = 1;
      if (count <= 0) count = 0;
      this._maxRetries = count;
      this._retries = 0;
      this._retryCallback = fn;
      return this;
    };

    var ERROR_CODES = [
      'ECONNRESET',
      'ETIMEDOUT',
      'EADDRINFO',
      'ESOCKETTIMEDOUT'
    ];

    /**
     * Determine if a request should be retried.
     * (Borrowed from segmentio/superagent-retry)
     *
     * @param {Error} err
     * @param {Response} [res]
     * @returns {Boolean}
     */
    RequestBase.prototype._shouldRetry = function(err, res) {
      if (!this._maxRetries || this._retries++ >= this._maxRetries) {
        return false;
      }
      if (this._retryCallback) {
        try {
          var override = this._retryCallback(err, res);
          if (override === true) return true;
          if (override === false) return false;
          // undefined falls back to defaults
        } catch(e) {
          console.error(e);
        }
      }
      if (res && res.status && res.status >= 500 && res.status != 501) return true;
      if (err) {
        if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
        // Superagent timeout
        if (err.timeout && err.code == 'ECONNABORTED') return true;
        if (err.crossDomain) return true;
      }
      return false;
    };

    /**
     * Retry request
     *
     * @return {Request} for chaining
     * @api private
     */

    RequestBase.prototype._retry = function() {

      this.clearTimeout();

      // node
      if (this.req) {
        this.req = null;
        this.req = this.request();
      }

      this._aborted = false;
      this.timedout = false;

      return this._end();
    };

    /**
     * Promise support
     *
     * @param {Function} resolve
     * @param {Function} [reject]
     * @return {Request}
     */

    RequestBase.prototype.then = function then(resolve, reject) {
      if (!this._fullfilledPromise) {
        var self = this;
        if (this._endCalled) {
          console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
        }
        this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
          self.end(function(err, res) {
            if (err) innerReject(err);
            else innerResolve(res);
          });
        });
      }
      return this._fullfilledPromise.then(resolve, reject);
    };

    RequestBase.prototype['catch'] = function(cb) {
      return this.then(undefined, cb);
    };

    /**
     * Allow for extension
     */

    RequestBase.prototype.use = function use(fn) {
      fn(this);
      return this;
    };

    RequestBase.prototype.ok = function(cb) {
      if ('function' !== typeof cb) throw Error("Callback required");
      this._okCallback = cb;
      return this;
    };

    RequestBase.prototype._isResponseOK = function(res) {
      if (!res) {
        return false;
      }

      if (this._okCallback) {
        return this._okCallback(res);
      }

      return res.status >= 200 && res.status < 300;
    };

    /**
     * Get request header `field`.
     * Case-insensitive.
     *
     * @param {String} field
     * @return {String}
     * @api public
     */

    RequestBase.prototype.get = function(field){
      return this._header[field.toLowerCase()];
    };

    /**
     * Get case-insensitive header `field` value.
     * This is a deprecated internal API. Use `.get(field)` instead.
     *
     * (getHeader is no longer used internally by the superagent code base)
     *
     * @param {String} field
     * @return {String}
     * @api private
     * @deprecated
     */

    RequestBase.prototype.getHeader = RequestBase.prototype.get;

    /**
     * Set header `field` to `val`, or multiple fields with one object.
     * Case-insensitive.
     *
     * Examples:
     *
     *      req.get('/')
     *        .set('Accept', 'application/json')
     *        .set('X-API-Key', 'foobar')
     *        .end(callback);
     *
     *      req.get('/')
     *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
     *        .end(callback);
     *
     * @param {String|Object} field
     * @param {String} val
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.set = function(field, val){
      if (isObject_1(field)) {
        for (var key in field) {
          this.set(key, field[key]);
        }
        return this;
      }
      this._header[field.toLowerCase()] = val;
      this.header[field] = val;
      return this;
    };

    /**
     * Remove header `field`.
     * Case-insensitive.
     *
     * Example:
     *
     *      req.get('/')
     *        .unset('User-Agent')
     *        .end(callback);
     *
     * @param {String} field
     */
    RequestBase.prototype.unset = function(field){
      delete this._header[field.toLowerCase()];
      delete this.header[field];
      return this;
    };

    /**
     * Write the field `name` and `val`, or multiple fields with one object
     * for "multipart/form-data" request bodies.
     *
     * ``` js
     * request.post('/upload')
     *   .field('foo', 'bar')
     *   .end(callback);
     *
     * request.post('/upload')
     *   .field({ foo: 'bar', baz: 'qux' })
     *   .end(callback);
     * ```
     *
     * @param {String|Object} name
     * @param {String|Blob|File|Buffer|fs.ReadStream} val
     * @return {Request} for chaining
     * @api public
     */
    RequestBase.prototype.field = function(name, val) {
      // name should be either a string or an object.
      if (null === name || undefined === name) {
        throw new Error('.field(name, val) name can not be empty');
      }

      if (this._data) {
        console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
      }

      if (isObject_1(name)) {
        for (var key in name) {
          this.field(key, name[key]);
        }
        return this;
      }

      if (Array.isArray(val)) {
        for (var i in val) {
          this.field(name, val[i]);
        }
        return this;
      }

      // val should be defined now
      if (null === val || undefined === val) {
        throw new Error('.field(name, val) val can not be empty');
      }
      if ('boolean' === typeof val) {
        val = '' + val;
      }
      this._getFormData().append(name, val);
      return this;
    };

    /**
     * Abort the request, and clear potential timeout.
     *
     * @return {Request}
     * @api public
     */
    RequestBase.prototype.abort = function(){
      if (this._aborted) {
        return this;
      }
      this._aborted = true;
      this.xhr && this.xhr.abort(); // browser
      this.req && this.req.abort(); // node
      this.clearTimeout();
      this.emit('abort');
      return this;
    };

    RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
      switch (options.type) {
        case 'basic':
          this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
          break;

        case 'auto':
          this.username = user;
          this.password = pass;
          break;

        case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
          this.set('Authorization', 'Bearer ' + user);
          break;
      }
      return this;
    };

    /**
     * Enable transmission of cookies with x-domain requests.
     *
     * Note that for this to work the origin must not be
     * using "Access-Control-Allow-Origin" with a wildcard,
     * and also must set "Access-Control-Allow-Credentials"
     * to "true".
     *
     * @api public
     */

    RequestBase.prototype.withCredentials = function(on) {
      // This is browser-only functionality. Node side is no-op.
      if (on == undefined) on = true;
      this._withCredentials = on;
      return this;
    };

    /**
     * Set the max redirects to `n`. Does noting in browser XHR implementation.
     *
     * @param {Number} n
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.redirects = function(n){
      this._maxRedirects = n;
      return this;
    };

    /**
     * Maximum size of buffered response body, in bytes. Counts uncompressed size.
     * Default 200MB.
     *
     * @param {Number} n
     * @return {Request} for chaining
     */
    RequestBase.prototype.maxResponseSize = function(n){
      if ('number' !== typeof n) {
        throw TypeError("Invalid argument");
      }
      this._maxResponseSize = n;
      return this;
    };

    /**
     * Convert to a plain javascript object (not JSON string) of scalar properties.
     * Note as this method is designed to return a useful non-this value,
     * it cannot be chained.
     *
     * @return {Object} describing method, url, and data of this request
     * @api public
     */

    RequestBase.prototype.toJSON = function() {
      return {
        method: this.method,
        url: this.url,
        data: this._data,
        headers: this._header,
      };
    };

    /**
     * Send `data` as the request body, defaulting the `.type()` to "json" when
     * an object is given.
     *
     * Examples:
     *
     *       // manual json
     *       request.post('/user')
     *         .type('json')
     *         .send('{"name":"tj"}')
     *         .end(callback)
     *
     *       // auto json
     *       request.post('/user')
     *         .send({ name: 'tj' })
     *         .end(callback)
     *
     *       // manual x-www-form-urlencoded
     *       request.post('/user')
     *         .type('form')
     *         .send('name=tj')
     *         .end(callback)
     *
     *       // auto x-www-form-urlencoded
     *       request.post('/user')
     *         .type('form')
     *         .send({ name: 'tj' })
     *         .end(callback)
     *
     *       // defaults to x-www-form-urlencoded
     *      request.post('/user')
     *        .send('name=tobi')
     *        .send('species=ferret')
     *        .end(callback)
     *
     * @param {String|Object} data
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.send = function(data){
      var isObj = isObject_1(data);
      var type = this._header['content-type'];

      if (this._formData) {
        console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
      }

      if (isObj && !this._data) {
        if (Array.isArray(data)) {
          this._data = [];
        } else if (!this._isHost(data)) {
          this._data = {};
        }
      } else if (data && this._data && this._isHost(this._data)) {
        throw Error("Can't merge these send calls");
      }

      // merge
      if (isObj && isObject_1(this._data)) {
        for (var key in data) {
          this._data[key] = data[key];
        }
      } else if ('string' == typeof data) {
        // default to x-www-form-urlencoded
        if (!type) this.type('form');
        type = this._header['content-type'];
        if ('application/x-www-form-urlencoded' == type) {
          this._data = this._data
            ? this._data + '&' + data
            : data;
        } else {
          this._data = (this._data || '') + data;
        }
      } else {
        this._data = data;
      }

      if (!isObj || this._isHost(data)) {
        return this;
      }

      // default to json
      if (!type) this.type('json');
      return this;
    };

    /**
     * Sort `querystring` by the sort function
     *
     *
     * Examples:
     *
     *       // default order
     *       request.get('/user')
     *         .query('name=Nick')
     *         .query('search=Manny')
     *         .sortQuery()
     *         .end(callback)
     *
     *       // customized sort function
     *       request.get('/user')
     *         .query('name=Nick')
     *         .query('search=Manny')
     *         .sortQuery(function(a, b){
     *           return a.length - b.length;
     *         })
     *         .end(callback)
     *
     *
     * @param {Function} sort
     * @return {Request} for chaining
     * @api public
     */

    RequestBase.prototype.sortQuery = function(sort) {
      // _sort default to true but otherwise can be a function or boolean
      this._sort = typeof sort === 'undefined' ? true : sort;
      return this;
    };

    /**
     * Compose querystring to append to req.url
     *
     * @api private
     */
    RequestBase.prototype._finalizeQueryString = function(){
      var query = this._query.join('&');
      if (query) {
        this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
      }
      this._query.length = 0; // Makes the call idempotent

      if (this._sort) {
        var index = this.url.indexOf('?');
        if (index >= 0) {
          var queryArr = this.url.substring(index + 1).split('&');
          if ('function' === typeof this._sort) {
            queryArr.sort(this._sort);
          } else {
            queryArr.sort();
          }
          this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
        }
      }
    };

    // For backwards compat only
    RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");};

    /**
     * Invoke callback with timeout error.
     *
     * @api private
     */

    RequestBase.prototype._timeoutError = function(reason, timeout, errno){
      if (this._aborted) {
        return;
      }
      var err = new Error(reason + timeout + 'ms exceeded');
      err.timeout = timeout;
      err.code = 'ECONNABORTED';
      err.errno = errno;
      this.timedout = true;
      this.abort();
      this.callback(err);
    };

    RequestBase.prototype._setTimeouts = function() {
      var self = this;

      // deadline
      if (this._timeout && !this._timer) {
        this._timer = setTimeout(function(){
          self._timeoutError('Timeout of ', self._timeout, 'ETIME');
        }, this._timeout);
      }
      // response timeout
      if (this._responseTimeout && !this._responseTimeoutTimer) {
        this._responseTimeoutTimer = setTimeout(function(){
          self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
        }, this._responseTimeout);
      }
    };

    /**
     * Return the mime type for the given `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    var type = function(str){
      return str.split(/ *; */).shift();
    };

    /**
     * Return header field parameters.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */

    var params = function(str){
      return str.split(/ *; */).reduce(function(obj, str){
        var parts = str.split(/ *= */);
        var key = parts.shift();
        var val = parts.shift();

        if (key && val) obj[key] = val;
        return obj;
      }, {});
    };

    /**
     * Parse Link header fields.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */

    var parseLinks = function(str){
      return str.split(/ *, */).reduce(function(obj, str){
        var parts = str.split(/ *; */);
        var url = parts[0].slice(1, -1);
        var rel = parts[1].split(/ *= */)[1].slice(1, -1);
        obj[rel] = url;
        return obj;
      }, {});
    };

    /**
     * Strip content related fields from `header`.
     *
     * @param {Object} header
     * @return {Object} header
     * @api private
     */

    var cleanHeader = function(header, changesOrigin){
      delete header['content-type'];
      delete header['content-length'];
      delete header['transfer-encoding'];
      delete header['host'];
      // secuirty
      if (changesOrigin) {
        delete header['authorization'];
        delete header['cookie'];
      }
      return header;
    };

    var utils = {
    	type: type,
    	params: params,
    	parseLinks: parseLinks,
    	cleanHeader: cleanHeader
    };

    /**
     * Module dependencies.
     */



    /**
     * Expose `ResponseBase`.
     */

    var responseBase = ResponseBase;

    /**
     * Initialize a new `ResponseBase`.
     *
     * @api public
     */

    function ResponseBase(obj) {
      if (obj) return mixin$1(obj);
    }

    /**
     * Mixin the prototype properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin$1(obj) {
      for (var key in ResponseBase.prototype) {
        obj[key] = ResponseBase.prototype[key];
      }
      return obj;
    }

    /**
     * Get case-insensitive `field` value.
     *
     * @param {String} field
     * @return {String}
     * @api public
     */

    ResponseBase.prototype.get = function(field) {
      return this.header[field.toLowerCase()];
    };

    /**
     * Set header related properties:
     *
     *   - `.type` the content type without params
     *
     * A response of "Content-Type: text/plain; charset=utf-8"
     * will provide you with a `.type` of "text/plain".
     *
     * @param {Object} header
     * @api private
     */

    ResponseBase.prototype._setHeaderProperties = function(header){
        // TODO: moar!
        // TODO: make this a util

        // content-type
        var ct = header['content-type'] || '';
        this.type = utils.type(ct);

        // params
        var params = utils.params(ct);
        for (var key in params) this[key] = params[key];

        this.links = {};

        // links
        try {
            if (header.link) {
                this.links = utils.parseLinks(header.link);
            }
        } catch (err) {
            // ignore
        }
    };

    /**
     * Set flags such as `.ok` based on `status`.
     *
     * For example a 2xx response will give you a `.ok` of __true__
     * whereas 5xx will be __false__ and `.error` will be __true__. The
     * `.clientError` and `.serverError` are also available to be more
     * specific, and `.statusType` is the class of error ranging from 1..5
     * sometimes useful for mapping respond colors etc.
     *
     * "sugar" properties are also defined for common cases. Currently providing:
     *
     *   - .noContent
     *   - .badRequest
     *   - .unauthorized
     *   - .notAcceptable
     *   - .notFound
     *
     * @param {Number} status
     * @api private
     */

    ResponseBase.prototype._setStatusProperties = function(status){
        var type = status / 100 | 0;

        // status / class
        this.status = this.statusCode = status;
        this.statusType = type;

        // basics
        this.info = 1 == type;
        this.ok = 2 == type;
        this.redirect = 3 == type;
        this.clientError = 4 == type;
        this.serverError = 5 == type;
        this.error = (4 == type || 5 == type)
            ? this.toError()
            : false;

        // sugar
        this.created = 201 == status;
        this.accepted = 202 == status;
        this.noContent = 204 == status;
        this.badRequest = 400 == status;
        this.unauthorized = 401 == status;
        this.notAcceptable = 406 == status;
        this.forbidden = 403 == status;
        this.notFound = 404 == status;
        this.unprocessableEntity = 422 == status;
    };

    function Agent() {
      this._defaults = [];
    }

    ["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects",
     "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function(fn) {
      /** Default setting for all requests from this agent */
      Agent.prototype[fn] = function(/*varargs*/) {
        this._defaults.push({fn:fn, arguments:arguments});
        return this;
      };
    });

    Agent.prototype._setDefaults = function(req) {
        this._defaults.forEach(function(def) {
          req[def.fn].apply(req, def.arguments);
        });
    };

    var agentBase = Agent;

    var client = createCommonjsModule(function (module, exports) {
    /**
     * Root reference for iframes.
     */

    var root;
    if (typeof window !== 'undefined') { // Browser window
      root = window;
    } else if (typeof self !== 'undefined') { // Web Worker
      root = self;
    } else { // Other environments
      console.warn("Using browser-only version of superagent in non-browser environment");
      root = commonjsGlobal;
    }







    /**
     * Noop.
     */

    function noop(){}
    /**
     * Expose `request`.
     */

    var request = exports = module.exports = function(method, url) {
      // callback
      if ('function' == typeof url) {
        return new exports.Request('GET', method).end(url);
      }

      // url first
      if (1 == arguments.length) {
        return new exports.Request('GET', method);
      }

      return new exports.Request(method, url);
    };

    exports.Request = Request;

    /**
     * Determine XHR.
     */

    request.getXHR = function () {
      if (root.XMLHttpRequest
          && (!root.location || 'file:' != root.location.protocol
              || !root.ActiveXObject)) {
        return new XMLHttpRequest;
      } else {
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
      }
      throw Error("Browser-only version of superagent could not find XHR");
    };

    /**
     * Removes leading and trailing whitespace, added to support IE.
     *
     * @param {String} s
     * @return {String}
     * @api private
     */

    var trim = ''.trim
      ? function(s) { return s.trim(); }
      : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

    /**
     * Serialize the given `obj`.
     *
     * @param {Object} obj
     * @return {String}
     * @api private
     */

    function serialize(obj) {
      if (!isObject_1(obj)) return obj;
      var pairs = [];
      for (var key in obj) {
        pushEncodedKeyValuePair(pairs, key, obj[key]);
      }
      return pairs.join('&');
    }

    /**
     * Helps 'serialize' with serializing arrays.
     * Mutates the pairs array.
     *
     * @param {Array} pairs
     * @param {String} key
     * @param {Mixed} val
     */

    function pushEncodedKeyValuePair(pairs, key, val) {
      if (val != null) {
        if (Array.isArray(val)) {
          val.forEach(function(v) {
            pushEncodedKeyValuePair(pairs, key, v);
          });
        } else if (isObject_1(val)) {
          for(var subkey in val) {
            pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
          }
        } else {
          pairs.push(encodeURIComponent(key)
            + '=' + encodeURIComponent(val));
        }
      } else if (val === null) {
        pairs.push(encodeURIComponent(key));
      }
    }

    /**
     * Expose serialization method.
     */

    request.serializeObject = serialize;

    /**
      * Parse the given x-www-form-urlencoded `str`.
      *
      * @param {String} str
      * @return {Object}
      * @api private
      */

    function parseString(str) {
      var obj = {};
      var pairs = str.split('&');
      var pair;
      var pos;

      for (var i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i];
        pos = pair.indexOf('=');
        if (pos == -1) {
          obj[decodeURIComponent(pair)] = '';
        } else {
          obj[decodeURIComponent(pair.slice(0, pos))] =
            decodeURIComponent(pair.slice(pos + 1));
        }
      }

      return obj;
    }

    /**
     * Expose parser.
     */

    request.parseString = parseString;

    /**
     * Default MIME type map.
     *
     *     superagent.types.xml = 'application/xml';
     *
     */

    request.types = {
      html: 'text/html',
      json: 'application/json',
      xml: 'text/xml',
      urlencoded: 'application/x-www-form-urlencoded',
      'form': 'application/x-www-form-urlencoded',
      'form-data': 'application/x-www-form-urlencoded'
    };

    /**
     * Default serialization map.
     *
     *     superagent.serialize['application/xml'] = function(obj){
     *       return 'generated xml here';
     *     };
     *
     */

    request.serialize = {
      'application/x-www-form-urlencoded': serialize,
      'application/json': JSON.stringify
    };

    /**
      * Default parsers.
      *
      *     superagent.parse['application/xml'] = function(str){
      *       return { object parsed from str };
      *     };
      *
      */

    request.parse = {
      'application/x-www-form-urlencoded': parseString,
      'application/json': JSON.parse
    };

    /**
     * Parse the given header `str` into
     * an object containing the mapped fields.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */

    function parseHeader(str) {
      var lines = str.split(/\r?\n/);
      var fields = {};
      var index;
      var line;
      var field;
      var val;

      for (var i = 0, len = lines.length; i < len; ++i) {
        line = lines[i];
        index = line.indexOf(':');
        if (index === -1) { // could be empty line, just skip it
          continue;
        }
        field = line.slice(0, index).toLowerCase();
        val = trim(line.slice(index + 1));
        fields[field] = val;
      }

      return fields;
    }

    /**
     * Check if `mime` is json or has +json structured syntax suffix.
     *
     * @param {String} mime
     * @return {Boolean}
     * @api private
     */

    function isJSON(mime) {
      // should match /json or +json
      // but not /json-seq
      return /[\/+]json($|[^-\w])/.test(mime);
    }

    /**
     * Initialize a new `Response` with the given `xhr`.
     *
     *  - set flags (.ok, .error, etc)
     *  - parse header
     *
     * Examples:
     *
     *  Aliasing `superagent` as `request` is nice:
     *
     *      request = superagent;
     *
     *  We can use the promise-like API, or pass callbacks:
     *
     *      request.get('/').end(function(res){});
     *      request.get('/', function(res){});
     *
     *  Sending data can be chained:
     *
     *      request
     *        .post('/user')
     *        .send({ name: 'tj' })
     *        .end(function(res){});
     *
     *  Or passed to `.send()`:
     *
     *      request
     *        .post('/user')
     *        .send({ name: 'tj' }, function(res){});
     *
     *  Or passed to `.post()`:
     *
     *      request
     *        .post('/user', { name: 'tj' })
     *        .end(function(res){});
     *
     * Or further reduced to a single call for simple cases:
     *
     *      request
     *        .post('/user', { name: 'tj' }, function(res){});
     *
     * @param {XMLHTTPRequest} xhr
     * @param {Object} options
     * @api private
     */

    function Response(req) {
      this.req = req;
      this.xhr = this.req.xhr;
      // responseText is accessible only if responseType is '' or 'text' and on older browsers
      this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
         ? this.xhr.responseText
         : null;
      this.statusText = this.req.xhr.statusText;
      var status = this.xhr.status;
      // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
      if (status === 1223) {
        status = 204;
      }
      this._setStatusProperties(status);
      this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
      // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
      // getResponseHeader still works. so we get content-type even if getting
      // other headers fails.
      this.header['content-type'] = this.xhr.getResponseHeader('content-type');
      this._setHeaderProperties(this.header);

      if (null === this.text && req._responseType) {
        this.body = this.xhr.response;
      } else {
        this.body = this.req.method != 'HEAD'
          ? this._parseBody(this.text ? this.text : this.xhr.response)
          : null;
      }
    }

    responseBase(Response.prototype);

    /**
     * Parse the given body `str`.
     *
     * Used for auto-parsing of bodies. Parsers
     * are defined on the `superagent.parse` object.
     *
     * @param {String} str
     * @return {Mixed}
     * @api private
     */

    Response.prototype._parseBody = function(str) {
      var parse = request.parse[this.type];
      if (this.req._parser) {
        return this.req._parser(this, str);
      }
      if (!parse && isJSON(this.type)) {
        parse = request.parse['application/json'];
      }
      return parse && str && (str.length || str instanceof Object)
        ? parse(str)
        : null;
    };

    /**
     * Return an `Error` representative of this response.
     *
     * @return {Error}
     * @api public
     */

    Response.prototype.toError = function(){
      var req = this.req;
      var method = req.method;
      var url = req.url;

      var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
      var err = new Error(msg);
      err.status = this.status;
      err.method = method;
      err.url = url;

      return err;
    };

    /**
     * Expose `Response`.
     */

    request.Response = Response;

    /**
     * Initialize a new `Request` with the given `method` and `url`.
     *
     * @param {String} method
     * @param {String} url
     * @api public
     */

    function Request(method, url) {
      var self = this;
      this._query = this._query || [];
      this.method = method;
      this.url = url;
      this.header = {}; // preserves header name case
      this._header = {}; // coerces header names to lowercase
      this.on('end', function(){
        var err = null;
        var res = null;

        try {
          res = new Response(self);
        } catch(e) {
          err = new Error('Parser is unable to parse the response');
          err.parse = true;
          err.original = e;
          // issue #675: return the raw response if the response parsing fails
          if (self.xhr) {
            // ie9 doesn't have 'response' property
            err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
            // issue #876: return the http status code if the response parsing fails
            err.status = self.xhr.status ? self.xhr.status : null;
            err.statusCode = err.status; // backwards-compat only
          } else {
            err.rawResponse = null;
            err.status = null;
          }

          return self.callback(err);
        }

        self.emit('response', res);

        var new_err;
        try {
          if (!self._isResponseOK(res)) {
            new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
          }
        } catch(custom_err) {
          new_err = custom_err; // ok() callback can throw
        }

        // #1000 don't catch errors from the callback to avoid double calling it
        if (new_err) {
          new_err.original = err;
          new_err.response = res;
          new_err.status = res.status;
          self.callback(new_err, res);
        } else {
          self.callback(null, res);
        }
      });
    }

    /**
     * Mixin `Emitter` and `RequestBase`.
     */

    componentEmitter(Request.prototype);
    requestBase(Request.prototype);

    /**
     * Set Content-Type to `type`, mapping values from `request.types`.
     *
     * Examples:
     *
     *      superagent.types.xml = 'application/xml';
     *
     *      request.post('/')
     *        .type('xml')
     *        .send(xmlstring)
     *        .end(callback);
     *
     *      request.post('/')
     *        .type('application/xml')
     *        .send(xmlstring)
     *        .end(callback);
     *
     * @param {String} type
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.type = function(type){
      this.set('Content-Type', request.types[type] || type);
      return this;
    };

    /**
     * Set Accept to `type`, mapping values from `request.types`.
     *
     * Examples:
     *
     *      superagent.types.json = 'application/json';
     *
     *      request.get('/agent')
     *        .accept('json')
     *        .end(callback);
     *
     *      request.get('/agent')
     *        .accept('application/json')
     *        .end(callback);
     *
     * @param {String} accept
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.accept = function(type){
      this.set('Accept', request.types[type] || type);
      return this;
    };

    /**
     * Set Authorization field value with `user` and `pass`.
     *
     * @param {String} user
     * @param {String} [pass] optional in case of using 'bearer' as type
     * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.auth = function(user, pass, options){
      if (1 === arguments.length) pass = '';
      if (typeof pass === 'object' && pass !== null) { // pass is optional and can be replaced with options
        options = pass;
        pass = '';
      }
      if (!options) {
        options = {
          type: 'function' === typeof btoa ? 'basic' : 'auto',
        };
      }

      var encoder = function(string) {
        if ('function' === typeof btoa) {
          return btoa(string);
        }
        throw new Error('Cannot use basic auth, btoa is not a function');
      };

      return this._auth(user, pass, options, encoder);
    };

    /**
     * Add query-string `val`.
     *
     * Examples:
     *
     *   request.get('/shoes')
     *     .query('size=10')
     *     .query({ color: 'blue' })
     *
     * @param {Object|String} val
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.query = function(val){
      if ('string' != typeof val) val = serialize(val);
      if (val) this._query.push(val);
      return this;
    };

    /**
     * Queue the given `file` as an attachment to the specified `field`,
     * with optional `options` (or filename).
     *
     * ``` js
     * request.post('/upload')
     *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
     *   .end(callback);
     * ```
     *
     * @param {String} field
     * @param {Blob|File} file
     * @param {String|Object} options
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.attach = function(field, file, options){
      if (file) {
        if (this._data) {
          throw Error("superagent can't mix .send() and .attach()");
        }

        this._getFormData().append(field, file, options || file.name);
      }
      return this;
    };

    Request.prototype._getFormData = function(){
      if (!this._formData) {
        this._formData = new root.FormData();
      }
      return this._formData;
    };

    /**
     * Invoke the callback with `err` and `res`
     * and handle arity check.
     *
     * @param {Error} err
     * @param {Response} res
     * @api private
     */

    Request.prototype.callback = function(err, res){
      if (this._shouldRetry(err, res)) {
        return this._retry();
      }

      var fn = this._callback;
      this.clearTimeout();

      if (err) {
        if (this._maxRetries) err.retries = this._retries - 1;
        this.emit('error', err);
      }

      fn(err, res);
    };

    /**
     * Invoke callback with x-domain error.
     *
     * @api private
     */

    Request.prototype.crossDomainError = function(){
      var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
      err.crossDomain = true;

      err.status = this.status;
      err.method = this.method;
      err.url = this.url;

      this.callback(err);
    };

    // This only warns, because the request is still likely to work
    Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
      console.warn("This is not supported in browser version of superagent");
      return this;
    };

    // This throws, because it can't send/receive data as expected
    Request.prototype.pipe = Request.prototype.write = function(){
      throw Error("Streaming is not supported in browser version of superagent");
    };

    /**
     * Check if `obj` is a host object,
     * we don't want to serialize these :)
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */
    Request.prototype._isHost = function _isHost(obj) {
      // Native objects stringify to [object File], [object Blob], [object FormData], etc.
      return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
    };

    /**
     * Initiate request, invoking callback `fn(res)`
     * with an instanceof `Response`.
     *
     * @param {Function} fn
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.end = function(fn){
      if (this._endCalled) {
        console.warn("Warning: .end() was called twice. This is not supported in superagent");
      }
      this._endCalled = true;

      // store callback
      this._callback = fn || noop;

      // querystring
      this._finalizeQueryString();

      return this._end();
    };

    Request.prototype._end = function() {
      var self = this;
      var xhr = (this.xhr = request.getXHR());
      var data = this._formData || this._data;

      this._setTimeouts();

      // state change
      xhr.onreadystatechange = function(){
        var readyState = xhr.readyState;
        if (readyState >= 2 && self._responseTimeoutTimer) {
          clearTimeout(self._responseTimeoutTimer);
        }
        if (4 != readyState) {
          return;
        }

        // In IE9, reads to any property (e.g. status) off of an aborted XHR will
        // result in the error "Could not complete the operation due to error c00c023f"
        var status;
        try { status = xhr.status; } catch(e) { status = 0; }

        if (!status) {
          if (self.timedout || self._aborted) return;
          return self.crossDomainError();
        }
        self.emit('end');
      };

      // progress
      var handleProgress = function(direction, e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        e.direction = direction;
        self.emit('progress', e);
      };
      if (this.hasListeners('progress')) {
        try {
          xhr.onprogress = handleProgress.bind(null, 'download');
          if (xhr.upload) {
            xhr.upload.onprogress = handleProgress.bind(null, 'upload');
          }
        } catch(e) {
          // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
          // Reported here:
          // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
        }
      }

      // initiate request
      try {
        if (this.username && this.password) {
          xhr.open(this.method, this.url, true, this.username, this.password);
        } else {
          xhr.open(this.method, this.url, true);
        }
      } catch (err) {
        // see #1149
        return this.callback(err);
      }

      // CORS
      if (this._withCredentials) xhr.withCredentials = true;

      // body
      if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
        // serialize stuff
        var contentType = this._header['content-type'];
        var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
        if (!serialize && isJSON(contentType)) {
          serialize = request.serialize['application/json'];
        }
        if (serialize) data = serialize(data);
      }

      // set header fields
      for (var field in this.header) {
        if (null == this.header[field]) continue;

        if (this.header.hasOwnProperty(field))
          xhr.setRequestHeader(field, this.header[field]);
      }

      if (this._responseType) {
        xhr.responseType = this._responseType;
      }

      // send stuff
      this.emit('request', this);

      // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
      // We need null here if data is undefined
      xhr.send(typeof data !== 'undefined' ? data : null);
      return this;
    };

    request.agent = function() {
      return new agentBase();
    };

    ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(method) {
      agentBase.prototype[method.toLowerCase()] = function(url, fn) {
        var req = new request.Request(method, url);
        this._setDefaults(req);
        if (fn) {
          req.end(fn);
        }
        return req;
      };
    });

    agentBase.prototype.del = agentBase.prototype['delete'];

    /**
     * GET `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    request.get = function(url, data, fn) {
      var req = request('GET', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.query(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * HEAD `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    request.head = function(url, data, fn) {
      var req = request('HEAD', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.query(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * OPTIONS query to `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    request.options = function(url, data, fn) {
      var req = request('OPTIONS', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * DELETE `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} [data]
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    function del(url, data, fn) {
      var req = request('DELETE', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    }

    request['del'] = del;
    request['delete'] = del;

    /**
     * PATCH `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} [data]
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    request.patch = function(url, data, fn) {
      var req = request('PATCH', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * POST `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} [data]
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    request.post = function(url, data, fn) {
      var req = request('POST', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * PUT `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */

    request.put = function(url, data, fn) {
      var req = request('PUT', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };
    });
    var client_1 = client.get;
    var client_2 = client.post;
    var client_3 = client.patch;
    var client_4 = client.head;
    var client_5 = client.put;
    var client_6 = client.del;
    var client_7 = client.Request;

    var AjaxResponseImpl = /** @class */ (function () {
        function AjaxResponseImpl(resp) {
            this.resp = resp;
        }
        Object.defineProperty(AjaxResponseImpl.prototype, "accepted", {
            get: function () {
                return this.resp.accepted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "badRequest", {
            get: function () {
                return this.resp.badRequest;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "body", {
            get: function () {
                return this.resp.body;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "charset", {
            get: function () {
                return this.resp.charset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "clientError", {
            get: function () {
                return this.resp.clientError;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "error", {
            get: function () {
                return this.resp.error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "files", {
            get: function () {
                return this.resp.files;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "forbidden", {
            get: function () {
                return this.resp.forbidden;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "headers", {
            get: function () {
                return this.resp.header;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "info", {
            get: function () {
                return this.resp.info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "noContent", {
            get: function () {
                return this.resp.noContent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "notAcceptable", {
            get: function () {
                return this.resp.notAcceptable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "notFound", {
            get: function () {
                return this.resp.notFound;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "ok", {
            get: function () {
                return this.resp.ok;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "unauthorized", {
            get: function () {
                return this.resp.unauthorized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "redirect", {
            get: function () {
                return this.resp.redirect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "serverError", {
            get: function () {
                return this.resp.serverError;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "status", {
            get: function () {
                return this.resp.status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "statusType", {
            get: function () {
                return this.resp.statusType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "text", {
            get: function () {
                return this.resp.text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AjaxResponseImpl.prototype, "type", {
            get: function () {
                return this.resp.type;
            },
            enumerable: true,
            configurable: true
        });
        AjaxResponseImpl.prototype.getHeader = function (name) {
            return this.resp.get(name);
        };
        return AjaxResponseImpl;
    }());

    // tslint:disable max-classes-per-file
    function extendPromise(promise, methods) {
        var promiseThen = promise.then;
        var promiseCatch = promise.catch;
        return Object.assign(promise, methods, {
            then: function (fullfilled, onrejected) {
                var newPromise = promiseThen.call(promise, fullfilled, onrejected);
                return extendPromise(newPromise, methods);
            },
            catch: function (onrejected) {
                var newPromise = promiseCatch.call(promise, onrejected);
                return extendPromise(newPromise, methods);
            },
        });
    }
    function newAjaxRequest(req) {
        var promise = new Promise(function (resolve, reject) {
            req.then(function (resp) { return resolve(new AjaxResponseImpl(resp)); }, reject);
        });
        var methods = {
            abort: function () {
                req.abort();
            },
            progress: function (handler) {
                req.on('progress', handler);
            },
            on: function (name, handler) {
                req.on(name, handler);
            },
            retry: function (count, callback) {
                req.retry(count, function (err, res) {
                    callback(err, new AjaxResponseImpl(res));
                });
            },
        };
        return extendPromise(promise, methods);
    }

    var SuperAgentAjaxAPI = /** @class */ (function () {
        function SuperAgentAjaxAPI() {
        }
        SuperAgentAjaxAPI.prototype.request = function (options) {
            var req = this.createRequest(options);
            req
                .on('progress', function (e) {
                if (options.onprogress) {
                    options.onprogress(__assign({}, e));
                }
            })
                .on('abort', function (e) {
                if (options.onabort) {
                    options.onabort();
                }
            })
                .send(options.payload);
            return newAjaxRequest(req);
        };
        SuperAgentAjaxAPI.prototype.createRequest = function (options) {
            var req;
            switch (options.method) {
                case HttpMethod.GET:
                    req = client_1(options.url);
                    break;
                case HttpMethod.DELETE:
                    req = client_6(options.url);
                    break;
                case HttpMethod.PATCH:
                    req = client_3(options.url);
                    break;
                case HttpMethod.HEAD:
                    req = client_4(options.url);
                    break;
                case HttpMethod.POST:
                    req = client_2(options.url);
                    break;
                case HttpMethod.PUT:
                    req = client_5(options.url);
                    break;
                default:
                    throw new Error("Unexpected request method: " + options.method);
            }
            if (options.credential) {
                req.auth(options.credential.username, options.credential.password);
            }
            if (options.queries) {
                req.query(options.queries);
            }
            if (options.headers) {
                req.set(options.headers);
            }
            if (options.contentType) {
                req.set('Content-Type', options.contentType);
            }
            if (options.responseType) {
                req.responseType(options.responseType);
            }
            return req;
        };
        return SuperAgentAjaxAPI;
    }());

    const toBytes = s => [...s].map(c => c.charCodeAt(0));
    const xpiZipFilename = toBytes('META-INF/mozilla.rsa');
    const oxmlContentTypes = toBytes('[Content_Types].xml');
    const oxmlRels = toBytes('_rels/.rels');

    var fileType = input => {
    	const buf = input instanceof Uint8Array ? input : new Uint8Array(input);

    	if (!(buf && buf.length > 1)) {
    		return null;
    	}

    	const check = (header, options) => {
    		options = Object.assign({
    			offset: 0
    		}, options);

    		for (let i = 0; i < header.length; i++) {
    			// If a bitmask is set
    			if (options.mask) {
    				// If header doesn't equal `buf` with bits masked off
    				if (header[i] !== (options.mask[i] & buf[i + options.offset])) {
    					return false;
    				}
    			} else if (header[i] !== buf[i + options.offset]) {
    				return false;
    			}
    		}

    		return true;
    	};

    	const checkString = (header, options) => check(toBytes(header), options);

    	if (check([0xFF, 0xD8, 0xFF])) {
    		return {
    			ext: 'jpg',
    			mime: 'image/jpeg'
    		};
    	}

    	if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    		return {
    			ext: 'png',
    			mime: 'image/png'
    		};
    	}

    	if (check([0x47, 0x49, 0x46])) {
    		return {
    			ext: 'gif',
    			mime: 'image/gif'
    		};
    	}

    	if (check([0x57, 0x45, 0x42, 0x50], {offset: 8})) {
    		return {
    			ext: 'webp',
    			mime: 'image/webp'
    		};
    	}

    	if (check([0x46, 0x4C, 0x49, 0x46])) {
    		return {
    			ext: 'flif',
    			mime: 'image/flif'
    		};
    	}

    	// Needs to be before `tif` check
    	if (
    		(check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) &&
    		check([0x43, 0x52], {offset: 8})
    	) {
    		return {
    			ext: 'cr2',
    			mime: 'image/x-canon-cr2'
    		};
    	}

    	if (
    		check([0x49, 0x49, 0x2A, 0x0]) ||
    		check([0x4D, 0x4D, 0x0, 0x2A])
    	) {
    		return {
    			ext: 'tif',
    			mime: 'image/tiff'
    		};
    	}

    	if (check([0x42, 0x4D])) {
    		return {
    			ext: 'bmp',
    			mime: 'image/bmp'
    		};
    	}

    	if (check([0x49, 0x49, 0xBC])) {
    		return {
    			ext: 'jxr',
    			mime: 'image/vnd.ms-photo'
    		};
    	}

    	if (check([0x38, 0x42, 0x50, 0x53])) {
    		return {
    			ext: 'psd',
    			mime: 'image/vnd.adobe.photoshop'
    		};
    	}

    	// Zip-based file formats
    	// Need to be before the `zip` check
    	if (check([0x50, 0x4B, 0x3, 0x4])) {
    		if (
    			check([0x6D, 0x69, 0x6D, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x65, 0x70, 0x75, 0x62, 0x2B, 0x7A, 0x69, 0x70], {offset: 30})
    		) {
    			return {
    				ext: 'epub',
    				mime: 'application/epub+zip'
    			};
    		}

    		// Assumes signed `.xpi` from addons.mozilla.org
    		if (check(xpiZipFilename, {offset: 30})) {
    			return {
    				ext: 'xpi',
    				mime: 'application/x-xpinstall'
    			};
    		}

    		if (checkString('mimetypeapplication/vnd.oasis.opendocument.text', {offset: 30})) {
    			return {
    				ext: 'odt',
    				mime: 'application/vnd.oasis.opendocument.text'
    			};
    		}

    		if (checkString('mimetypeapplication/vnd.oasis.opendocument.spreadsheet', {offset: 30})) {
    			return {
    				ext: 'ods',
    				mime: 'application/vnd.oasis.opendocument.spreadsheet'
    			};
    		}

    		if (checkString('mimetypeapplication/vnd.oasis.opendocument.presentation', {offset: 30})) {
    			return {
    				ext: 'odp',
    				mime: 'application/vnd.oasis.opendocument.presentation'
    			};
    		}

    		// https://github.com/file/file/blob/master/magic/Magdir/msooxml
    		if (check(oxmlContentTypes, {offset: 30}) || check(oxmlRels, {offset: 30})) {
    			const sliced = buf.subarray(4, 4 + 2000);
    			const nextZipHeaderIndex = arr => arr.findIndex((el, i, arr) => arr[i] === 0x50 && arr[i + 1] === 0x4B && arr[i + 2] === 0x3 && arr[i + 3] === 0x4);
    			const header2Pos = nextZipHeaderIndex(sliced);

    			if (header2Pos !== -1) {
    				const slicedAgain = buf.subarray(header2Pos + 8, header2Pos + 8 + 1000);
    				const header3Pos = nextZipHeaderIndex(slicedAgain);

    				if (header3Pos !== -1) {
    					const offset = 8 + header2Pos + header3Pos + 30;

    					if (checkString('word/', {offset})) {
    						return {
    							ext: 'docx',
    							mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    						};
    					}

    					if (checkString('ppt/', {offset})) {
    						return {
    							ext: 'pptx',
    							mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    						};
    					}

    					if (checkString('xl/', {offset})) {
    						return {
    							ext: 'xlsx',
    							mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    						};
    					}
    				}
    			}
    		}
    	}

    	if (
    		check([0x50, 0x4B]) &&
    		(buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) &&
    		(buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)
    	) {
    		return {
    			ext: 'zip',
    			mime: 'application/zip'
    		};
    	}

    	if (check([0x75, 0x73, 0x74, 0x61, 0x72], {offset: 257})) {
    		return {
    			ext: 'tar',
    			mime: 'application/x-tar'
    		};
    	}

    	if (
    		check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) &&
    		(buf[6] === 0x0 || buf[6] === 0x1)
    	) {
    		return {
    			ext: 'rar',
    			mime: 'application/x-rar-compressed'
    		};
    	}

    	if (check([0x1F, 0x8B, 0x8])) {
    		return {
    			ext: 'gz',
    			mime: 'application/gzip'
    		};
    	}

    	if (check([0x42, 0x5A, 0x68])) {
    		return {
    			ext: 'bz2',
    			mime: 'application/x-bzip2'
    		};
    	}

    	if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
    		return {
    			ext: '7z',
    			mime: 'application/x-7z-compressed'
    		};
    	}

    	if (check([0x78, 0x01])) {
    		return {
    			ext: 'dmg',
    			mime: 'application/x-apple-diskimage'
    		};
    	}

    	if (check([0x33, 0x67, 0x70, 0x35]) || // 3gp5
    		(
    			check([0x0, 0x0, 0x0]) && check([0x66, 0x74, 0x79, 0x70], {offset: 4}) &&
    				(
    					check([0x6D, 0x70, 0x34, 0x31], {offset: 8}) || // MP41
    					check([0x6D, 0x70, 0x34, 0x32], {offset: 8}) || // MP42
    					check([0x69, 0x73, 0x6F, 0x6D], {offset: 8}) || // ISOM
    					check([0x69, 0x73, 0x6F, 0x32], {offset: 8}) || // ISO2
    					check([0x6D, 0x6D, 0x70, 0x34], {offset: 8}) || // MMP4
    					check([0x4D, 0x34, 0x56], {offset: 8}) || // M4V
    					check([0x64, 0x61, 0x73, 0x68], {offset: 8}) // DASH
    				)
    		)) {
    		return {
    			ext: 'mp4',
    			mime: 'video/mp4'
    		};
    	}

    	if (check([0x4D, 0x54, 0x68, 0x64])) {
    		return {
    			ext: 'mid',
    			mime: 'audio/midi'
    		};
    	}

    	// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
    	if (check([0x1A, 0x45, 0xDF, 0xA3])) {
    		const sliced = buf.subarray(4, 4 + 4096);
    		const idPos = sliced.findIndex((el, i, arr) => arr[i] === 0x42 && arr[i + 1] === 0x82);

    		if (idPos !== -1) {
    			const docTypePos = idPos + 3;
    			const findDocType = type => [...type].every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));

    			if (findDocType('matroska')) {
    				return {
    					ext: 'mkv',
    					mime: 'video/x-matroska'
    				};
    			}

    			if (findDocType('webm')) {
    				return {
    					ext: 'webm',
    					mime: 'video/webm'
    				};
    			}
    		}
    	}

    	if (check([0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]) ||
    		check([0x66, 0x72, 0x65, 0x65], {offset: 4}) ||
    		check([0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], {offset: 4}) ||
    		check([0x6D, 0x64, 0x61, 0x74], {offset: 4}) || // MJPEG
    		check([0x77, 0x69, 0x64, 0x65], {offset: 4})) {
    		return {
    			ext: 'mov',
    			mime: 'video/quicktime'
    		};
    	}

    	// RIFF file format which might be AVI, WAV, QCP, etc
    	if (check([0x52, 0x49, 0x46, 0x46])) {
    		if (check([0x41, 0x56, 0x49], {offset: 8})) {
    			return {
    				ext: 'avi',
    				mime: 'video/x-msvideo'
    			};
    		}
    		if (check([0x57, 0x41, 0x56, 0x45], {offset: 8})) {
    			return {
    				ext: 'wav',
    				mime: 'audio/x-wav'
    			};
    		}
    		// QLCM, QCP file
    		if (check([0x51, 0x4C, 0x43, 0x4D], {offset: 8})) {
    			return {
    				ext: 'qcp',
    				mime: 'audio/qcelp'
    			};
    		}
    	}

    	if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
    		return {
    			ext: 'wmv',
    			mime: 'video/x-ms-wmv'
    		};
    	}

    	if (
    		check([0x0, 0x0, 0x1, 0xBA]) ||
    		check([0x0, 0x0, 0x1, 0xB3])
    	) {
    		return {
    			ext: 'mpg',
    			mime: 'video/mpeg'
    		};
    	}

    	if (check([0x66, 0x74, 0x79, 0x70, 0x33, 0x67], {offset: 4})) {
    		return {
    			ext: '3gp',
    			mime: 'video/3gpp'
    		};
    	}

    	// Check for MPEG header at different starting offsets
    	for (let start = 0; start < 2 && start < (buf.length - 16); start++) {
    		if (
    			check([0x49, 0x44, 0x33], {offset: start}) || // ID3 header
    			check([0xFF, 0xE2], {offset: start, mask: [0xFF, 0xE2]}) // MPEG 1 or 2 Layer 3 header
    		) {
    			return {
    				ext: 'mp3',
    				mime: 'audio/mpeg'
    			};
    		}

    		if (
    			check([0xFF, 0xE4], {offset: start, mask: [0xFF, 0xE4]}) // MPEG 1 or 2 Layer 2 header
    		) {
    			return {
    				ext: 'mp2',
    				mime: 'audio/mpeg'
    			};
    		}

    		if (
    			check([0xFF, 0xF8], {offset: start, mask: [0xFF, 0xFC]}) // MPEG 2 layer 0 using ADTS
    		) {
    			return {
    				ext: 'mp2',
    				mime: 'audio/mpeg'
    			};
    		}

    		if (
    			check([0xFF, 0xF0], {offset: start, mask: [0xFF, 0xFC]}) // MPEG 4 layer 0 using ADTS
    		) {
    			return {
    				ext: 'mp4',
    				mime: 'audio/mpeg'
    			};
    		}
    	}

    	if (
    		check([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41], {offset: 4}) ||
    		check([0x4D, 0x34, 0x41, 0x20])
    	) {
    		return {
    			ext: 'm4a',
    			mime: 'audio/m4a'
    		};
    	}

    	// Needs to be before `ogg` check
    	if (check([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], {offset: 28})) {
    		return {
    			ext: 'opus',
    			mime: 'audio/opus'
    		};
    	}

    	// If 'OggS' in first  bytes, then OGG container
    	if (check([0x4F, 0x67, 0x67, 0x53])) {
    		// This is a OGG container

    		// If ' theora' in header.
    		if (check([0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61], {offset: 28})) {
    			return {
    				ext: 'ogv',
    				mime: 'video/ogg'
    			};
    		}
    		// If '\x01video' in header.
    		if (check([0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00], {offset: 28})) {
    			return {
    				ext: 'ogm',
    				mime: 'video/ogg'
    			};
    		}
    		// If ' FLAC' in header  https://xiph.org/flac/faq.html
    		if (check([0x7F, 0x46, 0x4C, 0x41, 0x43], {offset: 28})) {
    			return {
    				ext: 'oga',
    				mime: 'audio/ogg'
    			};
    		}

    		// 'Speex  ' in header https://en.wikipedia.org/wiki/Speex
    		if (check([0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20], {offset: 28})) {
    			return {
    				ext: 'spx',
    				mime: 'audio/ogg'
    			};
    		}

    		// If '\x01vorbis' in header
    		if (check([0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73], {offset: 28})) {
    			return {
    				ext: 'ogg',
    				mime: 'audio/ogg'
    			};
    		}

    		// Default OGG container https://www.iana.org/assignments/media-types/application/ogg
    		return {
    			ext: 'ogx',
    			mime: 'application/ogg'
    		};
    	}

    	if (check([0x66, 0x4C, 0x61, 0x43])) {
    		return {
    			ext: 'flac',
    			mime: 'audio/x-flac'
    		};
    	}

    	if (check([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A])) {
    		return {
    			ext: 'amr',
    			mime: 'audio/amr'
    		};
    	}

    	if (check([0x25, 0x50, 0x44, 0x46])) {
    		return {
    			ext: 'pdf',
    			mime: 'application/pdf'
    		};
    	}

    	if (check([0x4D, 0x5A])) {
    		return {
    			ext: 'exe',
    			mime: 'application/x-msdownload'
    		};
    	}

    	if (
    		(buf[0] === 0x43 || buf[0] === 0x46) &&
    		check([0x57, 0x53], {offset: 1})
    	) {
    		return {
    			ext: 'swf',
    			mime: 'application/x-shockwave-flash'
    		};
    	}

    	if (check([0x7B, 0x5C, 0x72, 0x74, 0x66])) {
    		return {
    			ext: 'rtf',
    			mime: 'application/rtf'
    		};
    	}

    	if (check([0x00, 0x61, 0x73, 0x6D])) {
    		return {
    			ext: 'wasm',
    			mime: 'application/wasm'
    		};
    	}

    	if (
    		check([0x77, 0x4F, 0x46, 0x46]) &&
    		(
    			check([0x00, 0x01, 0x00, 0x00], {offset: 4}) ||
    			check([0x4F, 0x54, 0x54, 0x4F], {offset: 4})
    		)
    	) {
    		return {
    			ext: 'woff',
    			mime: 'font/woff'
    		};
    	}

    	if (
    		check([0x77, 0x4F, 0x46, 0x32]) &&
    		(
    			check([0x00, 0x01, 0x00, 0x00], {offset: 4}) ||
    			check([0x4F, 0x54, 0x54, 0x4F], {offset: 4})
    		)
    	) {
    		return {
    			ext: 'woff2',
    			mime: 'font/woff2'
    		};
    	}

    	if (
    		check([0x4C, 0x50], {offset: 34}) &&
    		(
    			check([0x00, 0x00, 0x01], {offset: 8}) ||
    			check([0x01, 0x00, 0x02], {offset: 8}) ||
    			check([0x02, 0x00, 0x02], {offset: 8})
    		)
    	) {
    		return {
    			ext: 'eot',
    			mime: 'application/octet-stream'
    		};
    	}

    	if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
    		return {
    			ext: 'ttf',
    			mime: 'font/ttf'
    		};
    	}

    	if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
    		return {
    			ext: 'otf',
    			mime: 'font/otf'
    		};
    	}

    	if (check([0x00, 0x00, 0x01, 0x00])) {
    		return {
    			ext: 'ico',
    			mime: 'image/x-icon'
    		};
    	}

    	if (check([0x00, 0x00, 0x02, 0x00])) {
    		return {
    			ext: 'cur',
    			mime: 'image/x-icon'
    		};
    	}

    	if (check([0x46, 0x4C, 0x56, 0x01])) {
    		return {
    			ext: 'flv',
    			mime: 'video/x-flv'
    		};
    	}

    	if (check([0x25, 0x21])) {
    		return {
    			ext: 'ps',
    			mime: 'application/postscript'
    		};
    	}

    	if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
    		return {
    			ext: 'xz',
    			mime: 'application/x-xz'
    		};
    	}

    	if (check([0x53, 0x51, 0x4C, 0x69])) {
    		return {
    			ext: 'sqlite',
    			mime: 'application/x-sqlite3'
    		};
    	}

    	if (check([0x4E, 0x45, 0x53, 0x1A])) {
    		return {
    			ext: 'nes',
    			mime: 'application/x-nintendo-nes-rom'
    		};
    	}

    	if (check([0x43, 0x72, 0x32, 0x34])) {
    		return {
    			ext: 'crx',
    			mime: 'application/x-google-chrome-extension'
    		};
    	}

    	if (
    		check([0x4D, 0x53, 0x43, 0x46]) ||
    		check([0x49, 0x53, 0x63, 0x28])
    	) {
    		return {
    			ext: 'cab',
    			mime: 'application/vnd.ms-cab-compressed'
    		};
    	}

    	// Needs to be before `ar` check
    	if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79])) {
    		return {
    			ext: 'deb',
    			mime: 'application/x-deb'
    		};
    	}

    	if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E])) {
    		return {
    			ext: 'ar',
    			mime: 'application/x-unix-archive'
    		};
    	}

    	if (check([0xED, 0xAB, 0xEE, 0xDB])) {
    		return {
    			ext: 'rpm',
    			mime: 'application/x-rpm'
    		};
    	}

    	if (
    		check([0x1F, 0xA0]) ||
    		check([0x1F, 0x9D])
    	) {
    		return {
    			ext: 'Z',
    			mime: 'application/x-compress'
    		};
    	}

    	if (check([0x4C, 0x5A, 0x49, 0x50])) {
    		return {
    			ext: 'lz',
    			mime: 'application/x-lzip'
    		};
    	}

    	if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
    		return {
    			ext: 'msi',
    			mime: 'application/x-msi'
    		};
    	}

    	if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
    		return {
    			ext: 'mxf',
    			mime: 'application/mxf'
    		};
    	}

    	if (check([0x47], {offset: 4}) && (check([0x47], {offset: 192}) || check([0x47], {offset: 196}))) {
    		return {
    			ext: 'mts',
    			mime: 'video/mp2t'
    		};
    	}

    	if (check([0x42, 0x4C, 0x45, 0x4E, 0x44, 0x45, 0x52])) {
    		return {
    			ext: 'blend',
    			mime: 'application/x-blender'
    		};
    	}

    	if (check([0x42, 0x50, 0x47, 0xFB])) {
    		return {
    			ext: 'bpg',
    			mime: 'image/bpg'
    		};
    	}

    	if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
    		// JPEG-2000 family

    		if (check([0x6A, 0x70, 0x32, 0x20], {offset: 20})) {
    			return {
    				ext: 'jp2',
    				mime: 'image/jp2'
    			};
    		}

    		if (check([0x6A, 0x70, 0x78, 0x20], {offset: 20})) {
    			return {
    				ext: 'jpx',
    				mime: 'image/jpx'
    			};
    		}

    		if (check([0x6A, 0x70, 0x6D, 0x20], {offset: 20})) {
    			return {
    				ext: 'jpm',
    				mime: 'image/jpm'
    			};
    		}

    		if (check([0x6D, 0x6A, 0x70, 0x32], {offset: 20})) {
    			return {
    				ext: 'mj2',
    				mime: 'image/mj2'
    			};
    		}
    	}

    	if (check([0x46, 0x4F, 0x52, 0x4D, 0x00])) {
    		return {
    			ext: 'aif',
    			mime: 'audio/aiff'
    		};
    	}

    	if (checkString('<?xml ')) {
    		return {
    			ext: 'xml',
    			mime: 'application/xml'
    		};
    	}

    	if (check([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49], {offset: 60})) {
    		return {
    			ext: 'mobi',
    			mime: 'application/x-mobipocket-ebook'
    		};
    	}

    	// File Type Box (https://en.wikipedia.org/wiki/ISO_base_media_file_format)
    	if (check([0x66, 0x74, 0x79, 0x70], {offset: 4})) {
    		if (check([0x6D, 0x69, 0x66, 0x31], {offset: 8})) {
    			return {
    				ext: 'heic',
    				mime: 'image/heif'
    			};
    		}

    		if (check([0x6D, 0x73, 0x66, 0x31], {offset: 8})) {
    			return {
    				ext: 'heic',
    				mime: 'image/heif-sequence'
    			};
    		}

    		if (check([0x68, 0x65, 0x69, 0x63], {offset: 8}) || check([0x68, 0x65, 0x69, 0x78], {offset: 8})) {
    			return {
    				ext: 'heic',
    				mime: 'image/heic'
    			};
    		}

    		if (check([0x68, 0x65, 0x76, 0x63], {offset: 8}) || check([0x68, 0x65, 0x76, 0x78], {offset: 8})) {
    			return {
    				ext: 'heic',
    				mime: 'image/heic-sequence'
    			};
    		}
    	}

    	return null;
    };
    var fileType_1 = fileType.call;

    var db = {
    	"application/1d-interleaved-parityfec": {
    	source: "iana"
    },
    	"application/3gpdash-qoe-report+xml": {
    	source: "iana"
    },
    	"application/3gpp-ims+xml": {
    	source: "iana"
    },
    	"application/a2l": {
    	source: "iana"
    },
    	"application/activemessage": {
    	source: "iana"
    },
    	"application/alto-costmap+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-costmapfilter+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-directory+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-endpointcost+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-endpointcostparams+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-endpointprop+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-endpointpropparams+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-error+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-networkmap+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/alto-networkmapfilter+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/aml": {
    	source: "iana"
    },
    	"application/andrew-inset": {
    	source: "iana",
    	extensions: [
    		"ez"
    	]
    },
    	"application/applefile": {
    	source: "iana"
    },
    	"application/applixware": {
    	source: "apache",
    	extensions: [
    		"aw"
    	]
    },
    	"application/atf": {
    	source: "iana"
    },
    	"application/atfx": {
    	source: "iana"
    },
    	"application/atom+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"atom"
    	]
    },
    	"application/atomcat+xml": {
    	source: "iana",
    	extensions: [
    		"atomcat"
    	]
    },
    	"application/atomdeleted+xml": {
    	source: "iana"
    },
    	"application/atomicmail": {
    	source: "iana"
    },
    	"application/atomsvc+xml": {
    	source: "iana",
    	extensions: [
    		"atomsvc"
    	]
    },
    	"application/atxml": {
    	source: "iana"
    },
    	"application/auth-policy+xml": {
    	source: "iana"
    },
    	"application/bacnet-xdd+zip": {
    	source: "iana"
    },
    	"application/batch-smtp": {
    	source: "iana"
    },
    	"application/bdoc": {
    	compressible: false,
    	extensions: [
    		"bdoc"
    	]
    },
    	"application/beep+xml": {
    	source: "iana"
    },
    	"application/calendar+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/calendar+xml": {
    	source: "iana"
    },
    	"application/call-completion": {
    	source: "iana"
    },
    	"application/cals-1840": {
    	source: "iana"
    },
    	"application/cbor": {
    	source: "iana"
    },
    	"application/cccex": {
    	source: "iana"
    },
    	"application/ccmp+xml": {
    	source: "iana"
    },
    	"application/ccxml+xml": {
    	source: "iana",
    	extensions: [
    		"ccxml"
    	]
    },
    	"application/cdfx+xml": {
    	source: "iana"
    },
    	"application/cdmi-capability": {
    	source: "iana",
    	extensions: [
    		"cdmia"
    	]
    },
    	"application/cdmi-container": {
    	source: "iana",
    	extensions: [
    		"cdmic"
    	]
    },
    	"application/cdmi-domain": {
    	source: "iana",
    	extensions: [
    		"cdmid"
    	]
    },
    	"application/cdmi-object": {
    	source: "iana",
    	extensions: [
    		"cdmio"
    	]
    },
    	"application/cdmi-queue": {
    	source: "iana",
    	extensions: [
    		"cdmiq"
    	]
    },
    	"application/cdni": {
    	source: "iana"
    },
    	"application/cea": {
    	source: "iana"
    },
    	"application/cea-2018+xml": {
    	source: "iana"
    },
    	"application/cellml+xml": {
    	source: "iana"
    },
    	"application/cfw": {
    	source: "iana"
    },
    	"application/clue_info+xml": {
    	source: "iana"
    },
    	"application/cms": {
    	source: "iana"
    },
    	"application/cnrp+xml": {
    	source: "iana"
    },
    	"application/coap-group+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/coap-payload": {
    	source: "iana"
    },
    	"application/commonground": {
    	source: "iana"
    },
    	"application/conference-info+xml": {
    	source: "iana"
    },
    	"application/cose": {
    	source: "iana"
    },
    	"application/cose-key": {
    	source: "iana"
    },
    	"application/cose-key-set": {
    	source: "iana"
    },
    	"application/cpl+xml": {
    	source: "iana"
    },
    	"application/csrattrs": {
    	source: "iana"
    },
    	"application/csta+xml": {
    	source: "iana"
    },
    	"application/cstadata+xml": {
    	source: "iana"
    },
    	"application/csvm+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/cu-seeme": {
    	source: "apache",
    	extensions: [
    		"cu"
    	]
    },
    	"application/cybercash": {
    	source: "iana"
    },
    	"application/dart": {
    	compressible: true
    },
    	"application/dash+xml": {
    	source: "iana",
    	extensions: [
    		"mpd"
    	]
    },
    	"application/dashdelta": {
    	source: "iana"
    },
    	"application/davmount+xml": {
    	source: "iana",
    	extensions: [
    		"davmount"
    	]
    },
    	"application/dca-rft": {
    	source: "iana"
    },
    	"application/dcd": {
    	source: "iana"
    },
    	"application/dec-dx": {
    	source: "iana"
    },
    	"application/dialog-info+xml": {
    	source: "iana"
    },
    	"application/dicom": {
    	source: "iana"
    },
    	"application/dicom+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/dicom+xml": {
    	source: "iana"
    },
    	"application/dii": {
    	source: "iana"
    },
    	"application/dit": {
    	source: "iana"
    },
    	"application/dns": {
    	source: "iana"
    },
    	"application/docbook+xml": {
    	source: "apache",
    	extensions: [
    		"dbk"
    	]
    },
    	"application/dskpp+xml": {
    	source: "iana"
    },
    	"application/dssc+der": {
    	source: "iana",
    	extensions: [
    		"dssc"
    	]
    },
    	"application/dssc+xml": {
    	source: "iana",
    	extensions: [
    		"xdssc"
    	]
    },
    	"application/dvcs": {
    	source: "iana"
    },
    	"application/ecmascript": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"ecma"
    	]
    },
    	"application/edi-consent": {
    	source: "iana"
    },
    	"application/edi-x12": {
    	source: "iana",
    	compressible: false
    },
    	"application/edifact": {
    	source: "iana",
    	compressible: false
    },
    	"application/efi": {
    	source: "iana"
    },
    	"application/emergencycalldata.comment+xml": {
    	source: "iana"
    },
    	"application/emergencycalldata.control+xml": {
    	source: "iana"
    },
    	"application/emergencycalldata.deviceinfo+xml": {
    	source: "iana"
    },
    	"application/emergencycalldata.ecall.msd": {
    	source: "iana"
    },
    	"application/emergencycalldata.providerinfo+xml": {
    	source: "iana"
    },
    	"application/emergencycalldata.serviceinfo+xml": {
    	source: "iana"
    },
    	"application/emergencycalldata.subscriberinfo+xml": {
    	source: "iana"
    },
    	"application/emergencycalldata.veds+xml": {
    	source: "iana"
    },
    	"application/emma+xml": {
    	source: "iana",
    	extensions: [
    		"emma"
    	]
    },
    	"application/emotionml+xml": {
    	source: "iana"
    },
    	"application/encaprtp": {
    	source: "iana"
    },
    	"application/epp+xml": {
    	source: "iana"
    },
    	"application/epub+zip": {
    	source: "iana",
    	extensions: [
    		"epub"
    	]
    },
    	"application/eshop": {
    	source: "iana"
    },
    	"application/exi": {
    	source: "iana",
    	extensions: [
    		"exi"
    	]
    },
    	"application/fastinfoset": {
    	source: "iana"
    },
    	"application/fastsoap": {
    	source: "iana"
    },
    	"application/fdt+xml": {
    	source: "iana"
    },
    	"application/fhir+xml": {
    	source: "iana"
    },
    	"application/fido.trusted-apps+json": {
    	compressible: true
    },
    	"application/fits": {
    	source: "iana"
    },
    	"application/font-sfnt": {
    	source: "iana"
    },
    	"application/font-tdpfr": {
    	source: "iana",
    	extensions: [
    		"pfr"
    	]
    },
    	"application/font-woff": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"woff"
    	]
    },
    	"application/framework-attributes+xml": {
    	source: "iana"
    },
    	"application/geo+json": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"geojson"
    	]
    },
    	"application/geo+json-seq": {
    	source: "iana"
    },
    	"application/geoxacml+xml": {
    	source: "iana"
    },
    	"application/gml+xml": {
    	source: "iana",
    	extensions: [
    		"gml"
    	]
    },
    	"application/gpx+xml": {
    	source: "apache",
    	extensions: [
    		"gpx"
    	]
    },
    	"application/gxf": {
    	source: "apache",
    	extensions: [
    		"gxf"
    	]
    },
    	"application/gzip": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"gz"
    	]
    },
    	"application/h224": {
    	source: "iana"
    },
    	"application/held+xml": {
    	source: "iana"
    },
    	"application/hjson": {
    	extensions: [
    		"hjson"
    	]
    },
    	"application/http": {
    	source: "iana"
    },
    	"application/hyperstudio": {
    	source: "iana",
    	extensions: [
    		"stk"
    	]
    },
    	"application/ibe-key-request+xml": {
    	source: "iana"
    },
    	"application/ibe-pkg-reply+xml": {
    	source: "iana"
    },
    	"application/ibe-pp-data": {
    	source: "iana"
    },
    	"application/iges": {
    	source: "iana"
    },
    	"application/im-iscomposing+xml": {
    	source: "iana"
    },
    	"application/index": {
    	source: "iana"
    },
    	"application/index.cmd": {
    	source: "iana"
    },
    	"application/index.obj": {
    	source: "iana"
    },
    	"application/index.response": {
    	source: "iana"
    },
    	"application/index.vnd": {
    	source: "iana"
    },
    	"application/inkml+xml": {
    	source: "iana",
    	extensions: [
    		"ink",
    		"inkml"
    	]
    },
    	"application/iotp": {
    	source: "iana"
    },
    	"application/ipfix": {
    	source: "iana",
    	extensions: [
    		"ipfix"
    	]
    },
    	"application/ipp": {
    	source: "iana"
    },
    	"application/isup": {
    	source: "iana"
    },
    	"application/its+xml": {
    	source: "iana"
    },
    	"application/java-archive": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"jar",
    		"war",
    		"ear"
    	]
    },
    	"application/java-serialized-object": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"ser"
    	]
    },
    	"application/java-vm": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"class"
    	]
    },
    	"application/javascript": {
    	source: "iana",
    	charset: "UTF-8",
    	compressible: true,
    	extensions: [
    		"js",
    		"mjs"
    	]
    },
    	"application/jf2feed+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/jose": {
    	source: "iana"
    },
    	"application/jose+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/jrd+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/json": {
    	source: "iana",
    	charset: "UTF-8",
    	compressible: true,
    	extensions: [
    		"json",
    		"map"
    	]
    },
    	"application/json-patch+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/json-seq": {
    	source: "iana"
    },
    	"application/json5": {
    	extensions: [
    		"json5"
    	]
    },
    	"application/jsonml+json": {
    	source: "apache",
    	compressible: true,
    	extensions: [
    		"jsonml"
    	]
    },
    	"application/jwk+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/jwk-set+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/jwt": {
    	source: "iana"
    },
    	"application/kpml-request+xml": {
    	source: "iana"
    },
    	"application/kpml-response+xml": {
    	source: "iana"
    },
    	"application/ld+json": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"jsonld"
    	]
    },
    	"application/lgr+xml": {
    	source: "iana"
    },
    	"application/link-format": {
    	source: "iana"
    },
    	"application/load-control+xml": {
    	source: "iana"
    },
    	"application/lost+xml": {
    	source: "iana",
    	extensions: [
    		"lostxml"
    	]
    },
    	"application/lostsync+xml": {
    	source: "iana"
    },
    	"application/lxf": {
    	source: "iana"
    },
    	"application/mac-binhex40": {
    	source: "iana",
    	extensions: [
    		"hqx"
    	]
    },
    	"application/mac-compactpro": {
    	source: "apache",
    	extensions: [
    		"cpt"
    	]
    },
    	"application/macwriteii": {
    	source: "iana"
    },
    	"application/mads+xml": {
    	source: "iana",
    	extensions: [
    		"mads"
    	]
    },
    	"application/manifest+json": {
    	charset: "UTF-8",
    	compressible: true,
    	extensions: [
    		"webmanifest"
    	]
    },
    	"application/marc": {
    	source: "iana",
    	extensions: [
    		"mrc"
    	]
    },
    	"application/marcxml+xml": {
    	source: "iana",
    	extensions: [
    		"mrcx"
    	]
    },
    	"application/mathematica": {
    	source: "iana",
    	extensions: [
    		"ma",
    		"nb",
    		"mb"
    	]
    },
    	"application/mathml+xml": {
    	source: "iana",
    	extensions: [
    		"mathml"
    	]
    },
    	"application/mathml-content+xml": {
    	source: "iana"
    },
    	"application/mathml-presentation+xml": {
    	source: "iana"
    },
    	"application/mbms-associated-procedure-description+xml": {
    	source: "iana"
    },
    	"application/mbms-deregister+xml": {
    	source: "iana"
    },
    	"application/mbms-envelope+xml": {
    	source: "iana"
    },
    	"application/mbms-msk+xml": {
    	source: "iana"
    },
    	"application/mbms-msk-response+xml": {
    	source: "iana"
    },
    	"application/mbms-protection-description+xml": {
    	source: "iana"
    },
    	"application/mbms-reception-report+xml": {
    	source: "iana"
    },
    	"application/mbms-register+xml": {
    	source: "iana"
    },
    	"application/mbms-register-response+xml": {
    	source: "iana"
    },
    	"application/mbms-schedule+xml": {
    	source: "iana"
    },
    	"application/mbms-user-service-description+xml": {
    	source: "iana"
    },
    	"application/mbox": {
    	source: "iana",
    	extensions: [
    		"mbox"
    	]
    },
    	"application/media-policy-dataset+xml": {
    	source: "iana"
    },
    	"application/media_control+xml": {
    	source: "iana"
    },
    	"application/mediaservercontrol+xml": {
    	source: "iana",
    	extensions: [
    		"mscml"
    	]
    },
    	"application/merge-patch+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/metalink+xml": {
    	source: "apache",
    	extensions: [
    		"metalink"
    	]
    },
    	"application/metalink4+xml": {
    	source: "iana",
    	extensions: [
    		"meta4"
    	]
    },
    	"application/mets+xml": {
    	source: "iana",
    	extensions: [
    		"mets"
    	]
    },
    	"application/mf4": {
    	source: "iana"
    },
    	"application/mikey": {
    	source: "iana"
    },
    	"application/mmt-usd+xml": {
    	source: "iana"
    },
    	"application/mods+xml": {
    	source: "iana",
    	extensions: [
    		"mods"
    	]
    },
    	"application/moss-keys": {
    	source: "iana"
    },
    	"application/moss-signature": {
    	source: "iana"
    },
    	"application/mosskey-data": {
    	source: "iana"
    },
    	"application/mosskey-request": {
    	source: "iana"
    },
    	"application/mp21": {
    	source: "iana",
    	extensions: [
    		"m21",
    		"mp21"
    	]
    },
    	"application/mp4": {
    	source: "iana",
    	extensions: [
    		"mp4s",
    		"m4p"
    	]
    },
    	"application/mpeg4-generic": {
    	source: "iana"
    },
    	"application/mpeg4-iod": {
    	source: "iana"
    },
    	"application/mpeg4-iod-xmt": {
    	source: "iana"
    },
    	"application/mrb-consumer+xml": {
    	source: "iana"
    },
    	"application/mrb-publish+xml": {
    	source: "iana"
    },
    	"application/msc-ivr+xml": {
    	source: "iana"
    },
    	"application/msc-mixer+xml": {
    	source: "iana"
    },
    	"application/msword": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"doc",
    		"dot"
    	]
    },
    	"application/mud+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/mxf": {
    	source: "iana",
    	extensions: [
    		"mxf"
    	]
    },
    	"application/n-quads": {
    	source: "iana"
    },
    	"application/n-triples": {
    	source: "iana"
    },
    	"application/nasdata": {
    	source: "iana"
    },
    	"application/news-checkgroups": {
    	source: "iana"
    },
    	"application/news-groupinfo": {
    	source: "iana"
    },
    	"application/news-transmission": {
    	source: "iana"
    },
    	"application/nlsml+xml": {
    	source: "iana"
    },
    	"application/node": {
    	source: "iana"
    },
    	"application/nss": {
    	source: "iana"
    },
    	"application/ocsp-request": {
    	source: "iana"
    },
    	"application/ocsp-response": {
    	source: "iana"
    },
    	"application/octet-stream": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"bin",
    		"dms",
    		"lrf",
    		"mar",
    		"so",
    		"dist",
    		"distz",
    		"pkg",
    		"bpk",
    		"dump",
    		"elc",
    		"deploy",
    		"exe",
    		"dll",
    		"deb",
    		"dmg",
    		"iso",
    		"img",
    		"msi",
    		"msp",
    		"msm",
    		"buffer"
    	]
    },
    	"application/oda": {
    	source: "iana",
    	extensions: [
    		"oda"
    	]
    },
    	"application/odx": {
    	source: "iana"
    },
    	"application/oebps-package+xml": {
    	source: "iana",
    	extensions: [
    		"opf"
    	]
    },
    	"application/ogg": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"ogx"
    	]
    },
    	"application/omdoc+xml": {
    	source: "apache",
    	extensions: [
    		"omdoc"
    	]
    },
    	"application/onenote": {
    	source: "apache",
    	extensions: [
    		"onetoc",
    		"onetoc2",
    		"onetmp",
    		"onepkg"
    	]
    },
    	"application/oxps": {
    	source: "iana",
    	extensions: [
    		"oxps"
    	]
    },
    	"application/p2p-overlay+xml": {
    	source: "iana"
    },
    	"application/parityfec": {
    	source: "iana"
    },
    	"application/passport": {
    	source: "iana"
    },
    	"application/patch-ops-error+xml": {
    	source: "iana",
    	extensions: [
    		"xer"
    	]
    },
    	"application/pdf": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"pdf"
    	]
    },
    	"application/pdx": {
    	source: "iana"
    },
    	"application/pgp-encrypted": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"pgp"
    	]
    },
    	"application/pgp-keys": {
    	source: "iana"
    },
    	"application/pgp-signature": {
    	source: "iana",
    	extensions: [
    		"asc",
    		"sig"
    	]
    },
    	"application/pics-rules": {
    	source: "apache",
    	extensions: [
    		"prf"
    	]
    },
    	"application/pidf+xml": {
    	source: "iana"
    },
    	"application/pidf-diff+xml": {
    	source: "iana"
    },
    	"application/pkcs10": {
    	source: "iana",
    	extensions: [
    		"p10"
    	]
    },
    	"application/pkcs12": {
    	source: "iana"
    },
    	"application/pkcs7-mime": {
    	source: "iana",
    	extensions: [
    		"p7m",
    		"p7c"
    	]
    },
    	"application/pkcs7-signature": {
    	source: "iana",
    	extensions: [
    		"p7s"
    	]
    },
    	"application/pkcs8": {
    	source: "iana",
    	extensions: [
    		"p8"
    	]
    },
    	"application/pkcs8-encrypted": {
    	source: "iana"
    },
    	"application/pkix-attr-cert": {
    	source: "iana",
    	extensions: [
    		"ac"
    	]
    },
    	"application/pkix-cert": {
    	source: "iana",
    	extensions: [
    		"cer"
    	]
    },
    	"application/pkix-crl": {
    	source: "iana",
    	extensions: [
    		"crl"
    	]
    },
    	"application/pkix-pkipath": {
    	source: "iana",
    	extensions: [
    		"pkipath"
    	]
    },
    	"application/pkixcmp": {
    	source: "iana",
    	extensions: [
    		"pki"
    	]
    },
    	"application/pls+xml": {
    	source: "iana",
    	extensions: [
    		"pls"
    	]
    },
    	"application/poc-settings+xml": {
    	source: "iana"
    },
    	"application/postscript": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"ai",
    		"eps",
    		"ps"
    	]
    },
    	"application/ppsp-tracker+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/problem+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/problem+xml": {
    	source: "iana"
    },
    	"application/provenance+xml": {
    	source: "iana"
    },
    	"application/prs.alvestrand.titrax-sheet": {
    	source: "iana"
    },
    	"application/prs.cww": {
    	source: "iana",
    	extensions: [
    		"cww"
    	]
    },
    	"application/prs.hpub+zip": {
    	source: "iana"
    },
    	"application/prs.nprend": {
    	source: "iana"
    },
    	"application/prs.plucker": {
    	source: "iana"
    },
    	"application/prs.rdf-xml-crypt": {
    	source: "iana"
    },
    	"application/prs.xsf+xml": {
    	source: "iana"
    },
    	"application/pskc+xml": {
    	source: "iana",
    	extensions: [
    		"pskcxml"
    	]
    },
    	"application/qsig": {
    	source: "iana"
    },
    	"application/raml+yaml": {
    	compressible: true,
    	extensions: [
    		"raml"
    	]
    },
    	"application/raptorfec": {
    	source: "iana"
    },
    	"application/rdap+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/rdf+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"rdf"
    	]
    },
    	"application/reginfo+xml": {
    	source: "iana",
    	extensions: [
    		"rif"
    	]
    },
    	"application/relax-ng-compact-syntax": {
    	source: "iana",
    	extensions: [
    		"rnc"
    	]
    },
    	"application/remote-printing": {
    	source: "iana"
    },
    	"application/reputon+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/resource-lists+xml": {
    	source: "iana",
    	extensions: [
    		"rl"
    	]
    },
    	"application/resource-lists-diff+xml": {
    	source: "iana",
    	extensions: [
    		"rld"
    	]
    },
    	"application/rfc+xml": {
    	source: "iana"
    },
    	"application/riscos": {
    	source: "iana"
    },
    	"application/rlmi+xml": {
    	source: "iana"
    },
    	"application/rls-services+xml": {
    	source: "iana",
    	extensions: [
    		"rs"
    	]
    },
    	"application/route-apd+xml": {
    	source: "iana"
    },
    	"application/route-s-tsid+xml": {
    	source: "iana"
    },
    	"application/route-usd+xml": {
    	source: "iana"
    },
    	"application/rpki-ghostbusters": {
    	source: "iana",
    	extensions: [
    		"gbr"
    	]
    },
    	"application/rpki-manifest": {
    	source: "iana",
    	extensions: [
    		"mft"
    	]
    },
    	"application/rpki-publication": {
    	source: "iana"
    },
    	"application/rpki-roa": {
    	source: "iana",
    	extensions: [
    		"roa"
    	]
    },
    	"application/rpki-updown": {
    	source: "iana"
    },
    	"application/rsd+xml": {
    	source: "apache",
    	extensions: [
    		"rsd"
    	]
    },
    	"application/rss+xml": {
    	source: "apache",
    	compressible: true,
    	extensions: [
    		"rss"
    	]
    },
    	"application/rtf": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"rtf"
    	]
    },
    	"application/rtploopback": {
    	source: "iana"
    },
    	"application/rtx": {
    	source: "iana"
    },
    	"application/samlassertion+xml": {
    	source: "iana"
    },
    	"application/samlmetadata+xml": {
    	source: "iana"
    },
    	"application/sbml+xml": {
    	source: "iana",
    	extensions: [
    		"sbml"
    	]
    },
    	"application/scaip+xml": {
    	source: "iana"
    },
    	"application/scim+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/scvp-cv-request": {
    	source: "iana",
    	extensions: [
    		"scq"
    	]
    },
    	"application/scvp-cv-response": {
    	source: "iana",
    	extensions: [
    		"scs"
    	]
    },
    	"application/scvp-vp-request": {
    	source: "iana",
    	extensions: [
    		"spq"
    	]
    },
    	"application/scvp-vp-response": {
    	source: "iana",
    	extensions: [
    		"spp"
    	]
    },
    	"application/sdp": {
    	source: "iana",
    	extensions: [
    		"sdp"
    	]
    },
    	"application/sep+xml": {
    	source: "iana"
    },
    	"application/sep-exi": {
    	source: "iana"
    },
    	"application/session-info": {
    	source: "iana"
    },
    	"application/set-payment": {
    	source: "iana"
    },
    	"application/set-payment-initiation": {
    	source: "iana",
    	extensions: [
    		"setpay"
    	]
    },
    	"application/set-registration": {
    	source: "iana"
    },
    	"application/set-registration-initiation": {
    	source: "iana",
    	extensions: [
    		"setreg"
    	]
    },
    	"application/sgml": {
    	source: "iana"
    },
    	"application/sgml-open-catalog": {
    	source: "iana"
    },
    	"application/shf+xml": {
    	source: "iana",
    	extensions: [
    		"shf"
    	]
    },
    	"application/sieve": {
    	source: "iana"
    },
    	"application/simple-filter+xml": {
    	source: "iana"
    },
    	"application/simple-message-summary": {
    	source: "iana"
    },
    	"application/simplesymbolcontainer": {
    	source: "iana"
    },
    	"application/slate": {
    	source: "iana"
    },
    	"application/smil": {
    	source: "iana"
    },
    	"application/smil+xml": {
    	source: "iana",
    	extensions: [
    		"smi",
    		"smil"
    	]
    },
    	"application/smpte336m": {
    	source: "iana"
    },
    	"application/soap+fastinfoset": {
    	source: "iana"
    },
    	"application/soap+xml": {
    	source: "iana",
    	compressible: true
    },
    	"application/sparql-query": {
    	source: "iana",
    	extensions: [
    		"rq"
    	]
    },
    	"application/sparql-results+xml": {
    	source: "iana",
    	extensions: [
    		"srx"
    	]
    },
    	"application/spirits-event+xml": {
    	source: "iana"
    },
    	"application/sql": {
    	source: "iana"
    },
    	"application/srgs": {
    	source: "iana",
    	extensions: [
    		"gram"
    	]
    },
    	"application/srgs+xml": {
    	source: "iana",
    	extensions: [
    		"grxml"
    	]
    },
    	"application/sru+xml": {
    	source: "iana",
    	extensions: [
    		"sru"
    	]
    },
    	"application/ssdl+xml": {
    	source: "apache",
    	extensions: [
    		"ssdl"
    	]
    },
    	"application/ssml+xml": {
    	source: "iana",
    	extensions: [
    		"ssml"
    	]
    },
    	"application/tamp-apex-update": {
    	source: "iana"
    },
    	"application/tamp-apex-update-confirm": {
    	source: "iana"
    },
    	"application/tamp-community-update": {
    	source: "iana"
    },
    	"application/tamp-community-update-confirm": {
    	source: "iana"
    },
    	"application/tamp-error": {
    	source: "iana"
    },
    	"application/tamp-sequence-adjust": {
    	source: "iana"
    },
    	"application/tamp-sequence-adjust-confirm": {
    	source: "iana"
    },
    	"application/tamp-status-query": {
    	source: "iana"
    },
    	"application/tamp-status-response": {
    	source: "iana"
    },
    	"application/tamp-update": {
    	source: "iana"
    },
    	"application/tamp-update-confirm": {
    	source: "iana"
    },
    	"application/tar": {
    	compressible: true
    },
    	"application/tei+xml": {
    	source: "iana",
    	extensions: [
    		"tei",
    		"teicorpus"
    	]
    },
    	"application/thraud+xml": {
    	source: "iana",
    	extensions: [
    		"tfi"
    	]
    },
    	"application/timestamp-query": {
    	source: "iana"
    },
    	"application/timestamp-reply": {
    	source: "iana"
    },
    	"application/timestamped-data": {
    	source: "iana",
    	extensions: [
    		"tsd"
    	]
    },
    	"application/tnauthlist": {
    	source: "iana"
    },
    	"application/trig": {
    	source: "iana"
    },
    	"application/ttml+xml": {
    	source: "iana"
    },
    	"application/tve-trigger": {
    	source: "iana"
    },
    	"application/ulpfec": {
    	source: "iana"
    },
    	"application/urc-grpsheet+xml": {
    	source: "iana"
    },
    	"application/urc-ressheet+xml": {
    	source: "iana"
    },
    	"application/urc-targetdesc+xml": {
    	source: "iana"
    },
    	"application/urc-uisocketdesc+xml": {
    	source: "iana"
    },
    	"application/vcard+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vcard+xml": {
    	source: "iana"
    },
    	"application/vemmi": {
    	source: "iana"
    },
    	"application/vividence.scriptfile": {
    	source: "apache"
    },
    	"application/vnd.1000minds.decision-model+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp-prose+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp-prose-pc3ch+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp-v2x-local-service-information": {
    	source: "iana"
    },
    	"application/vnd.3gpp.access-transfer-events+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.bsf+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.gmop+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mcptt-affiliation-command+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mcptt-floor-request+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mcptt-info+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mcptt-location-info+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mcptt-signed+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.mid-call+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.pic-bw-large": {
    	source: "iana",
    	extensions: [
    		"plb"
    	]
    },
    	"application/vnd.3gpp.pic-bw-small": {
    	source: "iana",
    	extensions: [
    		"psb"
    	]
    },
    	"application/vnd.3gpp.pic-bw-var": {
    	source: "iana",
    	extensions: [
    		"pvb"
    	]
    },
    	"application/vnd.3gpp.sms": {
    	source: "iana"
    },
    	"application/vnd.3gpp.sms+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.srvcc-ext+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.srvcc-info+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.state-and-event-info+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp.ussd+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp2.bcmcsinfo+xml": {
    	source: "iana"
    },
    	"application/vnd.3gpp2.sms": {
    	source: "iana"
    },
    	"application/vnd.3gpp2.tcap": {
    	source: "iana",
    	extensions: [
    		"tcap"
    	]
    },
    	"application/vnd.3lightssoftware.imagescal": {
    	source: "iana"
    },
    	"application/vnd.3m.post-it-notes": {
    	source: "iana",
    	extensions: [
    		"pwn"
    	]
    },
    	"application/vnd.accpac.simply.aso": {
    	source: "iana",
    	extensions: [
    		"aso"
    	]
    },
    	"application/vnd.accpac.simply.imp": {
    	source: "iana",
    	extensions: [
    		"imp"
    	]
    },
    	"application/vnd.acucobol": {
    	source: "iana",
    	extensions: [
    		"acu"
    	]
    },
    	"application/vnd.acucorp": {
    	source: "iana",
    	extensions: [
    		"atc",
    		"acutc"
    	]
    },
    	"application/vnd.adobe.air-application-installer-package+zip": {
    	source: "apache",
    	extensions: [
    		"air"
    	]
    },
    	"application/vnd.adobe.flash.movie": {
    	source: "iana"
    },
    	"application/vnd.adobe.formscentral.fcdt": {
    	source: "iana",
    	extensions: [
    		"fcdt"
    	]
    },
    	"application/vnd.adobe.fxp": {
    	source: "iana",
    	extensions: [
    		"fxp",
    		"fxpl"
    	]
    },
    	"application/vnd.adobe.partial-upload": {
    	source: "iana"
    },
    	"application/vnd.adobe.xdp+xml": {
    	source: "iana",
    	extensions: [
    		"xdp"
    	]
    },
    	"application/vnd.adobe.xfdf": {
    	source: "iana",
    	extensions: [
    		"xfdf"
    	]
    },
    	"application/vnd.aether.imp": {
    	source: "iana"
    },
    	"application/vnd.ah-barcode": {
    	source: "iana"
    },
    	"application/vnd.ahead.space": {
    	source: "iana",
    	extensions: [
    		"ahead"
    	]
    },
    	"application/vnd.airzip.filesecure.azf": {
    	source: "iana",
    	extensions: [
    		"azf"
    	]
    },
    	"application/vnd.airzip.filesecure.azs": {
    	source: "iana",
    	extensions: [
    		"azs"
    	]
    },
    	"application/vnd.amadeus+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.amazon.ebook": {
    	source: "apache",
    	extensions: [
    		"azw"
    	]
    },
    	"application/vnd.amazon.mobi8-ebook": {
    	source: "iana"
    },
    	"application/vnd.americandynamics.acc": {
    	source: "iana",
    	extensions: [
    		"acc"
    	]
    },
    	"application/vnd.amiga.ami": {
    	source: "iana",
    	extensions: [
    		"ami"
    	]
    },
    	"application/vnd.amundsen.maze+xml": {
    	source: "iana"
    },
    	"application/vnd.android.package-archive": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"apk"
    	]
    },
    	"application/vnd.anki": {
    	source: "iana"
    },
    	"application/vnd.anser-web-certificate-issue-initiation": {
    	source: "iana",
    	extensions: [
    		"cii"
    	]
    },
    	"application/vnd.anser-web-funds-transfer-initiation": {
    	source: "apache",
    	extensions: [
    		"fti"
    	]
    },
    	"application/vnd.antix.game-component": {
    	source: "iana",
    	extensions: [
    		"atx"
    	]
    },
    	"application/vnd.apache.thrift.binary": {
    	source: "iana"
    },
    	"application/vnd.apache.thrift.compact": {
    	source: "iana"
    },
    	"application/vnd.apache.thrift.json": {
    	source: "iana"
    },
    	"application/vnd.api+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.apothekende.reservation+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.apple.installer+xml": {
    	source: "iana",
    	extensions: [
    		"mpkg"
    	]
    },
    	"application/vnd.apple.mpegurl": {
    	source: "iana",
    	extensions: [
    		"m3u8"
    	]
    },
    	"application/vnd.apple.pkpass": {
    	compressible: false,
    	extensions: [
    		"pkpass"
    	]
    },
    	"application/vnd.arastra.swi": {
    	source: "iana"
    },
    	"application/vnd.aristanetworks.swi": {
    	source: "iana",
    	extensions: [
    		"swi"
    	]
    },
    	"application/vnd.artsquare": {
    	source: "iana"
    },
    	"application/vnd.astraea-software.iota": {
    	source: "iana",
    	extensions: [
    		"iota"
    	]
    },
    	"application/vnd.audiograph": {
    	source: "iana",
    	extensions: [
    		"aep"
    	]
    },
    	"application/vnd.autopackage": {
    	source: "iana"
    },
    	"application/vnd.avalon+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.avistar+xml": {
    	source: "iana"
    },
    	"application/vnd.balsamiq.bmml+xml": {
    	source: "iana"
    },
    	"application/vnd.balsamiq.bmpr": {
    	source: "iana"
    },
    	"application/vnd.bbf.usp.msg": {
    	source: "iana"
    },
    	"application/vnd.bbf.usp.msg+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.bekitzur-stech+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.bint.med-content": {
    	source: "iana"
    },
    	"application/vnd.biopax.rdf+xml": {
    	source: "iana"
    },
    	"application/vnd.blink-idb-value-wrapper": {
    	source: "iana"
    },
    	"application/vnd.blueice.multipass": {
    	source: "iana",
    	extensions: [
    		"mpm"
    	]
    },
    	"application/vnd.bluetooth.ep.oob": {
    	source: "iana"
    },
    	"application/vnd.bluetooth.le.oob": {
    	source: "iana"
    },
    	"application/vnd.bmi": {
    	source: "iana",
    	extensions: [
    		"bmi"
    	]
    },
    	"application/vnd.businessobjects": {
    	source: "iana",
    	extensions: [
    		"rep"
    	]
    },
    	"application/vnd.cab-jscript": {
    	source: "iana"
    },
    	"application/vnd.canon-cpdl": {
    	source: "iana"
    },
    	"application/vnd.canon-lips": {
    	source: "iana"
    },
    	"application/vnd.capasystems-pg+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.cendio.thinlinc.clientconf": {
    	source: "iana"
    },
    	"application/vnd.century-systems.tcp_stream": {
    	source: "iana"
    },
    	"application/vnd.chemdraw+xml": {
    	source: "iana",
    	extensions: [
    		"cdxml"
    	]
    },
    	"application/vnd.chess-pgn": {
    	source: "iana"
    },
    	"application/vnd.chipnuts.karaoke-mmd": {
    	source: "iana",
    	extensions: [
    		"mmd"
    	]
    },
    	"application/vnd.cinderella": {
    	source: "iana",
    	extensions: [
    		"cdy"
    	]
    },
    	"application/vnd.cirpack.isdn-ext": {
    	source: "iana"
    },
    	"application/vnd.citationstyles.style+xml": {
    	source: "iana"
    },
    	"application/vnd.claymore": {
    	source: "iana",
    	extensions: [
    		"cla"
    	]
    },
    	"application/vnd.cloanto.rp9": {
    	source: "iana",
    	extensions: [
    		"rp9"
    	]
    },
    	"application/vnd.clonk.c4group": {
    	source: "iana",
    	extensions: [
    		"c4g",
    		"c4d",
    		"c4f",
    		"c4p",
    		"c4u"
    	]
    },
    	"application/vnd.cluetrust.cartomobile-config": {
    	source: "iana",
    	extensions: [
    		"c11amc"
    	]
    },
    	"application/vnd.cluetrust.cartomobile-config-pkg": {
    	source: "iana",
    	extensions: [
    		"c11amz"
    	]
    },
    	"application/vnd.coffeescript": {
    	source: "iana"
    },
    	"application/vnd.collabio.xodocuments.document": {
    	source: "iana"
    },
    	"application/vnd.collabio.xodocuments.document-template": {
    	source: "iana"
    },
    	"application/vnd.collabio.xodocuments.presentation": {
    	source: "iana"
    },
    	"application/vnd.collabio.xodocuments.presentation-template": {
    	source: "iana"
    },
    	"application/vnd.collabio.xodocuments.spreadsheet": {
    	source: "iana"
    },
    	"application/vnd.collabio.xodocuments.spreadsheet-template": {
    	source: "iana"
    },
    	"application/vnd.collection+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.collection.doc+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.collection.next+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.comicbook+zip": {
    	source: "iana"
    },
    	"application/vnd.comicbook-rar": {
    	source: "iana"
    },
    	"application/vnd.commerce-battelle": {
    	source: "iana"
    },
    	"application/vnd.commonspace": {
    	source: "iana",
    	extensions: [
    		"csp"
    	]
    },
    	"application/vnd.contact.cmsg": {
    	source: "iana",
    	extensions: [
    		"cdbcmsg"
    	]
    },
    	"application/vnd.coreos.ignition+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.cosmocaller": {
    	source: "iana",
    	extensions: [
    		"cmc"
    	]
    },
    	"application/vnd.crick.clicker": {
    	source: "iana",
    	extensions: [
    		"clkx"
    	]
    },
    	"application/vnd.crick.clicker.keyboard": {
    	source: "iana",
    	extensions: [
    		"clkk"
    	]
    },
    	"application/vnd.crick.clicker.palette": {
    	source: "iana",
    	extensions: [
    		"clkp"
    	]
    },
    	"application/vnd.crick.clicker.template": {
    	source: "iana",
    	extensions: [
    		"clkt"
    	]
    },
    	"application/vnd.crick.clicker.wordbank": {
    	source: "iana",
    	extensions: [
    		"clkw"
    	]
    },
    	"application/vnd.criticaltools.wbs+xml": {
    	source: "iana",
    	extensions: [
    		"wbs"
    	]
    },
    	"application/vnd.ctc-posml": {
    	source: "iana",
    	extensions: [
    		"pml"
    	]
    },
    	"application/vnd.ctct.ws+xml": {
    	source: "iana"
    },
    	"application/vnd.cups-pdf": {
    	source: "iana"
    },
    	"application/vnd.cups-postscript": {
    	source: "iana"
    },
    	"application/vnd.cups-ppd": {
    	source: "iana",
    	extensions: [
    		"ppd"
    	]
    },
    	"application/vnd.cups-raster": {
    	source: "iana"
    },
    	"application/vnd.cups-raw": {
    	source: "iana"
    },
    	"application/vnd.curl": {
    	source: "iana"
    },
    	"application/vnd.curl.car": {
    	source: "apache",
    	extensions: [
    		"car"
    	]
    },
    	"application/vnd.curl.pcurl": {
    	source: "apache",
    	extensions: [
    		"pcurl"
    	]
    },
    	"application/vnd.cyan.dean.root+xml": {
    	source: "iana"
    },
    	"application/vnd.cybank": {
    	source: "iana"
    },
    	"application/vnd.d2l.coursepackage1p0+zip": {
    	source: "iana"
    },
    	"application/vnd.dart": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"dart"
    	]
    },
    	"application/vnd.data-vision.rdz": {
    	source: "iana",
    	extensions: [
    		"rdz"
    	]
    },
    	"application/vnd.datapackage+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.dataresource+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.debian.binary-package": {
    	source: "iana"
    },
    	"application/vnd.dece.data": {
    	source: "iana",
    	extensions: [
    		"uvf",
    		"uvvf",
    		"uvd",
    		"uvvd"
    	]
    },
    	"application/vnd.dece.ttml+xml": {
    	source: "iana",
    	extensions: [
    		"uvt",
    		"uvvt"
    	]
    },
    	"application/vnd.dece.unspecified": {
    	source: "iana",
    	extensions: [
    		"uvx",
    		"uvvx"
    	]
    },
    	"application/vnd.dece.zip": {
    	source: "iana",
    	extensions: [
    		"uvz",
    		"uvvz"
    	]
    },
    	"application/vnd.denovo.fcselayout-link": {
    	source: "iana",
    	extensions: [
    		"fe_launch"
    	]
    },
    	"application/vnd.desmume-movie": {
    	source: "iana"
    },
    	"application/vnd.desmume.movie": {
    	source: "apache"
    },
    	"application/vnd.dir-bi.plate-dl-nosuffix": {
    	source: "iana"
    },
    	"application/vnd.dm.delegation+xml": {
    	source: "iana"
    },
    	"application/vnd.dna": {
    	source: "iana",
    	extensions: [
    		"dna"
    	]
    },
    	"application/vnd.document+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.dolby.mlp": {
    	source: "apache",
    	extensions: [
    		"mlp"
    	]
    },
    	"application/vnd.dolby.mobile.1": {
    	source: "iana"
    },
    	"application/vnd.dolby.mobile.2": {
    	source: "iana"
    },
    	"application/vnd.doremir.scorecloud-binary-document": {
    	source: "iana"
    },
    	"application/vnd.dpgraph": {
    	source: "iana",
    	extensions: [
    		"dpg"
    	]
    },
    	"application/vnd.dreamfactory": {
    	source: "iana",
    	extensions: [
    		"dfac"
    	]
    },
    	"application/vnd.drive+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.ds-keypoint": {
    	source: "apache",
    	extensions: [
    		"kpxx"
    	]
    },
    	"application/vnd.dtg.local": {
    	source: "iana"
    },
    	"application/vnd.dtg.local.flash": {
    	source: "iana"
    },
    	"application/vnd.dtg.local.html": {
    	source: "iana"
    },
    	"application/vnd.dvb.ait": {
    	source: "iana",
    	extensions: [
    		"ait"
    	]
    },
    	"application/vnd.dvb.dvbj": {
    	source: "iana"
    },
    	"application/vnd.dvb.esgcontainer": {
    	source: "iana"
    },
    	"application/vnd.dvb.ipdcdftnotifaccess": {
    	source: "iana"
    },
    	"application/vnd.dvb.ipdcesgaccess": {
    	source: "iana"
    },
    	"application/vnd.dvb.ipdcesgaccess2": {
    	source: "iana"
    },
    	"application/vnd.dvb.ipdcesgpdd": {
    	source: "iana"
    },
    	"application/vnd.dvb.ipdcroaming": {
    	source: "iana"
    },
    	"application/vnd.dvb.iptv.alfec-base": {
    	source: "iana"
    },
    	"application/vnd.dvb.iptv.alfec-enhancement": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-aggregate-root+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-container+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-generic+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-ia-msglist+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-ia-registration-request+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-ia-registration-response+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.notif-init+xml": {
    	source: "iana"
    },
    	"application/vnd.dvb.pfr": {
    	source: "iana"
    },
    	"application/vnd.dvb.service": {
    	source: "iana",
    	extensions: [
    		"svc"
    	]
    },
    	"application/vnd.dxr": {
    	source: "iana"
    },
    	"application/vnd.dynageo": {
    	source: "iana",
    	extensions: [
    		"geo"
    	]
    },
    	"application/vnd.dzr": {
    	source: "iana"
    },
    	"application/vnd.easykaraoke.cdgdownload": {
    	source: "iana"
    },
    	"application/vnd.ecdis-update": {
    	source: "iana"
    },
    	"application/vnd.ecip.rlp": {
    	source: "iana"
    },
    	"application/vnd.ecowin.chart": {
    	source: "iana",
    	extensions: [
    		"mag"
    	]
    },
    	"application/vnd.ecowin.filerequest": {
    	source: "iana"
    },
    	"application/vnd.ecowin.fileupdate": {
    	source: "iana"
    },
    	"application/vnd.ecowin.series": {
    	source: "iana"
    },
    	"application/vnd.ecowin.seriesrequest": {
    	source: "iana"
    },
    	"application/vnd.ecowin.seriesupdate": {
    	source: "iana"
    },
    	"application/vnd.efi.img": {
    	source: "iana"
    },
    	"application/vnd.efi.iso": {
    	source: "iana"
    },
    	"application/vnd.emclient.accessrequest+xml": {
    	source: "iana"
    },
    	"application/vnd.enliven": {
    	source: "iana",
    	extensions: [
    		"nml"
    	]
    },
    	"application/vnd.enphase.envoy": {
    	source: "iana"
    },
    	"application/vnd.eprints.data+xml": {
    	source: "iana"
    },
    	"application/vnd.epson.esf": {
    	source: "iana",
    	extensions: [
    		"esf"
    	]
    },
    	"application/vnd.epson.msf": {
    	source: "iana",
    	extensions: [
    		"msf"
    	]
    },
    	"application/vnd.epson.quickanime": {
    	source: "iana",
    	extensions: [
    		"qam"
    	]
    },
    	"application/vnd.epson.salt": {
    	source: "iana",
    	extensions: [
    		"slt"
    	]
    },
    	"application/vnd.epson.ssf": {
    	source: "iana",
    	extensions: [
    		"ssf"
    	]
    },
    	"application/vnd.ericsson.quickcall": {
    	source: "iana"
    },
    	"application/vnd.espass-espass+zip": {
    	source: "iana"
    },
    	"application/vnd.eszigno3+xml": {
    	source: "iana",
    	extensions: [
    		"es3",
    		"et3"
    	]
    },
    	"application/vnd.etsi.aoc+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.asic-e+zip": {
    	source: "iana"
    },
    	"application/vnd.etsi.asic-s+zip": {
    	source: "iana"
    },
    	"application/vnd.etsi.cug+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvcommand+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvdiscovery+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvprofile+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvsad-bc+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvsad-cod+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvsad-npvr+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvservice+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvsync+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.iptvueprofile+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.mcid+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.mheg5": {
    	source: "iana"
    },
    	"application/vnd.etsi.overload-control-policy-dataset+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.pstn+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.sci+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.simservs+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.timestamp-token": {
    	source: "iana"
    },
    	"application/vnd.etsi.tsl+xml": {
    	source: "iana"
    },
    	"application/vnd.etsi.tsl.der": {
    	source: "iana"
    },
    	"application/vnd.eudora.data": {
    	source: "iana"
    },
    	"application/vnd.evolv.ecig.profile": {
    	source: "iana"
    },
    	"application/vnd.evolv.ecig.settings": {
    	source: "iana"
    },
    	"application/vnd.evolv.ecig.theme": {
    	source: "iana"
    },
    	"application/vnd.ezpix-album": {
    	source: "iana",
    	extensions: [
    		"ez2"
    	]
    },
    	"application/vnd.ezpix-package": {
    	source: "iana",
    	extensions: [
    		"ez3"
    	]
    },
    	"application/vnd.f-secure.mobile": {
    	source: "iana"
    },
    	"application/vnd.fastcopy-disk-image": {
    	source: "iana"
    },
    	"application/vnd.fdf": {
    	source: "iana",
    	extensions: [
    		"fdf"
    	]
    },
    	"application/vnd.fdsn.mseed": {
    	source: "iana",
    	extensions: [
    		"mseed"
    	]
    },
    	"application/vnd.fdsn.seed": {
    	source: "iana",
    	extensions: [
    		"seed",
    		"dataless"
    	]
    },
    	"application/vnd.ffsns": {
    	source: "iana"
    },
    	"application/vnd.filmit.zfc": {
    	source: "iana"
    },
    	"application/vnd.fints": {
    	source: "iana"
    },
    	"application/vnd.firemonkeys.cloudcell": {
    	source: "iana"
    },
    	"application/vnd.flographit": {
    	source: "iana",
    	extensions: [
    		"gph"
    	]
    },
    	"application/vnd.fluxtime.clip": {
    	source: "iana",
    	extensions: [
    		"ftc"
    	]
    },
    	"application/vnd.font-fontforge-sfd": {
    	source: "iana"
    },
    	"application/vnd.framemaker": {
    	source: "iana",
    	extensions: [
    		"fm",
    		"frame",
    		"maker",
    		"book"
    	]
    },
    	"application/vnd.frogans.fnc": {
    	source: "iana",
    	extensions: [
    		"fnc"
    	]
    },
    	"application/vnd.frogans.ltf": {
    	source: "iana",
    	extensions: [
    		"ltf"
    	]
    },
    	"application/vnd.fsc.weblaunch": {
    	source: "iana",
    	extensions: [
    		"fsc"
    	]
    },
    	"application/vnd.fujitsu.oasys": {
    	source: "iana",
    	extensions: [
    		"oas"
    	]
    },
    	"application/vnd.fujitsu.oasys2": {
    	source: "iana",
    	extensions: [
    		"oa2"
    	]
    },
    	"application/vnd.fujitsu.oasys3": {
    	source: "iana",
    	extensions: [
    		"oa3"
    	]
    },
    	"application/vnd.fujitsu.oasysgp": {
    	source: "iana",
    	extensions: [
    		"fg5"
    	]
    },
    	"application/vnd.fujitsu.oasysprs": {
    	source: "iana",
    	extensions: [
    		"bh2"
    	]
    },
    	"application/vnd.fujixerox.art-ex": {
    	source: "iana"
    },
    	"application/vnd.fujixerox.art4": {
    	source: "iana"
    },
    	"application/vnd.fujixerox.ddd": {
    	source: "iana",
    	extensions: [
    		"ddd"
    	]
    },
    	"application/vnd.fujixerox.docuworks": {
    	source: "iana",
    	extensions: [
    		"xdw"
    	]
    },
    	"application/vnd.fujixerox.docuworks.binder": {
    	source: "iana",
    	extensions: [
    		"xbd"
    	]
    },
    	"application/vnd.fujixerox.docuworks.container": {
    	source: "iana"
    },
    	"application/vnd.fujixerox.hbpl": {
    	source: "iana"
    },
    	"application/vnd.fut-misnet": {
    	source: "iana"
    },
    	"application/vnd.fuzzysheet": {
    	source: "iana",
    	extensions: [
    		"fzs"
    	]
    },
    	"application/vnd.genomatix.tuxedo": {
    	source: "iana",
    	extensions: [
    		"txd"
    	]
    },
    	"application/vnd.geo+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.geocube+xml": {
    	source: "iana"
    },
    	"application/vnd.geogebra.file": {
    	source: "iana",
    	extensions: [
    		"ggb"
    	]
    },
    	"application/vnd.geogebra.tool": {
    	source: "iana",
    	extensions: [
    		"ggt"
    	]
    },
    	"application/vnd.geometry-explorer": {
    	source: "iana",
    	extensions: [
    		"gex",
    		"gre"
    	]
    },
    	"application/vnd.geonext": {
    	source: "iana",
    	extensions: [
    		"gxt"
    	]
    },
    	"application/vnd.geoplan": {
    	source: "iana",
    	extensions: [
    		"g2w"
    	]
    },
    	"application/vnd.geospace": {
    	source: "iana",
    	extensions: [
    		"g3w"
    	]
    },
    	"application/vnd.gerber": {
    	source: "iana"
    },
    	"application/vnd.globalplatform.card-content-mgt": {
    	source: "iana"
    },
    	"application/vnd.globalplatform.card-content-mgt-response": {
    	source: "iana"
    },
    	"application/vnd.gmx": {
    	source: "iana",
    	extensions: [
    		"gmx"
    	]
    },
    	"application/vnd.google-apps.document": {
    	compressible: false,
    	extensions: [
    		"gdoc"
    	]
    },
    	"application/vnd.google-apps.presentation": {
    	compressible: false,
    	extensions: [
    		"gslides"
    	]
    },
    	"application/vnd.google-apps.spreadsheet": {
    	compressible: false,
    	extensions: [
    		"gsheet"
    	]
    },
    	"application/vnd.google-earth.kml+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"kml"
    	]
    },
    	"application/vnd.google-earth.kmz": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"kmz"
    	]
    },
    	"application/vnd.gov.sk.e-form+xml": {
    	source: "iana"
    },
    	"application/vnd.gov.sk.e-form+zip": {
    	source: "iana"
    },
    	"application/vnd.gov.sk.xmldatacontainer+xml": {
    	source: "iana"
    },
    	"application/vnd.grafeq": {
    	source: "iana",
    	extensions: [
    		"gqf",
    		"gqs"
    	]
    },
    	"application/vnd.gridmp": {
    	source: "iana"
    },
    	"application/vnd.groove-account": {
    	source: "iana",
    	extensions: [
    		"gac"
    	]
    },
    	"application/vnd.groove-help": {
    	source: "iana",
    	extensions: [
    		"ghf"
    	]
    },
    	"application/vnd.groove-identity-message": {
    	source: "iana",
    	extensions: [
    		"gim"
    	]
    },
    	"application/vnd.groove-injector": {
    	source: "iana",
    	extensions: [
    		"grv"
    	]
    },
    	"application/vnd.groove-tool-message": {
    	source: "iana",
    	extensions: [
    		"gtm"
    	]
    },
    	"application/vnd.groove-tool-template": {
    	source: "iana",
    	extensions: [
    		"tpl"
    	]
    },
    	"application/vnd.groove-vcard": {
    	source: "iana",
    	extensions: [
    		"vcg"
    	]
    },
    	"application/vnd.hal+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.hal+xml": {
    	source: "iana",
    	extensions: [
    		"hal"
    	]
    },
    	"application/vnd.handheld-entertainment+xml": {
    	source: "iana",
    	extensions: [
    		"zmm"
    	]
    },
    	"application/vnd.hbci": {
    	source: "iana",
    	extensions: [
    		"hbci"
    	]
    },
    	"application/vnd.hc+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.hcl-bireports": {
    	source: "iana"
    },
    	"application/vnd.hdt": {
    	source: "iana"
    },
    	"application/vnd.heroku+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.hhe.lesson-player": {
    	source: "iana",
    	extensions: [
    		"les"
    	]
    },
    	"application/vnd.hp-hpgl": {
    	source: "iana",
    	extensions: [
    		"hpgl"
    	]
    },
    	"application/vnd.hp-hpid": {
    	source: "iana",
    	extensions: [
    		"hpid"
    	]
    },
    	"application/vnd.hp-hps": {
    	source: "iana",
    	extensions: [
    		"hps"
    	]
    },
    	"application/vnd.hp-jlyt": {
    	source: "iana",
    	extensions: [
    		"jlt"
    	]
    },
    	"application/vnd.hp-pcl": {
    	source: "iana",
    	extensions: [
    		"pcl"
    	]
    },
    	"application/vnd.hp-pclxl": {
    	source: "iana",
    	extensions: [
    		"pclxl"
    	]
    },
    	"application/vnd.httphone": {
    	source: "iana"
    },
    	"application/vnd.hydrostatix.sof-data": {
    	source: "iana",
    	extensions: [
    		"sfd-hdstx"
    	]
    },
    	"application/vnd.hyper-item+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.hyperdrive+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.hzn-3d-crossword": {
    	source: "iana"
    },
    	"application/vnd.ibm.afplinedata": {
    	source: "iana"
    },
    	"application/vnd.ibm.electronic-media": {
    	source: "iana"
    },
    	"application/vnd.ibm.minipay": {
    	source: "iana",
    	extensions: [
    		"mpy"
    	]
    },
    	"application/vnd.ibm.modcap": {
    	source: "iana",
    	extensions: [
    		"afp",
    		"listafp",
    		"list3820"
    	]
    },
    	"application/vnd.ibm.rights-management": {
    	source: "iana",
    	extensions: [
    		"irm"
    	]
    },
    	"application/vnd.ibm.secure-container": {
    	source: "iana",
    	extensions: [
    		"sc"
    	]
    },
    	"application/vnd.iccprofile": {
    	source: "iana",
    	extensions: [
    		"icc",
    		"icm"
    	]
    },
    	"application/vnd.ieee.1905": {
    	source: "iana"
    },
    	"application/vnd.igloader": {
    	source: "iana",
    	extensions: [
    		"igl"
    	]
    },
    	"application/vnd.imagemeter.folder+zip": {
    	source: "iana"
    },
    	"application/vnd.imagemeter.image+zip": {
    	source: "iana"
    },
    	"application/vnd.immervision-ivp": {
    	source: "iana",
    	extensions: [
    		"ivp"
    	]
    },
    	"application/vnd.immervision-ivu": {
    	source: "iana",
    	extensions: [
    		"ivu"
    	]
    },
    	"application/vnd.ims.imsccv1p1": {
    	source: "iana"
    },
    	"application/vnd.ims.imsccv1p2": {
    	source: "iana"
    },
    	"application/vnd.ims.imsccv1p3": {
    	source: "iana"
    },
    	"application/vnd.ims.lis.v2.result+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.ims.lti.v2.toolproxy+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.ims.lti.v2.toolproxy.id+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.ims.lti.v2.toolsettings+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.informedcontrol.rms+xml": {
    	source: "iana"
    },
    	"application/vnd.informix-visionary": {
    	source: "iana"
    },
    	"application/vnd.infotech.project": {
    	source: "iana"
    },
    	"application/vnd.infotech.project+xml": {
    	source: "iana"
    },
    	"application/vnd.innopath.wamp.notification": {
    	source: "iana"
    },
    	"application/vnd.insors.igm": {
    	source: "iana",
    	extensions: [
    		"igm"
    	]
    },
    	"application/vnd.intercon.formnet": {
    	source: "iana",
    	extensions: [
    		"xpw",
    		"xpx"
    	]
    },
    	"application/vnd.intergeo": {
    	source: "iana",
    	extensions: [
    		"i2g"
    	]
    },
    	"application/vnd.intertrust.digibox": {
    	source: "iana"
    },
    	"application/vnd.intertrust.nncp": {
    	source: "iana"
    },
    	"application/vnd.intu.qbo": {
    	source: "iana",
    	extensions: [
    		"qbo"
    	]
    },
    	"application/vnd.intu.qfx": {
    	source: "iana",
    	extensions: [
    		"qfx"
    	]
    },
    	"application/vnd.iptc.g2.catalogitem+xml": {
    	source: "iana"
    },
    	"application/vnd.iptc.g2.conceptitem+xml": {
    	source: "iana"
    },
    	"application/vnd.iptc.g2.knowledgeitem+xml": {
    	source: "iana"
    },
    	"application/vnd.iptc.g2.newsitem+xml": {
    	source: "iana"
    },
    	"application/vnd.iptc.g2.newsmessage+xml": {
    	source: "iana"
    },
    	"application/vnd.iptc.g2.packageitem+xml": {
    	source: "iana"
    },
    	"application/vnd.iptc.g2.planningitem+xml": {
    	source: "iana"
    },
    	"application/vnd.ipunplugged.rcprofile": {
    	source: "iana",
    	extensions: [
    		"rcprofile"
    	]
    },
    	"application/vnd.irepository.package+xml": {
    	source: "iana",
    	extensions: [
    		"irp"
    	]
    },
    	"application/vnd.is-xpr": {
    	source: "iana",
    	extensions: [
    		"xpr"
    	]
    },
    	"application/vnd.isac.fcs": {
    	source: "iana",
    	extensions: [
    		"fcs"
    	]
    },
    	"application/vnd.jam": {
    	source: "iana",
    	extensions: [
    		"jam"
    	]
    },
    	"application/vnd.japannet-directory-service": {
    	source: "iana"
    },
    	"application/vnd.japannet-jpnstore-wakeup": {
    	source: "iana"
    },
    	"application/vnd.japannet-payment-wakeup": {
    	source: "iana"
    },
    	"application/vnd.japannet-registration": {
    	source: "iana"
    },
    	"application/vnd.japannet-registration-wakeup": {
    	source: "iana"
    },
    	"application/vnd.japannet-setstore-wakeup": {
    	source: "iana"
    },
    	"application/vnd.japannet-verification": {
    	source: "iana"
    },
    	"application/vnd.japannet-verification-wakeup": {
    	source: "iana"
    },
    	"application/vnd.jcp.javame.midlet-rms": {
    	source: "iana",
    	extensions: [
    		"rms"
    	]
    },
    	"application/vnd.jisp": {
    	source: "iana",
    	extensions: [
    		"jisp"
    	]
    },
    	"application/vnd.joost.joda-archive": {
    	source: "iana",
    	extensions: [
    		"joda"
    	]
    },
    	"application/vnd.jsk.isdn-ngn": {
    	source: "iana"
    },
    	"application/vnd.kahootz": {
    	source: "iana",
    	extensions: [
    		"ktz",
    		"ktr"
    	]
    },
    	"application/vnd.kde.karbon": {
    	source: "iana",
    	extensions: [
    		"karbon"
    	]
    },
    	"application/vnd.kde.kchart": {
    	source: "iana",
    	extensions: [
    		"chrt"
    	]
    },
    	"application/vnd.kde.kformula": {
    	source: "iana",
    	extensions: [
    		"kfo"
    	]
    },
    	"application/vnd.kde.kivio": {
    	source: "iana",
    	extensions: [
    		"flw"
    	]
    },
    	"application/vnd.kde.kontour": {
    	source: "iana",
    	extensions: [
    		"kon"
    	]
    },
    	"application/vnd.kde.kpresenter": {
    	source: "iana",
    	extensions: [
    		"kpr",
    		"kpt"
    	]
    },
    	"application/vnd.kde.kspread": {
    	source: "iana",
    	extensions: [
    		"ksp"
    	]
    },
    	"application/vnd.kde.kword": {
    	source: "iana",
    	extensions: [
    		"kwd",
    		"kwt"
    	]
    },
    	"application/vnd.kenameaapp": {
    	source: "iana",
    	extensions: [
    		"htke"
    	]
    },
    	"application/vnd.kidspiration": {
    	source: "iana",
    	extensions: [
    		"kia"
    	]
    },
    	"application/vnd.kinar": {
    	source: "iana",
    	extensions: [
    		"kne",
    		"knp"
    	]
    },
    	"application/vnd.koan": {
    	source: "iana",
    	extensions: [
    		"skp",
    		"skd",
    		"skt",
    		"skm"
    	]
    },
    	"application/vnd.kodak-descriptor": {
    	source: "iana",
    	extensions: [
    		"sse"
    	]
    },
    	"application/vnd.las.las+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.las.las+xml": {
    	source: "iana",
    	extensions: [
    		"lasxml"
    	]
    },
    	"application/vnd.liberty-request+xml": {
    	source: "iana"
    },
    	"application/vnd.llamagraphics.life-balance.desktop": {
    	source: "iana",
    	extensions: [
    		"lbd"
    	]
    },
    	"application/vnd.llamagraphics.life-balance.exchange+xml": {
    	source: "iana",
    	extensions: [
    		"lbe"
    	]
    },
    	"application/vnd.lotus-1-2-3": {
    	source: "iana",
    	extensions: [
    		"123"
    	]
    },
    	"application/vnd.lotus-approach": {
    	source: "iana",
    	extensions: [
    		"apr"
    	]
    },
    	"application/vnd.lotus-freelance": {
    	source: "iana",
    	extensions: [
    		"pre"
    	]
    },
    	"application/vnd.lotus-notes": {
    	source: "iana",
    	extensions: [
    		"nsf"
    	]
    },
    	"application/vnd.lotus-organizer": {
    	source: "iana",
    	extensions: [
    		"org"
    	]
    },
    	"application/vnd.lotus-screencam": {
    	source: "iana",
    	extensions: [
    		"scm"
    	]
    },
    	"application/vnd.lotus-wordpro": {
    	source: "iana",
    	extensions: [
    		"lwp"
    	]
    },
    	"application/vnd.macports.portpkg": {
    	source: "iana",
    	extensions: [
    		"portpkg"
    	]
    },
    	"application/vnd.mapbox-vector-tile": {
    	source: "iana"
    },
    	"application/vnd.marlin.drm.actiontoken+xml": {
    	source: "iana"
    },
    	"application/vnd.marlin.drm.conftoken+xml": {
    	source: "iana"
    },
    	"application/vnd.marlin.drm.license+xml": {
    	source: "iana"
    },
    	"application/vnd.marlin.drm.mdcf": {
    	source: "iana"
    },
    	"application/vnd.mason+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.maxmind.maxmind-db": {
    	source: "iana"
    },
    	"application/vnd.mcd": {
    	source: "iana",
    	extensions: [
    		"mcd"
    	]
    },
    	"application/vnd.medcalcdata": {
    	source: "iana",
    	extensions: [
    		"mc1"
    	]
    },
    	"application/vnd.mediastation.cdkey": {
    	source: "iana",
    	extensions: [
    		"cdkey"
    	]
    },
    	"application/vnd.meridian-slingshot": {
    	source: "iana"
    },
    	"application/vnd.mfer": {
    	source: "iana",
    	extensions: [
    		"mwf"
    	]
    },
    	"application/vnd.mfmp": {
    	source: "iana",
    	extensions: [
    		"mfm"
    	]
    },
    	"application/vnd.micro+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.micrografx.flo": {
    	source: "iana",
    	extensions: [
    		"flo"
    	]
    },
    	"application/vnd.micrografx.igx": {
    	source: "iana",
    	extensions: [
    		"igx"
    	]
    },
    	"application/vnd.microsoft.portable-executable": {
    	source: "iana"
    },
    	"application/vnd.microsoft.windows.thumbnail-cache": {
    	source: "iana"
    },
    	"application/vnd.miele+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.mif": {
    	source: "iana",
    	extensions: [
    		"mif"
    	]
    },
    	"application/vnd.minisoft-hp3000-save": {
    	source: "iana"
    },
    	"application/vnd.mitsubishi.misty-guard.trustweb": {
    	source: "iana"
    },
    	"application/vnd.mobius.daf": {
    	source: "iana",
    	extensions: [
    		"daf"
    	]
    },
    	"application/vnd.mobius.dis": {
    	source: "iana",
    	extensions: [
    		"dis"
    	]
    },
    	"application/vnd.mobius.mbk": {
    	source: "iana",
    	extensions: [
    		"mbk"
    	]
    },
    	"application/vnd.mobius.mqy": {
    	source: "iana",
    	extensions: [
    		"mqy"
    	]
    },
    	"application/vnd.mobius.msl": {
    	source: "iana",
    	extensions: [
    		"msl"
    	]
    },
    	"application/vnd.mobius.plc": {
    	source: "iana",
    	extensions: [
    		"plc"
    	]
    },
    	"application/vnd.mobius.txf": {
    	source: "iana",
    	extensions: [
    		"txf"
    	]
    },
    	"application/vnd.mophun.application": {
    	source: "iana",
    	extensions: [
    		"mpn"
    	]
    },
    	"application/vnd.mophun.certificate": {
    	source: "iana",
    	extensions: [
    		"mpc"
    	]
    },
    	"application/vnd.motorola.flexsuite": {
    	source: "iana"
    },
    	"application/vnd.motorola.flexsuite.adsi": {
    	source: "iana"
    },
    	"application/vnd.motorola.flexsuite.fis": {
    	source: "iana"
    },
    	"application/vnd.motorola.flexsuite.gotap": {
    	source: "iana"
    },
    	"application/vnd.motorola.flexsuite.kmr": {
    	source: "iana"
    },
    	"application/vnd.motorola.flexsuite.ttc": {
    	source: "iana"
    },
    	"application/vnd.motorola.flexsuite.wem": {
    	source: "iana"
    },
    	"application/vnd.motorola.iprm": {
    	source: "iana"
    },
    	"application/vnd.mozilla.xul+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"xul"
    	]
    },
    	"application/vnd.ms-3mfdocument": {
    	source: "iana"
    },
    	"application/vnd.ms-artgalry": {
    	source: "iana",
    	extensions: [
    		"cil"
    	]
    },
    	"application/vnd.ms-asf": {
    	source: "iana"
    },
    	"application/vnd.ms-cab-compressed": {
    	source: "iana",
    	extensions: [
    		"cab"
    	]
    },
    	"application/vnd.ms-color.iccprofile": {
    	source: "apache"
    },
    	"application/vnd.ms-excel": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"xls",
    		"xlm",
    		"xla",
    		"xlc",
    		"xlt",
    		"xlw"
    	]
    },
    	"application/vnd.ms-excel.addin.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"xlam"
    	]
    },
    	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"xlsb"
    	]
    },
    	"application/vnd.ms-excel.sheet.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"xlsm"
    	]
    },
    	"application/vnd.ms-excel.template.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"xltm"
    	]
    },
    	"application/vnd.ms-fontobject": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"eot"
    	]
    },
    	"application/vnd.ms-htmlhelp": {
    	source: "iana",
    	extensions: [
    		"chm"
    	]
    },
    	"application/vnd.ms-ims": {
    	source: "iana",
    	extensions: [
    		"ims"
    	]
    },
    	"application/vnd.ms-lrm": {
    	source: "iana",
    	extensions: [
    		"lrm"
    	]
    },
    	"application/vnd.ms-office.activex+xml": {
    	source: "iana"
    },
    	"application/vnd.ms-officetheme": {
    	source: "iana",
    	extensions: [
    		"thmx"
    	]
    },
    	"application/vnd.ms-opentype": {
    	source: "apache",
    	compressible: true
    },
    	"application/vnd.ms-outlook": {
    	compressible: false,
    	extensions: [
    		"msg"
    	]
    },
    	"application/vnd.ms-package.obfuscated-opentype": {
    	source: "apache"
    },
    	"application/vnd.ms-pki.seccat": {
    	source: "apache",
    	extensions: [
    		"cat"
    	]
    },
    	"application/vnd.ms-pki.stl": {
    	source: "apache",
    	extensions: [
    		"stl"
    	]
    },
    	"application/vnd.ms-playready.initiator+xml": {
    	source: "iana"
    },
    	"application/vnd.ms-powerpoint": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"ppt",
    		"pps",
    		"pot"
    	]
    },
    	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"ppam"
    	]
    },
    	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"pptm"
    	]
    },
    	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"sldm"
    	]
    },
    	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"ppsm"
    	]
    },
    	"application/vnd.ms-powerpoint.template.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"potm"
    	]
    },
    	"application/vnd.ms-printdevicecapabilities+xml": {
    	source: "iana"
    },
    	"application/vnd.ms-printing.printticket+xml": {
    	source: "apache"
    },
    	"application/vnd.ms-printschematicket+xml": {
    	source: "iana"
    },
    	"application/vnd.ms-project": {
    	source: "iana",
    	extensions: [
    		"mpp",
    		"mpt"
    	]
    },
    	"application/vnd.ms-tnef": {
    	source: "iana"
    },
    	"application/vnd.ms-windows.devicepairing": {
    	source: "iana"
    },
    	"application/vnd.ms-windows.nwprinting.oob": {
    	source: "iana"
    },
    	"application/vnd.ms-windows.printerpairing": {
    	source: "iana"
    },
    	"application/vnd.ms-windows.wsd.oob": {
    	source: "iana"
    },
    	"application/vnd.ms-wmdrm.lic-chlg-req": {
    	source: "iana"
    },
    	"application/vnd.ms-wmdrm.lic-resp": {
    	source: "iana"
    },
    	"application/vnd.ms-wmdrm.meter-chlg-req": {
    	source: "iana"
    },
    	"application/vnd.ms-wmdrm.meter-resp": {
    	source: "iana"
    },
    	"application/vnd.ms-word.document.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"docm"
    	]
    },
    	"application/vnd.ms-word.template.macroenabled.12": {
    	source: "iana",
    	extensions: [
    		"dotm"
    	]
    },
    	"application/vnd.ms-works": {
    	source: "iana",
    	extensions: [
    		"wps",
    		"wks",
    		"wcm",
    		"wdb"
    	]
    },
    	"application/vnd.ms-wpl": {
    	source: "iana",
    	extensions: [
    		"wpl"
    	]
    },
    	"application/vnd.ms-xpsdocument": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"xps"
    	]
    },
    	"application/vnd.msa-disk-image": {
    	source: "iana"
    },
    	"application/vnd.mseq": {
    	source: "iana",
    	extensions: [
    		"mseq"
    	]
    },
    	"application/vnd.msign": {
    	source: "iana"
    },
    	"application/vnd.multiad.creator": {
    	source: "iana"
    },
    	"application/vnd.multiad.creator.cif": {
    	source: "iana"
    },
    	"application/vnd.music-niff": {
    	source: "iana"
    },
    	"application/vnd.musician": {
    	source: "iana",
    	extensions: [
    		"mus"
    	]
    },
    	"application/vnd.muvee.style": {
    	source: "iana",
    	extensions: [
    		"msty"
    	]
    },
    	"application/vnd.mynfc": {
    	source: "iana",
    	extensions: [
    		"taglet"
    	]
    },
    	"application/vnd.ncd.control": {
    	source: "iana"
    },
    	"application/vnd.ncd.reference": {
    	source: "iana"
    },
    	"application/vnd.nearst.inv+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.nervana": {
    	source: "iana"
    },
    	"application/vnd.netfpx": {
    	source: "iana"
    },
    	"application/vnd.neurolanguage.nlu": {
    	source: "iana",
    	extensions: [
    		"nlu"
    	]
    },
    	"application/vnd.nintendo.nitro.rom": {
    	source: "iana"
    },
    	"application/vnd.nintendo.snes.rom": {
    	source: "iana"
    },
    	"application/vnd.nitf": {
    	source: "iana",
    	extensions: [
    		"ntf",
    		"nitf"
    	]
    },
    	"application/vnd.noblenet-directory": {
    	source: "iana",
    	extensions: [
    		"nnd"
    	]
    },
    	"application/vnd.noblenet-sealer": {
    	source: "iana",
    	extensions: [
    		"nns"
    	]
    },
    	"application/vnd.noblenet-web": {
    	source: "iana",
    	extensions: [
    		"nnw"
    	]
    },
    	"application/vnd.nokia.catalogs": {
    	source: "iana"
    },
    	"application/vnd.nokia.conml+wbxml": {
    	source: "iana"
    },
    	"application/vnd.nokia.conml+xml": {
    	source: "iana"
    },
    	"application/vnd.nokia.iptv.config+xml": {
    	source: "iana"
    },
    	"application/vnd.nokia.isds-radio-presets": {
    	source: "iana"
    },
    	"application/vnd.nokia.landmark+wbxml": {
    	source: "iana"
    },
    	"application/vnd.nokia.landmark+xml": {
    	source: "iana"
    },
    	"application/vnd.nokia.landmarkcollection+xml": {
    	source: "iana"
    },
    	"application/vnd.nokia.n-gage.ac+xml": {
    	source: "iana"
    },
    	"application/vnd.nokia.n-gage.data": {
    	source: "iana",
    	extensions: [
    		"ngdat"
    	]
    },
    	"application/vnd.nokia.n-gage.symbian.install": {
    	source: "iana",
    	extensions: [
    		"n-gage"
    	]
    },
    	"application/vnd.nokia.ncd": {
    	source: "iana"
    },
    	"application/vnd.nokia.pcd+wbxml": {
    	source: "iana"
    },
    	"application/vnd.nokia.pcd+xml": {
    	source: "iana"
    },
    	"application/vnd.nokia.radio-preset": {
    	source: "iana",
    	extensions: [
    		"rpst"
    	]
    },
    	"application/vnd.nokia.radio-presets": {
    	source: "iana",
    	extensions: [
    		"rpss"
    	]
    },
    	"application/vnd.novadigm.edm": {
    	source: "iana",
    	extensions: [
    		"edm"
    	]
    },
    	"application/vnd.novadigm.edx": {
    	source: "iana",
    	extensions: [
    		"edx"
    	]
    },
    	"application/vnd.novadigm.ext": {
    	source: "iana",
    	extensions: [
    		"ext"
    	]
    },
    	"application/vnd.ntt-local.content-share": {
    	source: "iana"
    },
    	"application/vnd.ntt-local.file-transfer": {
    	source: "iana"
    },
    	"application/vnd.ntt-local.ogw_remote-access": {
    	source: "iana"
    },
    	"application/vnd.ntt-local.sip-ta_remote": {
    	source: "iana"
    },
    	"application/vnd.ntt-local.sip-ta_tcp_stream": {
    	source: "iana"
    },
    	"application/vnd.oasis.opendocument.chart": {
    	source: "iana",
    	extensions: [
    		"odc"
    	]
    },
    	"application/vnd.oasis.opendocument.chart-template": {
    	source: "iana",
    	extensions: [
    		"otc"
    	]
    },
    	"application/vnd.oasis.opendocument.database": {
    	source: "iana",
    	extensions: [
    		"odb"
    	]
    },
    	"application/vnd.oasis.opendocument.formula": {
    	source: "iana",
    	extensions: [
    		"odf"
    	]
    },
    	"application/vnd.oasis.opendocument.formula-template": {
    	source: "iana",
    	extensions: [
    		"odft"
    	]
    },
    	"application/vnd.oasis.opendocument.graphics": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"odg"
    	]
    },
    	"application/vnd.oasis.opendocument.graphics-template": {
    	source: "iana",
    	extensions: [
    		"otg"
    	]
    },
    	"application/vnd.oasis.opendocument.image": {
    	source: "iana",
    	extensions: [
    		"odi"
    	]
    },
    	"application/vnd.oasis.opendocument.image-template": {
    	source: "iana",
    	extensions: [
    		"oti"
    	]
    },
    	"application/vnd.oasis.opendocument.presentation": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"odp"
    	]
    },
    	"application/vnd.oasis.opendocument.presentation-template": {
    	source: "iana",
    	extensions: [
    		"otp"
    	]
    },
    	"application/vnd.oasis.opendocument.spreadsheet": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"ods"
    	]
    },
    	"application/vnd.oasis.opendocument.spreadsheet-template": {
    	source: "iana",
    	extensions: [
    		"ots"
    	]
    },
    	"application/vnd.oasis.opendocument.text": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"odt"
    	]
    },
    	"application/vnd.oasis.opendocument.text-master": {
    	source: "iana",
    	extensions: [
    		"odm"
    	]
    },
    	"application/vnd.oasis.opendocument.text-template": {
    	source: "iana",
    	extensions: [
    		"ott"
    	]
    },
    	"application/vnd.oasis.opendocument.text-web": {
    	source: "iana",
    	extensions: [
    		"oth"
    	]
    },
    	"application/vnd.obn": {
    	source: "iana"
    },
    	"application/vnd.ocf+cbor": {
    	source: "iana"
    },
    	"application/vnd.oftn.l10n+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.oipf.contentaccessdownload+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.contentaccessstreaming+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.cspg-hexbinary": {
    	source: "iana"
    },
    	"application/vnd.oipf.dae.svg+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.dae.xhtml+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.mippvcontrolmessage+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.pae.gem": {
    	source: "iana"
    },
    	"application/vnd.oipf.spdiscovery+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.spdlist+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.ueprofile+xml": {
    	source: "iana"
    },
    	"application/vnd.oipf.userprofile+xml": {
    	source: "iana"
    },
    	"application/vnd.olpc-sugar": {
    	source: "iana",
    	extensions: [
    		"xo"
    	]
    },
    	"application/vnd.oma-scws-config": {
    	source: "iana"
    },
    	"application/vnd.oma-scws-http-request": {
    	source: "iana"
    },
    	"application/vnd.oma-scws-http-response": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.drm-trigger+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.imd+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.ltkm": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.notification+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.provisioningtrigger": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.sgboot": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.sgdd+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.sgdu": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.simple-symbol-container": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.smartcard-trigger+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.sprov+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.bcast.stkm": {
    	source: "iana"
    },
    	"application/vnd.oma.cab-address-book+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.cab-feature-handler+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.cab-pcc+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.cab-subs-invite+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.cab-user-prefs+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.dcd": {
    	source: "iana"
    },
    	"application/vnd.oma.dcdc": {
    	source: "iana"
    },
    	"application/vnd.oma.dd2+xml": {
    	source: "iana",
    	extensions: [
    		"dd2"
    	]
    },
    	"application/vnd.oma.drm.risd+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.group-usage-list+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.lwm2m+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.oma.lwm2m+tlv": {
    	source: "iana"
    },
    	"application/vnd.oma.pal+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.poc.detailed-progress-report+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.poc.final-report+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.poc.groups+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.poc.invocation-descriptor+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.poc.optimized-progress-report+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.push": {
    	source: "iana"
    },
    	"application/vnd.oma.scidm.messages+xml": {
    	source: "iana"
    },
    	"application/vnd.oma.xcap-directory+xml": {
    	source: "iana"
    },
    	"application/vnd.omads-email+xml": {
    	source: "iana"
    },
    	"application/vnd.omads-file+xml": {
    	source: "iana"
    },
    	"application/vnd.omads-folder+xml": {
    	source: "iana"
    },
    	"application/vnd.omaloc-supl-init": {
    	source: "iana"
    },
    	"application/vnd.onepager": {
    	source: "iana"
    },
    	"application/vnd.onepagertamp": {
    	source: "iana"
    },
    	"application/vnd.onepagertamx": {
    	source: "iana"
    },
    	"application/vnd.onepagertat": {
    	source: "iana"
    },
    	"application/vnd.onepagertatp": {
    	source: "iana"
    },
    	"application/vnd.onepagertatx": {
    	source: "iana"
    },
    	"application/vnd.openblox.game+xml": {
    	source: "iana"
    },
    	"application/vnd.openblox.game-binary": {
    	source: "iana"
    },
    	"application/vnd.openeye.oeb": {
    	source: "iana"
    },
    	"application/vnd.openofficeorg.extension": {
    	source: "apache",
    	extensions: [
    		"oxt"
    	]
    },
    	"application/vnd.openstreetmap.data+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawing+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"pptx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
    	source: "iana",
    	extensions: [
    		"sldx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    	source: "iana",
    	extensions: [
    		"ppsx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.template": {
    	source: "iana",
    	extensions: [
    		"potx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"xlsx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    	source: "iana",
    	extensions: [
    		"xltx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.theme+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.vmldrawing": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"docx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    	source: "iana",
    	extensions: [
    		"dotx"
    	]
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-package.core-properties+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    	source: "iana"
    },
    	"application/vnd.openxmlformats-package.relationships+xml": {
    	source: "iana"
    },
    	"application/vnd.oracle.resource+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.orange.indata": {
    	source: "iana"
    },
    	"application/vnd.osa.netdeploy": {
    	source: "iana"
    },
    	"application/vnd.osgeo.mapguide.package": {
    	source: "iana",
    	extensions: [
    		"mgp"
    	]
    },
    	"application/vnd.osgi.bundle": {
    	source: "iana"
    },
    	"application/vnd.osgi.dp": {
    	source: "iana",
    	extensions: [
    		"dp"
    	]
    },
    	"application/vnd.osgi.subsystem": {
    	source: "iana",
    	extensions: [
    		"esa"
    	]
    },
    	"application/vnd.otps.ct-kip+xml": {
    	source: "iana"
    },
    	"application/vnd.oxli.countgraph": {
    	source: "iana"
    },
    	"application/vnd.pagerduty+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.palm": {
    	source: "iana",
    	extensions: [
    		"pdb",
    		"pqa",
    		"oprc"
    	]
    },
    	"application/vnd.panoply": {
    	source: "iana"
    },
    	"application/vnd.paos+xml": {
    	source: "iana"
    },
    	"application/vnd.paos.xml": {
    	source: "apache"
    },
    	"application/vnd.patentdive": {
    	source: "iana"
    },
    	"application/vnd.pawaafile": {
    	source: "iana",
    	extensions: [
    		"paw"
    	]
    },
    	"application/vnd.pcos": {
    	source: "iana"
    },
    	"application/vnd.pg.format": {
    	source: "iana",
    	extensions: [
    		"str"
    	]
    },
    	"application/vnd.pg.osasli": {
    	source: "iana",
    	extensions: [
    		"ei6"
    	]
    },
    	"application/vnd.piaccess.application-licence": {
    	source: "iana"
    },
    	"application/vnd.picsel": {
    	source: "iana",
    	extensions: [
    		"efif"
    	]
    },
    	"application/vnd.pmi.widget": {
    	source: "iana",
    	extensions: [
    		"wg"
    	]
    },
    	"application/vnd.poc.group-advertisement+xml": {
    	source: "iana"
    },
    	"application/vnd.pocketlearn": {
    	source: "iana",
    	extensions: [
    		"plf"
    	]
    },
    	"application/vnd.powerbuilder6": {
    	source: "iana",
    	extensions: [
    		"pbd"
    	]
    },
    	"application/vnd.powerbuilder6-s": {
    	source: "iana"
    },
    	"application/vnd.powerbuilder7": {
    	source: "iana"
    },
    	"application/vnd.powerbuilder7-s": {
    	source: "iana"
    },
    	"application/vnd.powerbuilder75": {
    	source: "iana"
    },
    	"application/vnd.powerbuilder75-s": {
    	source: "iana"
    },
    	"application/vnd.preminet": {
    	source: "iana"
    },
    	"application/vnd.previewsystems.box": {
    	source: "iana",
    	extensions: [
    		"box"
    	]
    },
    	"application/vnd.proteus.magazine": {
    	source: "iana",
    	extensions: [
    		"mgz"
    	]
    },
    	"application/vnd.publishare-delta-tree": {
    	source: "iana",
    	extensions: [
    		"qps"
    	]
    },
    	"application/vnd.pvi.ptid1": {
    	source: "iana",
    	extensions: [
    		"ptid"
    	]
    },
    	"application/vnd.pwg-multiplexed": {
    	source: "iana"
    },
    	"application/vnd.pwg-xhtml-print+xml": {
    	source: "iana"
    },
    	"application/vnd.qualcomm.brew-app-res": {
    	source: "iana"
    },
    	"application/vnd.quarantainenet": {
    	source: "iana"
    },
    	"application/vnd.quark.quarkxpress": {
    	source: "iana",
    	extensions: [
    		"qxd",
    		"qxt",
    		"qwd",
    		"qwt",
    		"qxl",
    		"qxb"
    	]
    },
    	"application/vnd.quobject-quoxdocument": {
    	source: "iana"
    },
    	"application/vnd.radisys.moml+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-audit+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-audit-conf+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-audit-conn+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-audit-dialog+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-audit-stream+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-conf+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog-base+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog-group+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog-speech+xml": {
    	source: "iana"
    },
    	"application/vnd.radisys.msml-dialog-transform+xml": {
    	source: "iana"
    },
    	"application/vnd.rainstor.data": {
    	source: "iana"
    },
    	"application/vnd.rapid": {
    	source: "iana"
    },
    	"application/vnd.rar": {
    	source: "iana"
    },
    	"application/vnd.realvnc.bed": {
    	source: "iana",
    	extensions: [
    		"bed"
    	]
    },
    	"application/vnd.recordare.musicxml": {
    	source: "iana",
    	extensions: [
    		"mxl"
    	]
    },
    	"application/vnd.recordare.musicxml+xml": {
    	source: "iana",
    	extensions: [
    		"musicxml"
    	]
    },
    	"application/vnd.renlearn.rlprint": {
    	source: "iana"
    },
    	"application/vnd.restful+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.rig.cryptonote": {
    	source: "iana",
    	extensions: [
    		"cryptonote"
    	]
    },
    	"application/vnd.rim.cod": {
    	source: "apache",
    	extensions: [
    		"cod"
    	]
    },
    	"application/vnd.rn-realmedia": {
    	source: "apache",
    	extensions: [
    		"rm"
    	]
    },
    	"application/vnd.rn-realmedia-vbr": {
    	source: "apache",
    	extensions: [
    		"rmvb"
    	]
    },
    	"application/vnd.route66.link66+xml": {
    	source: "iana",
    	extensions: [
    		"link66"
    	]
    },
    	"application/vnd.rs-274x": {
    	source: "iana"
    },
    	"application/vnd.ruckus.download": {
    	source: "iana"
    },
    	"application/vnd.s3sms": {
    	source: "iana"
    },
    	"application/vnd.sailingtracker.track": {
    	source: "iana",
    	extensions: [
    		"st"
    	]
    },
    	"application/vnd.sbm.cid": {
    	source: "iana"
    },
    	"application/vnd.sbm.mid2": {
    	source: "iana"
    },
    	"application/vnd.scribus": {
    	source: "iana"
    },
    	"application/vnd.sealed.3df": {
    	source: "iana"
    },
    	"application/vnd.sealed.csf": {
    	source: "iana"
    },
    	"application/vnd.sealed.doc": {
    	source: "iana"
    },
    	"application/vnd.sealed.eml": {
    	source: "iana"
    },
    	"application/vnd.sealed.mht": {
    	source: "iana"
    },
    	"application/vnd.sealed.net": {
    	source: "iana"
    },
    	"application/vnd.sealed.ppt": {
    	source: "iana"
    },
    	"application/vnd.sealed.tiff": {
    	source: "iana"
    },
    	"application/vnd.sealed.xls": {
    	source: "iana"
    },
    	"application/vnd.sealedmedia.softseal.html": {
    	source: "iana"
    },
    	"application/vnd.sealedmedia.softseal.pdf": {
    	source: "iana"
    },
    	"application/vnd.seemail": {
    	source: "iana",
    	extensions: [
    		"see"
    	]
    },
    	"application/vnd.sema": {
    	source: "iana",
    	extensions: [
    		"sema"
    	]
    },
    	"application/vnd.semd": {
    	source: "iana",
    	extensions: [
    		"semd"
    	]
    },
    	"application/vnd.semf": {
    	source: "iana",
    	extensions: [
    		"semf"
    	]
    },
    	"application/vnd.shana.informed.formdata": {
    	source: "iana",
    	extensions: [
    		"ifm"
    	]
    },
    	"application/vnd.shana.informed.formtemplate": {
    	source: "iana",
    	extensions: [
    		"itp"
    	]
    },
    	"application/vnd.shana.informed.interchange": {
    	source: "iana",
    	extensions: [
    		"iif"
    	]
    },
    	"application/vnd.shana.informed.package": {
    	source: "iana",
    	extensions: [
    		"ipk"
    	]
    },
    	"application/vnd.sigrok.session": {
    	source: "iana"
    },
    	"application/vnd.simtech-mindmapper": {
    	source: "iana",
    	extensions: [
    		"twd",
    		"twds"
    	]
    },
    	"application/vnd.siren+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.smaf": {
    	source: "iana",
    	extensions: [
    		"mmf"
    	]
    },
    	"application/vnd.smart.notebook": {
    	source: "iana"
    },
    	"application/vnd.smart.teacher": {
    	source: "iana",
    	extensions: [
    		"teacher"
    	]
    },
    	"application/vnd.software602.filler.form+xml": {
    	source: "iana"
    },
    	"application/vnd.software602.filler.form-xml-zip": {
    	source: "iana"
    },
    	"application/vnd.solent.sdkm+xml": {
    	source: "iana",
    	extensions: [
    		"sdkm",
    		"sdkd"
    	]
    },
    	"application/vnd.spotfire.dxp": {
    	source: "iana",
    	extensions: [
    		"dxp"
    	]
    },
    	"application/vnd.spotfire.sfs": {
    	source: "iana",
    	extensions: [
    		"sfs"
    	]
    },
    	"application/vnd.sqlite3": {
    	source: "iana"
    },
    	"application/vnd.sss-cod": {
    	source: "iana"
    },
    	"application/vnd.sss-dtf": {
    	source: "iana"
    },
    	"application/vnd.sss-ntf": {
    	source: "iana"
    },
    	"application/vnd.stardivision.calc": {
    	source: "apache",
    	extensions: [
    		"sdc"
    	]
    },
    	"application/vnd.stardivision.draw": {
    	source: "apache",
    	extensions: [
    		"sda"
    	]
    },
    	"application/vnd.stardivision.impress": {
    	source: "apache",
    	extensions: [
    		"sdd"
    	]
    },
    	"application/vnd.stardivision.math": {
    	source: "apache",
    	extensions: [
    		"smf"
    	]
    },
    	"application/vnd.stardivision.writer": {
    	source: "apache",
    	extensions: [
    		"sdw",
    		"vor"
    	]
    },
    	"application/vnd.stardivision.writer-global": {
    	source: "apache",
    	extensions: [
    		"sgl"
    	]
    },
    	"application/vnd.stepmania.package": {
    	source: "iana",
    	extensions: [
    		"smzip"
    	]
    },
    	"application/vnd.stepmania.stepchart": {
    	source: "iana",
    	extensions: [
    		"sm"
    	]
    },
    	"application/vnd.street-stream": {
    	source: "iana"
    },
    	"application/vnd.sun.wadl+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"wadl"
    	]
    },
    	"application/vnd.sun.xml.calc": {
    	source: "apache",
    	extensions: [
    		"sxc"
    	]
    },
    	"application/vnd.sun.xml.calc.template": {
    	source: "apache",
    	extensions: [
    		"stc"
    	]
    },
    	"application/vnd.sun.xml.draw": {
    	source: "apache",
    	extensions: [
    		"sxd"
    	]
    },
    	"application/vnd.sun.xml.draw.template": {
    	source: "apache",
    	extensions: [
    		"std"
    	]
    },
    	"application/vnd.sun.xml.impress": {
    	source: "apache",
    	extensions: [
    		"sxi"
    	]
    },
    	"application/vnd.sun.xml.impress.template": {
    	source: "apache",
    	extensions: [
    		"sti"
    	]
    },
    	"application/vnd.sun.xml.math": {
    	source: "apache",
    	extensions: [
    		"sxm"
    	]
    },
    	"application/vnd.sun.xml.writer": {
    	source: "apache",
    	extensions: [
    		"sxw"
    	]
    },
    	"application/vnd.sun.xml.writer.global": {
    	source: "apache",
    	extensions: [
    		"sxg"
    	]
    },
    	"application/vnd.sun.xml.writer.template": {
    	source: "apache",
    	extensions: [
    		"stw"
    	]
    },
    	"application/vnd.sus-calendar": {
    	source: "iana",
    	extensions: [
    		"sus",
    		"susp"
    	]
    },
    	"application/vnd.svd": {
    	source: "iana",
    	extensions: [
    		"svd"
    	]
    },
    	"application/vnd.swiftview-ics": {
    	source: "iana"
    },
    	"application/vnd.symbian.install": {
    	source: "apache",
    	extensions: [
    		"sis",
    		"sisx"
    	]
    },
    	"application/vnd.syncml+xml": {
    	source: "iana",
    	extensions: [
    		"xsm"
    	]
    },
    	"application/vnd.syncml.dm+wbxml": {
    	source: "iana",
    	extensions: [
    		"bdm"
    	]
    },
    	"application/vnd.syncml.dm+xml": {
    	source: "iana",
    	extensions: [
    		"xdm"
    	]
    },
    	"application/vnd.syncml.dm.notification": {
    	source: "iana"
    },
    	"application/vnd.syncml.dmddf+wbxml": {
    	source: "iana"
    },
    	"application/vnd.syncml.dmddf+xml": {
    	source: "iana"
    },
    	"application/vnd.syncml.dmtnds+wbxml": {
    	source: "iana"
    },
    	"application/vnd.syncml.dmtnds+xml": {
    	source: "iana"
    },
    	"application/vnd.syncml.ds.notification": {
    	source: "iana"
    },
    	"application/vnd.tableschema+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.tao.intent-module-archive": {
    	source: "iana",
    	extensions: [
    		"tao"
    	]
    },
    	"application/vnd.tcpdump.pcap": {
    	source: "iana",
    	extensions: [
    		"pcap",
    		"cap",
    		"dmp"
    	]
    },
    	"application/vnd.tmd.mediaflex.api+xml": {
    	source: "iana"
    },
    	"application/vnd.tml": {
    	source: "iana"
    },
    	"application/vnd.tmobile-livetv": {
    	source: "iana",
    	extensions: [
    		"tmo"
    	]
    },
    	"application/vnd.tri.onesource": {
    	source: "iana"
    },
    	"application/vnd.trid.tpt": {
    	source: "iana",
    	extensions: [
    		"tpt"
    	]
    },
    	"application/vnd.triscape.mxs": {
    	source: "iana",
    	extensions: [
    		"mxs"
    	]
    },
    	"application/vnd.trueapp": {
    	source: "iana",
    	extensions: [
    		"tra"
    	]
    },
    	"application/vnd.truedoc": {
    	source: "iana"
    },
    	"application/vnd.ubisoft.webplayer": {
    	source: "iana"
    },
    	"application/vnd.ufdl": {
    	source: "iana",
    	extensions: [
    		"ufd",
    		"ufdl"
    	]
    },
    	"application/vnd.uiq.theme": {
    	source: "iana",
    	extensions: [
    		"utz"
    	]
    },
    	"application/vnd.umajin": {
    	source: "iana",
    	extensions: [
    		"umj"
    	]
    },
    	"application/vnd.unity": {
    	source: "iana",
    	extensions: [
    		"unityweb"
    	]
    },
    	"application/vnd.uoml+xml": {
    	source: "iana",
    	extensions: [
    		"uoml"
    	]
    },
    	"application/vnd.uplanet.alert": {
    	source: "iana"
    },
    	"application/vnd.uplanet.alert-wbxml": {
    	source: "iana"
    },
    	"application/vnd.uplanet.bearer-choice": {
    	source: "iana"
    },
    	"application/vnd.uplanet.bearer-choice-wbxml": {
    	source: "iana"
    },
    	"application/vnd.uplanet.cacheop": {
    	source: "iana"
    },
    	"application/vnd.uplanet.cacheop-wbxml": {
    	source: "iana"
    },
    	"application/vnd.uplanet.channel": {
    	source: "iana"
    },
    	"application/vnd.uplanet.channel-wbxml": {
    	source: "iana"
    },
    	"application/vnd.uplanet.list": {
    	source: "iana"
    },
    	"application/vnd.uplanet.list-wbxml": {
    	source: "iana"
    },
    	"application/vnd.uplanet.listcmd": {
    	source: "iana"
    },
    	"application/vnd.uplanet.listcmd-wbxml": {
    	source: "iana"
    },
    	"application/vnd.uplanet.signal": {
    	source: "iana"
    },
    	"application/vnd.uri-map": {
    	source: "iana"
    },
    	"application/vnd.valve.source.material": {
    	source: "iana"
    },
    	"application/vnd.vcx": {
    	source: "iana",
    	extensions: [
    		"vcx"
    	]
    },
    	"application/vnd.vd-study": {
    	source: "iana"
    },
    	"application/vnd.vectorworks": {
    	source: "iana"
    },
    	"application/vnd.vel+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.verimatrix.vcas": {
    	source: "iana"
    },
    	"application/vnd.vidsoft.vidconference": {
    	source: "iana"
    },
    	"application/vnd.visio": {
    	source: "iana",
    	extensions: [
    		"vsd",
    		"vst",
    		"vss",
    		"vsw"
    	]
    },
    	"application/vnd.visionary": {
    	source: "iana",
    	extensions: [
    		"vis"
    	]
    },
    	"application/vnd.vividence.scriptfile": {
    	source: "iana"
    },
    	"application/vnd.vsf": {
    	source: "iana",
    	extensions: [
    		"vsf"
    	]
    },
    	"application/vnd.wap.sic": {
    	source: "iana"
    },
    	"application/vnd.wap.slc": {
    	source: "iana"
    },
    	"application/vnd.wap.wbxml": {
    	source: "iana",
    	extensions: [
    		"wbxml"
    	]
    },
    	"application/vnd.wap.wmlc": {
    	source: "iana",
    	extensions: [
    		"wmlc"
    	]
    },
    	"application/vnd.wap.wmlscriptc": {
    	source: "iana",
    	extensions: [
    		"wmlsc"
    	]
    },
    	"application/vnd.webturbo": {
    	source: "iana",
    	extensions: [
    		"wtb"
    	]
    },
    	"application/vnd.wfa.p2p": {
    	source: "iana"
    },
    	"application/vnd.wfa.wsc": {
    	source: "iana"
    },
    	"application/vnd.windows.devicepairing": {
    	source: "iana"
    },
    	"application/vnd.wmc": {
    	source: "iana"
    },
    	"application/vnd.wmf.bootstrap": {
    	source: "iana"
    },
    	"application/vnd.wolfram.mathematica": {
    	source: "iana"
    },
    	"application/vnd.wolfram.mathematica.package": {
    	source: "iana"
    },
    	"application/vnd.wolfram.player": {
    	source: "iana",
    	extensions: [
    		"nbp"
    	]
    },
    	"application/vnd.wordperfect": {
    	source: "iana",
    	extensions: [
    		"wpd"
    	]
    },
    	"application/vnd.wqd": {
    	source: "iana",
    	extensions: [
    		"wqd"
    	]
    },
    	"application/vnd.wrq-hp3000-labelled": {
    	source: "iana"
    },
    	"application/vnd.wt.stf": {
    	source: "iana",
    	extensions: [
    		"stf"
    	]
    },
    	"application/vnd.wv.csp+wbxml": {
    	source: "iana"
    },
    	"application/vnd.wv.csp+xml": {
    	source: "iana"
    },
    	"application/vnd.wv.ssp+xml": {
    	source: "iana"
    },
    	"application/vnd.xacml+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vnd.xara": {
    	source: "iana",
    	extensions: [
    		"xar"
    	]
    },
    	"application/vnd.xfdl": {
    	source: "iana",
    	extensions: [
    		"xfdl"
    	]
    },
    	"application/vnd.xfdl.webform": {
    	source: "iana"
    },
    	"application/vnd.xmi+xml": {
    	source: "iana"
    },
    	"application/vnd.xmpie.cpkg": {
    	source: "iana"
    },
    	"application/vnd.xmpie.dpkg": {
    	source: "iana"
    },
    	"application/vnd.xmpie.plan": {
    	source: "iana"
    },
    	"application/vnd.xmpie.ppkg": {
    	source: "iana"
    },
    	"application/vnd.xmpie.xlim": {
    	source: "iana"
    },
    	"application/vnd.yamaha.hv-dic": {
    	source: "iana",
    	extensions: [
    		"hvd"
    	]
    },
    	"application/vnd.yamaha.hv-script": {
    	source: "iana",
    	extensions: [
    		"hvs"
    	]
    },
    	"application/vnd.yamaha.hv-voice": {
    	source: "iana",
    	extensions: [
    		"hvp"
    	]
    },
    	"application/vnd.yamaha.openscoreformat": {
    	source: "iana",
    	extensions: [
    		"osf"
    	]
    },
    	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    	source: "iana",
    	extensions: [
    		"osfpvg"
    	]
    },
    	"application/vnd.yamaha.remote-setup": {
    	source: "iana"
    },
    	"application/vnd.yamaha.smaf-audio": {
    	source: "iana",
    	extensions: [
    		"saf"
    	]
    },
    	"application/vnd.yamaha.smaf-phrase": {
    	source: "iana",
    	extensions: [
    		"spf"
    	]
    },
    	"application/vnd.yamaha.through-ngn": {
    	source: "iana"
    },
    	"application/vnd.yamaha.tunnel-udpencap": {
    	source: "iana"
    },
    	"application/vnd.yaoweme": {
    	source: "iana"
    },
    	"application/vnd.yellowriver-custom-menu": {
    	source: "iana",
    	extensions: [
    		"cmp"
    	]
    },
    	"application/vnd.youtube.yt": {
    	source: "iana"
    },
    	"application/vnd.zul": {
    	source: "iana",
    	extensions: [
    		"zir",
    		"zirz"
    	]
    },
    	"application/vnd.zzazz.deck+xml": {
    	source: "iana",
    	extensions: [
    		"zaz"
    	]
    },
    	"application/voicexml+xml": {
    	source: "iana",
    	extensions: [
    		"vxml"
    	]
    },
    	"application/voucher-cms+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/vq-rtcpxr": {
    	source: "iana"
    },
    	"application/wasm": {
    	compressible: true,
    	extensions: [
    		"wasm"
    	]
    },
    	"application/watcherinfo+xml": {
    	source: "iana"
    },
    	"application/webpush-options+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/whoispp-query": {
    	source: "iana"
    },
    	"application/whoispp-response": {
    	source: "iana"
    },
    	"application/widget": {
    	source: "iana",
    	extensions: [
    		"wgt"
    	]
    },
    	"application/winhlp": {
    	source: "apache",
    	extensions: [
    		"hlp"
    	]
    },
    	"application/wita": {
    	source: "iana"
    },
    	"application/wordperfect5.1": {
    	source: "iana"
    },
    	"application/wsdl+xml": {
    	source: "iana",
    	extensions: [
    		"wsdl"
    	]
    },
    	"application/wspolicy+xml": {
    	source: "iana",
    	extensions: [
    		"wspolicy"
    	]
    },
    	"application/x-7z-compressed": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"7z"
    	]
    },
    	"application/x-abiword": {
    	source: "apache",
    	extensions: [
    		"abw"
    	]
    },
    	"application/x-ace-compressed": {
    	source: "apache",
    	extensions: [
    		"ace"
    	]
    },
    	"application/x-amf": {
    	source: "apache"
    },
    	"application/x-apple-diskimage": {
    	source: "apache",
    	extensions: [
    		"dmg"
    	]
    },
    	"application/x-arj": {
    	compressible: false,
    	extensions: [
    		"arj"
    	]
    },
    	"application/x-authorware-bin": {
    	source: "apache",
    	extensions: [
    		"aab",
    		"x32",
    		"u32",
    		"vox"
    	]
    },
    	"application/x-authorware-map": {
    	source: "apache",
    	extensions: [
    		"aam"
    	]
    },
    	"application/x-authorware-seg": {
    	source: "apache",
    	extensions: [
    		"aas"
    	]
    },
    	"application/x-bcpio": {
    	source: "apache",
    	extensions: [
    		"bcpio"
    	]
    },
    	"application/x-bdoc": {
    	compressible: false,
    	extensions: [
    		"bdoc"
    	]
    },
    	"application/x-bittorrent": {
    	source: "apache",
    	extensions: [
    		"torrent"
    	]
    },
    	"application/x-blorb": {
    	source: "apache",
    	extensions: [
    		"blb",
    		"blorb"
    	]
    },
    	"application/x-bzip": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"bz"
    	]
    },
    	"application/x-bzip2": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"bz2",
    		"boz"
    	]
    },
    	"application/x-cbr": {
    	source: "apache",
    	extensions: [
    		"cbr",
    		"cba",
    		"cbt",
    		"cbz",
    		"cb7"
    	]
    },
    	"application/x-cdlink": {
    	source: "apache",
    	extensions: [
    		"vcd"
    	]
    },
    	"application/x-cfs-compressed": {
    	source: "apache",
    	extensions: [
    		"cfs"
    	]
    },
    	"application/x-chat": {
    	source: "apache",
    	extensions: [
    		"chat"
    	]
    },
    	"application/x-chess-pgn": {
    	source: "apache",
    	extensions: [
    		"pgn"
    	]
    },
    	"application/x-chrome-extension": {
    	extensions: [
    		"crx"
    	]
    },
    	"application/x-cocoa": {
    	source: "nginx",
    	extensions: [
    		"cco"
    	]
    },
    	"application/x-compress": {
    	source: "apache"
    },
    	"application/x-conference": {
    	source: "apache",
    	extensions: [
    		"nsc"
    	]
    },
    	"application/x-cpio": {
    	source: "apache",
    	extensions: [
    		"cpio"
    	]
    },
    	"application/x-csh": {
    	source: "apache",
    	extensions: [
    		"csh"
    	]
    },
    	"application/x-deb": {
    	compressible: false
    },
    	"application/x-debian-package": {
    	source: "apache",
    	extensions: [
    		"deb",
    		"udeb"
    	]
    },
    	"application/x-dgc-compressed": {
    	source: "apache",
    	extensions: [
    		"dgc"
    	]
    },
    	"application/x-director": {
    	source: "apache",
    	extensions: [
    		"dir",
    		"dcr",
    		"dxr",
    		"cst",
    		"cct",
    		"cxt",
    		"w3d",
    		"fgd",
    		"swa"
    	]
    },
    	"application/x-doom": {
    	source: "apache",
    	extensions: [
    		"wad"
    	]
    },
    	"application/x-dtbncx+xml": {
    	source: "apache",
    	extensions: [
    		"ncx"
    	]
    },
    	"application/x-dtbook+xml": {
    	source: "apache",
    	extensions: [
    		"dtb"
    	]
    },
    	"application/x-dtbresource+xml": {
    	source: "apache",
    	extensions: [
    		"res"
    	]
    },
    	"application/x-dvi": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"dvi"
    	]
    },
    	"application/x-envoy": {
    	source: "apache",
    	extensions: [
    		"evy"
    	]
    },
    	"application/x-eva": {
    	source: "apache",
    	extensions: [
    		"eva"
    	]
    },
    	"application/x-font-bdf": {
    	source: "apache",
    	extensions: [
    		"bdf"
    	]
    },
    	"application/x-font-dos": {
    	source: "apache"
    },
    	"application/x-font-framemaker": {
    	source: "apache"
    },
    	"application/x-font-ghostscript": {
    	source: "apache",
    	extensions: [
    		"gsf"
    	]
    },
    	"application/x-font-libgrx": {
    	source: "apache"
    },
    	"application/x-font-linux-psf": {
    	source: "apache",
    	extensions: [
    		"psf"
    	]
    },
    	"application/x-font-pcf": {
    	source: "apache",
    	extensions: [
    		"pcf"
    	]
    },
    	"application/x-font-snf": {
    	source: "apache",
    	extensions: [
    		"snf"
    	]
    },
    	"application/x-font-speedo": {
    	source: "apache"
    },
    	"application/x-font-sunos-news": {
    	source: "apache"
    },
    	"application/x-font-type1": {
    	source: "apache",
    	extensions: [
    		"pfa",
    		"pfb",
    		"pfm",
    		"afm"
    	]
    },
    	"application/x-font-vfont": {
    	source: "apache"
    },
    	"application/x-freearc": {
    	source: "apache",
    	extensions: [
    		"arc"
    	]
    },
    	"application/x-futuresplash": {
    	source: "apache",
    	extensions: [
    		"spl"
    	]
    },
    	"application/x-gca-compressed": {
    	source: "apache",
    	extensions: [
    		"gca"
    	]
    },
    	"application/x-glulx": {
    	source: "apache",
    	extensions: [
    		"ulx"
    	]
    },
    	"application/x-gnumeric": {
    	source: "apache",
    	extensions: [
    		"gnumeric"
    	]
    },
    	"application/x-gramps-xml": {
    	source: "apache",
    	extensions: [
    		"gramps"
    	]
    },
    	"application/x-gtar": {
    	source: "apache",
    	extensions: [
    		"gtar"
    	]
    },
    	"application/x-gzip": {
    	source: "apache"
    },
    	"application/x-hdf": {
    	source: "apache",
    	extensions: [
    		"hdf"
    	]
    },
    	"application/x-httpd-php": {
    	compressible: true,
    	extensions: [
    		"php"
    	]
    },
    	"application/x-install-instructions": {
    	source: "apache",
    	extensions: [
    		"install"
    	]
    },
    	"application/x-iso9660-image": {
    	source: "apache",
    	extensions: [
    		"iso"
    	]
    },
    	"application/x-java-archive-diff": {
    	source: "nginx",
    	extensions: [
    		"jardiff"
    	]
    },
    	"application/x-java-jnlp-file": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"jnlp"
    	]
    },
    	"application/x-javascript": {
    	compressible: true
    },
    	"application/x-latex": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"latex"
    	]
    },
    	"application/x-lua-bytecode": {
    	extensions: [
    		"luac"
    	]
    },
    	"application/x-lzh-compressed": {
    	source: "apache",
    	extensions: [
    		"lzh",
    		"lha"
    	]
    },
    	"application/x-makeself": {
    	source: "nginx",
    	extensions: [
    		"run"
    	]
    },
    	"application/x-mie": {
    	source: "apache",
    	extensions: [
    		"mie"
    	]
    },
    	"application/x-mobipocket-ebook": {
    	source: "apache",
    	extensions: [
    		"prc",
    		"mobi"
    	]
    },
    	"application/x-mpegurl": {
    	compressible: false
    },
    	"application/x-ms-application": {
    	source: "apache",
    	extensions: [
    		"application"
    	]
    },
    	"application/x-ms-shortcut": {
    	source: "apache",
    	extensions: [
    		"lnk"
    	]
    },
    	"application/x-ms-wmd": {
    	source: "apache",
    	extensions: [
    		"wmd"
    	]
    },
    	"application/x-ms-wmz": {
    	source: "apache",
    	extensions: [
    		"wmz"
    	]
    },
    	"application/x-ms-xbap": {
    	source: "apache",
    	extensions: [
    		"xbap"
    	]
    },
    	"application/x-msaccess": {
    	source: "apache",
    	extensions: [
    		"mdb"
    	]
    },
    	"application/x-msbinder": {
    	source: "apache",
    	extensions: [
    		"obd"
    	]
    },
    	"application/x-mscardfile": {
    	source: "apache",
    	extensions: [
    		"crd"
    	]
    },
    	"application/x-msclip": {
    	source: "apache",
    	extensions: [
    		"clp"
    	]
    },
    	"application/x-msdos-program": {
    	extensions: [
    		"exe"
    	]
    },
    	"application/x-msdownload": {
    	source: "apache",
    	extensions: [
    		"exe",
    		"dll",
    		"com",
    		"bat",
    		"msi"
    	]
    },
    	"application/x-msmediaview": {
    	source: "apache",
    	extensions: [
    		"mvb",
    		"m13",
    		"m14"
    	]
    },
    	"application/x-msmetafile": {
    	source: "apache",
    	extensions: [
    		"wmf",
    		"wmz",
    		"emf",
    		"emz"
    	]
    },
    	"application/x-msmoney": {
    	source: "apache",
    	extensions: [
    		"mny"
    	]
    },
    	"application/x-mspublisher": {
    	source: "apache",
    	extensions: [
    		"pub"
    	]
    },
    	"application/x-msschedule": {
    	source: "apache",
    	extensions: [
    		"scd"
    	]
    },
    	"application/x-msterminal": {
    	source: "apache",
    	extensions: [
    		"trm"
    	]
    },
    	"application/x-mswrite": {
    	source: "apache",
    	extensions: [
    		"wri"
    	]
    },
    	"application/x-netcdf": {
    	source: "apache",
    	extensions: [
    		"nc",
    		"cdf"
    	]
    },
    	"application/x-ns-proxy-autoconfig": {
    	compressible: true,
    	extensions: [
    		"pac"
    	]
    },
    	"application/x-nzb": {
    	source: "apache",
    	extensions: [
    		"nzb"
    	]
    },
    	"application/x-perl": {
    	source: "nginx",
    	extensions: [
    		"pl",
    		"pm"
    	]
    },
    	"application/x-pilot": {
    	source: "nginx",
    	extensions: [
    		"prc",
    		"pdb"
    	]
    },
    	"application/x-pkcs12": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"p12",
    		"pfx"
    	]
    },
    	"application/x-pkcs7-certificates": {
    	source: "apache",
    	extensions: [
    		"p7b",
    		"spc"
    	]
    },
    	"application/x-pkcs7-certreqresp": {
    	source: "apache",
    	extensions: [
    		"p7r"
    	]
    },
    	"application/x-rar-compressed": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"rar"
    	]
    },
    	"application/x-redhat-package-manager": {
    	source: "nginx",
    	extensions: [
    		"rpm"
    	]
    },
    	"application/x-research-info-systems": {
    	source: "apache",
    	extensions: [
    		"ris"
    	]
    },
    	"application/x-sea": {
    	source: "nginx",
    	extensions: [
    		"sea"
    	]
    },
    	"application/x-sh": {
    	source: "apache",
    	compressible: true,
    	extensions: [
    		"sh"
    	]
    },
    	"application/x-shar": {
    	source: "apache",
    	extensions: [
    		"shar"
    	]
    },
    	"application/x-shockwave-flash": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"swf"
    	]
    },
    	"application/x-silverlight-app": {
    	source: "apache",
    	extensions: [
    		"xap"
    	]
    },
    	"application/x-sql": {
    	source: "apache",
    	extensions: [
    		"sql"
    	]
    },
    	"application/x-stuffit": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"sit"
    	]
    },
    	"application/x-stuffitx": {
    	source: "apache",
    	extensions: [
    		"sitx"
    	]
    },
    	"application/x-subrip": {
    	source: "apache",
    	extensions: [
    		"srt"
    	]
    },
    	"application/x-sv4cpio": {
    	source: "apache",
    	extensions: [
    		"sv4cpio"
    	]
    },
    	"application/x-sv4crc": {
    	source: "apache",
    	extensions: [
    		"sv4crc"
    	]
    },
    	"application/x-t3vm-image": {
    	source: "apache",
    	extensions: [
    		"t3"
    	]
    },
    	"application/x-tads": {
    	source: "apache",
    	extensions: [
    		"gam"
    	]
    },
    	"application/x-tar": {
    	source: "apache",
    	compressible: true,
    	extensions: [
    		"tar"
    	]
    },
    	"application/x-tcl": {
    	source: "apache",
    	extensions: [
    		"tcl",
    		"tk"
    	]
    },
    	"application/x-tex": {
    	source: "apache",
    	extensions: [
    		"tex"
    	]
    },
    	"application/x-tex-tfm": {
    	source: "apache",
    	extensions: [
    		"tfm"
    	]
    },
    	"application/x-texinfo": {
    	source: "apache",
    	extensions: [
    		"texinfo",
    		"texi"
    	]
    },
    	"application/x-tgif": {
    	source: "apache",
    	extensions: [
    		"obj"
    	]
    },
    	"application/x-ustar": {
    	source: "apache",
    	extensions: [
    		"ustar"
    	]
    },
    	"application/x-virtualbox-hdd": {
    	compressible: true,
    	extensions: [
    		"hdd"
    	]
    },
    	"application/x-virtualbox-ova": {
    	compressible: true,
    	extensions: [
    		"ova"
    	]
    },
    	"application/x-virtualbox-ovf": {
    	compressible: true,
    	extensions: [
    		"ovf"
    	]
    },
    	"application/x-virtualbox-vbox": {
    	compressible: true,
    	extensions: [
    		"vbox"
    	]
    },
    	"application/x-virtualbox-vbox-extpack": {
    	compressible: false,
    	extensions: [
    		"vbox-extpack"
    	]
    },
    	"application/x-virtualbox-vdi": {
    	compressible: true,
    	extensions: [
    		"vdi"
    	]
    },
    	"application/x-virtualbox-vhd": {
    	compressible: true,
    	extensions: [
    		"vhd"
    	]
    },
    	"application/x-virtualbox-vmdk": {
    	compressible: true,
    	extensions: [
    		"vmdk"
    	]
    },
    	"application/x-wais-source": {
    	source: "apache",
    	extensions: [
    		"src"
    	]
    },
    	"application/x-web-app-manifest+json": {
    	compressible: true,
    	extensions: [
    		"webapp"
    	]
    },
    	"application/x-www-form-urlencoded": {
    	source: "iana",
    	compressible: true
    },
    	"application/x-x509-ca-cert": {
    	source: "apache",
    	extensions: [
    		"der",
    		"crt",
    		"pem"
    	]
    },
    	"application/x-xfig": {
    	source: "apache",
    	extensions: [
    		"fig"
    	]
    },
    	"application/x-xliff+xml": {
    	source: "apache",
    	extensions: [
    		"xlf"
    	]
    },
    	"application/x-xpinstall": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"xpi"
    	]
    },
    	"application/x-xz": {
    	source: "apache",
    	extensions: [
    		"xz"
    	]
    },
    	"application/x-zmachine": {
    	source: "apache",
    	extensions: [
    		"z1",
    		"z2",
    		"z3",
    		"z4",
    		"z5",
    		"z6",
    		"z7",
    		"z8"
    	]
    },
    	"application/x400-bp": {
    	source: "iana"
    },
    	"application/xacml+xml": {
    	source: "iana"
    },
    	"application/xaml+xml": {
    	source: "apache",
    	extensions: [
    		"xaml"
    	]
    },
    	"application/xcap-att+xml": {
    	source: "iana"
    },
    	"application/xcap-caps+xml": {
    	source: "iana"
    },
    	"application/xcap-diff+xml": {
    	source: "iana",
    	extensions: [
    		"xdf"
    	]
    },
    	"application/xcap-el+xml": {
    	source: "iana"
    },
    	"application/xcap-error+xml": {
    	source: "iana"
    },
    	"application/xcap-ns+xml": {
    	source: "iana"
    },
    	"application/xcon-conference-info+xml": {
    	source: "iana"
    },
    	"application/xcon-conference-info-diff+xml": {
    	source: "iana"
    },
    	"application/xenc+xml": {
    	source: "iana",
    	extensions: [
    		"xenc"
    	]
    },
    	"application/xhtml+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"xhtml",
    		"xht"
    	]
    },
    	"application/xhtml-voice+xml": {
    	source: "apache"
    },
    	"application/xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"xml",
    		"xsl",
    		"xsd",
    		"rng"
    	]
    },
    	"application/xml-dtd": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"dtd"
    	]
    },
    	"application/xml-external-parsed-entity": {
    	source: "iana"
    },
    	"application/xml-patch+xml": {
    	source: "iana"
    },
    	"application/xmpp+xml": {
    	source: "iana"
    },
    	"application/xop+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"xop"
    	]
    },
    	"application/xproc+xml": {
    	source: "apache",
    	extensions: [
    		"xpl"
    	]
    },
    	"application/xslt+xml": {
    	source: "iana",
    	extensions: [
    		"xslt"
    	]
    },
    	"application/xspf+xml": {
    	source: "apache",
    	extensions: [
    		"xspf"
    	]
    },
    	"application/xv+xml": {
    	source: "iana",
    	extensions: [
    		"mxml",
    		"xhvml",
    		"xvml",
    		"xvm"
    	]
    },
    	"application/yang": {
    	source: "iana",
    	extensions: [
    		"yang"
    	]
    },
    	"application/yang-data+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/yang-data+xml": {
    	source: "iana"
    },
    	"application/yang-patch+json": {
    	source: "iana",
    	compressible: true
    },
    	"application/yang-patch+xml": {
    	source: "iana"
    },
    	"application/yin+xml": {
    	source: "iana",
    	extensions: [
    		"yin"
    	]
    },
    	"application/zip": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"zip"
    	]
    },
    	"application/zlib": {
    	source: "iana"
    },
    	"audio/1d-interleaved-parityfec": {
    	source: "iana"
    },
    	"audio/32kadpcm": {
    	source: "iana"
    },
    	"audio/3gpp": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"3gpp"
    	]
    },
    	"audio/3gpp2": {
    	source: "iana"
    },
    	"audio/ac3": {
    	source: "iana"
    },
    	"audio/adpcm": {
    	source: "apache",
    	extensions: [
    		"adp"
    	]
    },
    	"audio/amr": {
    	source: "iana"
    },
    	"audio/amr-wb": {
    	source: "iana"
    },
    	"audio/amr-wb+": {
    	source: "iana"
    },
    	"audio/aptx": {
    	source: "iana"
    },
    	"audio/asc": {
    	source: "iana"
    },
    	"audio/atrac-advanced-lossless": {
    	source: "iana"
    },
    	"audio/atrac-x": {
    	source: "iana"
    },
    	"audio/atrac3": {
    	source: "iana"
    },
    	"audio/basic": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"au",
    		"snd"
    	]
    },
    	"audio/bv16": {
    	source: "iana"
    },
    	"audio/bv32": {
    	source: "iana"
    },
    	"audio/clearmode": {
    	source: "iana"
    },
    	"audio/cn": {
    	source: "iana"
    },
    	"audio/dat12": {
    	source: "iana"
    },
    	"audio/dls": {
    	source: "iana"
    },
    	"audio/dsr-es201108": {
    	source: "iana"
    },
    	"audio/dsr-es202050": {
    	source: "iana"
    },
    	"audio/dsr-es202211": {
    	source: "iana"
    },
    	"audio/dsr-es202212": {
    	source: "iana"
    },
    	"audio/dv": {
    	source: "iana"
    },
    	"audio/dvi4": {
    	source: "iana"
    },
    	"audio/eac3": {
    	source: "iana"
    },
    	"audio/encaprtp": {
    	source: "iana"
    },
    	"audio/evrc": {
    	source: "iana"
    },
    	"audio/evrc-qcp": {
    	source: "iana"
    },
    	"audio/evrc0": {
    	source: "iana"
    },
    	"audio/evrc1": {
    	source: "iana"
    },
    	"audio/evrcb": {
    	source: "iana"
    },
    	"audio/evrcb0": {
    	source: "iana"
    },
    	"audio/evrcb1": {
    	source: "iana"
    },
    	"audio/evrcnw": {
    	source: "iana"
    },
    	"audio/evrcnw0": {
    	source: "iana"
    },
    	"audio/evrcnw1": {
    	source: "iana"
    },
    	"audio/evrcwb": {
    	source: "iana"
    },
    	"audio/evrcwb0": {
    	source: "iana"
    },
    	"audio/evrcwb1": {
    	source: "iana"
    },
    	"audio/evs": {
    	source: "iana"
    },
    	"audio/fwdred": {
    	source: "iana"
    },
    	"audio/g711-0": {
    	source: "iana"
    },
    	"audio/g719": {
    	source: "iana"
    },
    	"audio/g722": {
    	source: "iana"
    },
    	"audio/g7221": {
    	source: "iana"
    },
    	"audio/g723": {
    	source: "iana"
    },
    	"audio/g726-16": {
    	source: "iana"
    },
    	"audio/g726-24": {
    	source: "iana"
    },
    	"audio/g726-32": {
    	source: "iana"
    },
    	"audio/g726-40": {
    	source: "iana"
    },
    	"audio/g728": {
    	source: "iana"
    },
    	"audio/g729": {
    	source: "iana"
    },
    	"audio/g7291": {
    	source: "iana"
    },
    	"audio/g729d": {
    	source: "iana"
    },
    	"audio/g729e": {
    	source: "iana"
    },
    	"audio/gsm": {
    	source: "iana"
    },
    	"audio/gsm-efr": {
    	source: "iana"
    },
    	"audio/gsm-hr-08": {
    	source: "iana"
    },
    	"audio/ilbc": {
    	source: "iana"
    },
    	"audio/ip-mr_v2.5": {
    	source: "iana"
    },
    	"audio/isac": {
    	source: "apache"
    },
    	"audio/l16": {
    	source: "iana"
    },
    	"audio/l20": {
    	source: "iana"
    },
    	"audio/l24": {
    	source: "iana",
    	compressible: false
    },
    	"audio/l8": {
    	source: "iana"
    },
    	"audio/lpc": {
    	source: "iana"
    },
    	"audio/melp": {
    	source: "iana"
    },
    	"audio/melp1200": {
    	source: "iana"
    },
    	"audio/melp2400": {
    	source: "iana"
    },
    	"audio/melp600": {
    	source: "iana"
    },
    	"audio/midi": {
    	source: "apache",
    	extensions: [
    		"mid",
    		"midi",
    		"kar",
    		"rmi"
    	]
    },
    	"audio/mobile-xmf": {
    	source: "iana"
    },
    	"audio/mp3": {
    	compressible: false,
    	extensions: [
    		"mp3"
    	]
    },
    	"audio/mp4": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"m4a",
    		"mp4a"
    	]
    },
    	"audio/mp4a-latm": {
    	source: "iana"
    },
    	"audio/mpa": {
    	source: "iana"
    },
    	"audio/mpa-robust": {
    	source: "iana"
    },
    	"audio/mpeg": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"mpga",
    		"mp2",
    		"mp2a",
    		"mp3",
    		"m2a",
    		"m3a"
    	]
    },
    	"audio/mpeg4-generic": {
    	source: "iana"
    },
    	"audio/musepack": {
    	source: "apache"
    },
    	"audio/ogg": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"oga",
    		"ogg",
    		"spx"
    	]
    },
    	"audio/opus": {
    	source: "iana"
    },
    	"audio/parityfec": {
    	source: "iana"
    },
    	"audio/pcma": {
    	source: "iana"
    },
    	"audio/pcma-wb": {
    	source: "iana"
    },
    	"audio/pcmu": {
    	source: "iana"
    },
    	"audio/pcmu-wb": {
    	source: "iana"
    },
    	"audio/prs.sid": {
    	source: "iana"
    },
    	"audio/qcelp": {
    	source: "iana"
    },
    	"audio/raptorfec": {
    	source: "iana"
    },
    	"audio/red": {
    	source: "iana"
    },
    	"audio/rtp-enc-aescm128": {
    	source: "iana"
    },
    	"audio/rtp-midi": {
    	source: "iana"
    },
    	"audio/rtploopback": {
    	source: "iana"
    },
    	"audio/rtx": {
    	source: "iana"
    },
    	"audio/s3m": {
    	source: "apache",
    	extensions: [
    		"s3m"
    	]
    },
    	"audio/silk": {
    	source: "apache",
    	extensions: [
    		"sil"
    	]
    },
    	"audio/smv": {
    	source: "iana"
    },
    	"audio/smv-qcp": {
    	source: "iana"
    },
    	"audio/smv0": {
    	source: "iana"
    },
    	"audio/sp-midi": {
    	source: "iana"
    },
    	"audio/speex": {
    	source: "iana"
    },
    	"audio/t140c": {
    	source: "iana"
    },
    	"audio/t38": {
    	source: "iana"
    },
    	"audio/telephone-event": {
    	source: "iana"
    },
    	"audio/tone": {
    	source: "iana"
    },
    	"audio/uemclip": {
    	source: "iana"
    },
    	"audio/ulpfec": {
    	source: "iana"
    },
    	"audio/vdvi": {
    	source: "iana"
    },
    	"audio/vmr-wb": {
    	source: "iana"
    },
    	"audio/vnd.3gpp.iufp": {
    	source: "iana"
    },
    	"audio/vnd.4sb": {
    	source: "iana"
    },
    	"audio/vnd.audiokoz": {
    	source: "iana"
    },
    	"audio/vnd.celp": {
    	source: "iana"
    },
    	"audio/vnd.cisco.nse": {
    	source: "iana"
    },
    	"audio/vnd.cmles.radio-events": {
    	source: "iana"
    },
    	"audio/vnd.cns.anp1": {
    	source: "iana"
    },
    	"audio/vnd.cns.inf1": {
    	source: "iana"
    },
    	"audio/vnd.dece.audio": {
    	source: "iana",
    	extensions: [
    		"uva",
    		"uvva"
    	]
    },
    	"audio/vnd.digital-winds": {
    	source: "iana",
    	extensions: [
    		"eol"
    	]
    },
    	"audio/vnd.dlna.adts": {
    	source: "iana"
    },
    	"audio/vnd.dolby.heaac.1": {
    	source: "iana"
    },
    	"audio/vnd.dolby.heaac.2": {
    	source: "iana"
    },
    	"audio/vnd.dolby.mlp": {
    	source: "iana"
    },
    	"audio/vnd.dolby.mps": {
    	source: "iana"
    },
    	"audio/vnd.dolby.pl2": {
    	source: "iana"
    },
    	"audio/vnd.dolby.pl2x": {
    	source: "iana"
    },
    	"audio/vnd.dolby.pl2z": {
    	source: "iana"
    },
    	"audio/vnd.dolby.pulse.1": {
    	source: "iana"
    },
    	"audio/vnd.dra": {
    	source: "iana",
    	extensions: [
    		"dra"
    	]
    },
    	"audio/vnd.dts": {
    	source: "iana",
    	extensions: [
    		"dts"
    	]
    },
    	"audio/vnd.dts.hd": {
    	source: "iana",
    	extensions: [
    		"dtshd"
    	]
    },
    	"audio/vnd.dvb.file": {
    	source: "iana"
    },
    	"audio/vnd.everad.plj": {
    	source: "iana"
    },
    	"audio/vnd.hns.audio": {
    	source: "iana"
    },
    	"audio/vnd.lucent.voice": {
    	source: "iana",
    	extensions: [
    		"lvp"
    	]
    },
    	"audio/vnd.ms-playready.media.pya": {
    	source: "iana",
    	extensions: [
    		"pya"
    	]
    },
    	"audio/vnd.nokia.mobile-xmf": {
    	source: "iana"
    },
    	"audio/vnd.nortel.vbk": {
    	source: "iana"
    },
    	"audio/vnd.nuera.ecelp4800": {
    	source: "iana",
    	extensions: [
    		"ecelp4800"
    	]
    },
    	"audio/vnd.nuera.ecelp7470": {
    	source: "iana",
    	extensions: [
    		"ecelp7470"
    	]
    },
    	"audio/vnd.nuera.ecelp9600": {
    	source: "iana",
    	extensions: [
    		"ecelp9600"
    	]
    },
    	"audio/vnd.octel.sbc": {
    	source: "iana"
    },
    	"audio/vnd.presonus.multitrack": {
    	source: "iana"
    },
    	"audio/vnd.qcelp": {
    	source: "iana"
    },
    	"audio/vnd.rhetorex.32kadpcm": {
    	source: "iana"
    },
    	"audio/vnd.rip": {
    	source: "iana",
    	extensions: [
    		"rip"
    	]
    },
    	"audio/vnd.rn-realaudio": {
    	compressible: false
    },
    	"audio/vnd.sealedmedia.softseal.mpeg": {
    	source: "iana"
    },
    	"audio/vnd.vmx.cvsd": {
    	source: "iana"
    },
    	"audio/vnd.wave": {
    	compressible: false
    },
    	"audio/vorbis": {
    	source: "iana",
    	compressible: false
    },
    	"audio/vorbis-config": {
    	source: "iana"
    },
    	"audio/wav": {
    	compressible: false,
    	extensions: [
    		"wav"
    	]
    },
    	"audio/wave": {
    	compressible: false,
    	extensions: [
    		"wav"
    	]
    },
    	"audio/webm": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"weba"
    	]
    },
    	"audio/x-aac": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"aac"
    	]
    },
    	"audio/x-aiff": {
    	source: "apache",
    	extensions: [
    		"aif",
    		"aiff",
    		"aifc"
    	]
    },
    	"audio/x-caf": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"caf"
    	]
    },
    	"audio/x-flac": {
    	source: "apache",
    	extensions: [
    		"flac"
    	]
    },
    	"audio/x-m4a": {
    	source: "nginx",
    	extensions: [
    		"m4a"
    	]
    },
    	"audio/x-matroska": {
    	source: "apache",
    	extensions: [
    		"mka"
    	]
    },
    	"audio/x-mpegurl": {
    	source: "apache",
    	extensions: [
    		"m3u"
    	]
    },
    	"audio/x-ms-wax": {
    	source: "apache",
    	extensions: [
    		"wax"
    	]
    },
    	"audio/x-ms-wma": {
    	source: "apache",
    	extensions: [
    		"wma"
    	]
    },
    	"audio/x-pn-realaudio": {
    	source: "apache",
    	extensions: [
    		"ram",
    		"ra"
    	]
    },
    	"audio/x-pn-realaudio-plugin": {
    	source: "apache",
    	extensions: [
    		"rmp"
    	]
    },
    	"audio/x-realaudio": {
    	source: "nginx",
    	extensions: [
    		"ra"
    	]
    },
    	"audio/x-tta": {
    	source: "apache"
    },
    	"audio/x-wav": {
    	source: "apache",
    	extensions: [
    		"wav"
    	]
    },
    	"audio/xm": {
    	source: "apache",
    	extensions: [
    		"xm"
    	]
    },
    	"chemical/x-cdx": {
    	source: "apache",
    	extensions: [
    		"cdx"
    	]
    },
    	"chemical/x-cif": {
    	source: "apache",
    	extensions: [
    		"cif"
    	]
    },
    	"chemical/x-cmdf": {
    	source: "apache",
    	extensions: [
    		"cmdf"
    	]
    },
    	"chemical/x-cml": {
    	source: "apache",
    	extensions: [
    		"cml"
    	]
    },
    	"chemical/x-csml": {
    	source: "apache",
    	extensions: [
    		"csml"
    	]
    },
    	"chemical/x-pdb": {
    	source: "apache"
    },
    	"chemical/x-xyz": {
    	source: "apache",
    	extensions: [
    		"xyz"
    	]
    },
    	"font/collection": {
    	source: "iana",
    	extensions: [
    		"ttc"
    	]
    },
    	"font/otf": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"otf"
    	]
    },
    	"font/sfnt": {
    	source: "iana"
    },
    	"font/ttf": {
    	source: "iana",
    	extensions: [
    		"ttf"
    	]
    },
    	"font/woff": {
    	source: "iana",
    	extensions: [
    		"woff"
    	]
    },
    	"font/woff2": {
    	source: "iana",
    	extensions: [
    		"woff2"
    	]
    },
    	"image/aces": {
    	source: "iana"
    },
    	"image/apng": {
    	compressible: false,
    	extensions: [
    		"apng"
    	]
    },
    	"image/bmp": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"bmp"
    	]
    },
    	"image/cgm": {
    	source: "iana",
    	extensions: [
    		"cgm"
    	]
    },
    	"image/dicom-rle": {
    	source: "iana"
    },
    	"image/emf": {
    	source: "iana"
    },
    	"image/fits": {
    	source: "iana"
    },
    	"image/g3fax": {
    	source: "iana",
    	extensions: [
    		"g3"
    	]
    },
    	"image/gif": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"gif"
    	]
    },
    	"image/ief": {
    	source: "iana",
    	extensions: [
    		"ief"
    	]
    },
    	"image/jls": {
    	source: "iana"
    },
    	"image/jp2": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"jp2",
    		"jpg2"
    	]
    },
    	"image/jpeg": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"jpeg",
    		"jpg",
    		"jpe"
    	]
    },
    	"image/jpm": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"jpm"
    	]
    },
    	"image/jpx": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"jpx",
    		"jpf"
    	]
    },
    	"image/ktx": {
    	source: "iana",
    	extensions: [
    		"ktx"
    	]
    },
    	"image/naplps": {
    	source: "iana"
    },
    	"image/pjpeg": {
    	compressible: false
    },
    	"image/png": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"png"
    	]
    },
    	"image/prs.btif": {
    	source: "iana",
    	extensions: [
    		"btif"
    	]
    },
    	"image/prs.pti": {
    	source: "iana"
    },
    	"image/pwg-raster": {
    	source: "iana"
    },
    	"image/sgi": {
    	source: "apache",
    	extensions: [
    		"sgi"
    	]
    },
    	"image/svg+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"svg",
    		"svgz"
    	]
    },
    	"image/t38": {
    	source: "iana"
    },
    	"image/tiff": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"tiff",
    		"tif"
    	]
    },
    	"image/tiff-fx": {
    	source: "iana"
    },
    	"image/vnd.adobe.photoshop": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"psd"
    	]
    },
    	"image/vnd.airzip.accelerator.azv": {
    	source: "iana"
    },
    	"image/vnd.cns.inf2": {
    	source: "iana"
    },
    	"image/vnd.dece.graphic": {
    	source: "iana",
    	extensions: [
    		"uvi",
    		"uvvi",
    		"uvg",
    		"uvvg"
    	]
    },
    	"image/vnd.djvu": {
    	source: "iana",
    	extensions: [
    		"djvu",
    		"djv"
    	]
    },
    	"image/vnd.dvb.subtitle": {
    	source: "iana",
    	extensions: [
    		"sub"
    	]
    },
    	"image/vnd.dwg": {
    	source: "iana",
    	extensions: [
    		"dwg"
    	]
    },
    	"image/vnd.dxf": {
    	source: "iana",
    	extensions: [
    		"dxf"
    	]
    },
    	"image/vnd.fastbidsheet": {
    	source: "iana",
    	extensions: [
    		"fbs"
    	]
    },
    	"image/vnd.fpx": {
    	source: "iana",
    	extensions: [
    		"fpx"
    	]
    },
    	"image/vnd.fst": {
    	source: "iana",
    	extensions: [
    		"fst"
    	]
    },
    	"image/vnd.fujixerox.edmics-mmr": {
    	source: "iana",
    	extensions: [
    		"mmr"
    	]
    },
    	"image/vnd.fujixerox.edmics-rlc": {
    	source: "iana",
    	extensions: [
    		"rlc"
    	]
    },
    	"image/vnd.globalgraphics.pgb": {
    	source: "iana"
    },
    	"image/vnd.microsoft.icon": {
    	source: "iana"
    },
    	"image/vnd.mix": {
    	source: "iana"
    },
    	"image/vnd.mozilla.apng": {
    	source: "iana"
    },
    	"image/vnd.ms-modi": {
    	source: "iana",
    	extensions: [
    		"mdi"
    	]
    },
    	"image/vnd.ms-photo": {
    	source: "apache",
    	extensions: [
    		"wdp"
    	]
    },
    	"image/vnd.net-fpx": {
    	source: "iana",
    	extensions: [
    		"npx"
    	]
    },
    	"image/vnd.radiance": {
    	source: "iana"
    },
    	"image/vnd.sealed.png": {
    	source: "iana"
    },
    	"image/vnd.sealedmedia.softseal.gif": {
    	source: "iana"
    },
    	"image/vnd.sealedmedia.softseal.jpg": {
    	source: "iana"
    },
    	"image/vnd.svf": {
    	source: "iana"
    },
    	"image/vnd.tencent.tap": {
    	source: "iana"
    },
    	"image/vnd.valve.source.texture": {
    	source: "iana"
    },
    	"image/vnd.wap.wbmp": {
    	source: "iana",
    	extensions: [
    		"wbmp"
    	]
    },
    	"image/vnd.xiff": {
    	source: "iana",
    	extensions: [
    		"xif"
    	]
    },
    	"image/vnd.zbrush.pcx": {
    	source: "iana"
    },
    	"image/webp": {
    	source: "apache",
    	extensions: [
    		"webp"
    	]
    },
    	"image/wmf": {
    	source: "iana"
    },
    	"image/x-3ds": {
    	source: "apache",
    	extensions: [
    		"3ds"
    	]
    },
    	"image/x-cmu-raster": {
    	source: "apache",
    	extensions: [
    		"ras"
    	]
    },
    	"image/x-cmx": {
    	source: "apache",
    	extensions: [
    		"cmx"
    	]
    },
    	"image/x-freehand": {
    	source: "apache",
    	extensions: [
    		"fh",
    		"fhc",
    		"fh4",
    		"fh5",
    		"fh7"
    	]
    },
    	"image/x-icon": {
    	source: "apache",
    	compressible: true,
    	extensions: [
    		"ico"
    	]
    },
    	"image/x-jng": {
    	source: "nginx",
    	extensions: [
    		"jng"
    	]
    },
    	"image/x-mrsid-image": {
    	source: "apache",
    	extensions: [
    		"sid"
    	]
    },
    	"image/x-ms-bmp": {
    	source: "nginx",
    	compressible: true,
    	extensions: [
    		"bmp"
    	]
    },
    	"image/x-pcx": {
    	source: "apache",
    	extensions: [
    		"pcx"
    	]
    },
    	"image/x-pict": {
    	source: "apache",
    	extensions: [
    		"pic",
    		"pct"
    	]
    },
    	"image/x-portable-anymap": {
    	source: "apache",
    	extensions: [
    		"pnm"
    	]
    },
    	"image/x-portable-bitmap": {
    	source: "apache",
    	extensions: [
    		"pbm"
    	]
    },
    	"image/x-portable-graymap": {
    	source: "apache",
    	extensions: [
    		"pgm"
    	]
    },
    	"image/x-portable-pixmap": {
    	source: "apache",
    	extensions: [
    		"ppm"
    	]
    },
    	"image/x-rgb": {
    	source: "apache",
    	extensions: [
    		"rgb"
    	]
    },
    	"image/x-tga": {
    	source: "apache",
    	extensions: [
    		"tga"
    	]
    },
    	"image/x-xbitmap": {
    	source: "apache",
    	extensions: [
    		"xbm"
    	]
    },
    	"image/x-xcf": {
    	compressible: false
    },
    	"image/x-xpixmap": {
    	source: "apache",
    	extensions: [
    		"xpm"
    	]
    },
    	"image/x-xwindowdump": {
    	source: "apache",
    	extensions: [
    		"xwd"
    	]
    },
    	"message/cpim": {
    	source: "iana"
    },
    	"message/delivery-status": {
    	source: "iana"
    },
    	"message/disposition-notification": {
    	source: "iana",
    	extensions: [
    		"disposition-notification"
    	]
    },
    	"message/external-body": {
    	source: "iana"
    },
    	"message/feedback-report": {
    	source: "iana"
    },
    	"message/global": {
    	source: "iana",
    	extensions: [
    		"u8msg"
    	]
    },
    	"message/global-delivery-status": {
    	source: "iana",
    	extensions: [
    		"u8dsn"
    	]
    },
    	"message/global-disposition-notification": {
    	source: "iana",
    	extensions: [
    		"u8mdn"
    	]
    },
    	"message/global-headers": {
    	source: "iana",
    	extensions: [
    		"u8hdr"
    	]
    },
    	"message/http": {
    	source: "iana",
    	compressible: false
    },
    	"message/imdn+xml": {
    	source: "iana",
    	compressible: true
    },
    	"message/news": {
    	source: "iana"
    },
    	"message/partial": {
    	source: "iana",
    	compressible: false
    },
    	"message/rfc822": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"eml",
    		"mime"
    	]
    },
    	"message/s-http": {
    	source: "iana"
    },
    	"message/sip": {
    	source: "iana"
    },
    	"message/sipfrag": {
    	source: "iana"
    },
    	"message/tracking-status": {
    	source: "iana"
    },
    	"message/vnd.si.simp": {
    	source: "iana"
    },
    	"message/vnd.wfa.wsc": {
    	source: "iana",
    	extensions: [
    		"wsc"
    	]
    },
    	"model/3mf": {
    	source: "iana"
    },
    	"model/gltf+json": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"gltf"
    	]
    },
    	"model/gltf-binary": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"glb"
    	]
    },
    	"model/iges": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"igs",
    		"iges"
    	]
    },
    	"model/mesh": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"msh",
    		"mesh",
    		"silo"
    	]
    },
    	"model/vnd.collada+xml": {
    	source: "iana",
    	extensions: [
    		"dae"
    	]
    },
    	"model/vnd.dwf": {
    	source: "iana",
    	extensions: [
    		"dwf"
    	]
    },
    	"model/vnd.flatland.3dml": {
    	source: "iana"
    },
    	"model/vnd.gdl": {
    	source: "iana",
    	extensions: [
    		"gdl"
    	]
    },
    	"model/vnd.gs-gdl": {
    	source: "apache"
    },
    	"model/vnd.gs.gdl": {
    	source: "iana"
    },
    	"model/vnd.gtw": {
    	source: "iana",
    	extensions: [
    		"gtw"
    	]
    },
    	"model/vnd.moml+xml": {
    	source: "iana"
    },
    	"model/vnd.mts": {
    	source: "iana",
    	extensions: [
    		"mts"
    	]
    },
    	"model/vnd.opengex": {
    	source: "iana"
    },
    	"model/vnd.parasolid.transmit.binary": {
    	source: "iana"
    },
    	"model/vnd.parasolid.transmit.text": {
    	source: "iana"
    },
    	"model/vnd.rosette.annotated-data-model": {
    	source: "iana"
    },
    	"model/vnd.valve.source.compiled-map": {
    	source: "iana"
    },
    	"model/vnd.vtu": {
    	source: "iana",
    	extensions: [
    		"vtu"
    	]
    },
    	"model/vrml": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"wrl",
    		"vrml"
    	]
    },
    	"model/x3d+binary": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"x3db",
    		"x3dbz"
    	]
    },
    	"model/x3d+fastinfoset": {
    	source: "iana"
    },
    	"model/x3d+vrml": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"x3dv",
    		"x3dvz"
    	]
    },
    	"model/x3d+xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"x3d",
    		"x3dz"
    	]
    },
    	"model/x3d-vrml": {
    	source: "iana"
    },
    	"multipart/alternative": {
    	source: "iana",
    	compressible: false
    },
    	"multipart/appledouble": {
    	source: "iana"
    },
    	"multipart/byteranges": {
    	source: "iana"
    },
    	"multipart/digest": {
    	source: "iana"
    },
    	"multipart/encrypted": {
    	source: "iana",
    	compressible: false
    },
    	"multipart/form-data": {
    	source: "iana",
    	compressible: false
    },
    	"multipart/header-set": {
    	source: "iana"
    },
    	"multipart/mixed": {
    	source: "iana",
    	compressible: false
    },
    	"multipart/multilingual": {
    	source: "iana"
    },
    	"multipart/parallel": {
    	source: "iana"
    },
    	"multipart/related": {
    	source: "iana",
    	compressible: false
    },
    	"multipart/report": {
    	source: "iana"
    },
    	"multipart/signed": {
    	source: "iana",
    	compressible: false
    },
    	"multipart/vnd.bint.med-plus": {
    	source: "iana"
    },
    	"multipart/voice-message": {
    	source: "iana"
    },
    	"multipart/x-mixed-replace": {
    	source: "iana"
    },
    	"text/1d-interleaved-parityfec": {
    	source: "iana"
    },
    	"text/cache-manifest": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"appcache",
    		"manifest"
    	]
    },
    	"text/calendar": {
    	source: "iana",
    	extensions: [
    		"ics",
    		"ifb"
    	]
    },
    	"text/calender": {
    	compressible: true
    },
    	"text/cmd": {
    	compressible: true
    },
    	"text/coffeescript": {
    	extensions: [
    		"coffee",
    		"litcoffee"
    	]
    },
    	"text/css": {
    	source: "iana",
    	charset: "UTF-8",
    	compressible: true,
    	extensions: [
    		"css"
    	]
    },
    	"text/csv": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"csv"
    	]
    },
    	"text/csv-schema": {
    	source: "iana"
    },
    	"text/directory": {
    	source: "iana"
    },
    	"text/dns": {
    	source: "iana"
    },
    	"text/ecmascript": {
    	source: "iana"
    },
    	"text/encaprtp": {
    	source: "iana"
    },
    	"text/enriched": {
    	source: "iana"
    },
    	"text/fwdred": {
    	source: "iana"
    },
    	"text/grammar-ref-list": {
    	source: "iana"
    },
    	"text/html": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"html",
    		"htm",
    		"shtml"
    	]
    },
    	"text/jade": {
    	extensions: [
    		"jade"
    	]
    },
    	"text/javascript": {
    	source: "iana",
    	compressible: true
    },
    	"text/jcr-cnd": {
    	source: "iana"
    },
    	"text/jsx": {
    	compressible: true,
    	extensions: [
    		"jsx"
    	]
    },
    	"text/less": {
    	extensions: [
    		"less"
    	]
    },
    	"text/markdown": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"markdown",
    		"md"
    	]
    },
    	"text/mathml": {
    	source: "nginx",
    	extensions: [
    		"mml"
    	]
    },
    	"text/mizar": {
    	source: "iana"
    },
    	"text/n3": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"n3"
    	]
    },
    	"text/parameters": {
    	source: "iana"
    },
    	"text/parityfec": {
    	source: "iana"
    },
    	"text/plain": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"txt",
    		"text",
    		"conf",
    		"def",
    		"list",
    		"log",
    		"in",
    		"ini"
    	]
    },
    	"text/provenance-notation": {
    	source: "iana"
    },
    	"text/prs.fallenstein.rst": {
    	source: "iana"
    },
    	"text/prs.lines.tag": {
    	source: "iana",
    	extensions: [
    		"dsc"
    	]
    },
    	"text/prs.prop.logic": {
    	source: "iana"
    },
    	"text/raptorfec": {
    	source: "iana"
    },
    	"text/red": {
    	source: "iana"
    },
    	"text/rfc822-headers": {
    	source: "iana"
    },
    	"text/richtext": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"rtx"
    	]
    },
    	"text/rtf": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"rtf"
    	]
    },
    	"text/rtp-enc-aescm128": {
    	source: "iana"
    },
    	"text/rtploopback": {
    	source: "iana"
    },
    	"text/rtx": {
    	source: "iana"
    },
    	"text/sgml": {
    	source: "iana",
    	extensions: [
    		"sgml",
    		"sgm"
    	]
    },
    	"text/shex": {
    	extensions: [
    		"shex"
    	]
    },
    	"text/slim": {
    	extensions: [
    		"slim",
    		"slm"
    	]
    },
    	"text/strings": {
    	source: "iana"
    },
    	"text/stylus": {
    	extensions: [
    		"stylus",
    		"styl"
    	]
    },
    	"text/t140": {
    	source: "iana"
    },
    	"text/tab-separated-values": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"tsv"
    	]
    },
    	"text/troff": {
    	source: "iana",
    	extensions: [
    		"t",
    		"tr",
    		"roff",
    		"man",
    		"me",
    		"ms"
    	]
    },
    	"text/turtle": {
    	source: "iana",
    	extensions: [
    		"ttl"
    	]
    },
    	"text/ulpfec": {
    	source: "iana"
    },
    	"text/uri-list": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"uri",
    		"uris",
    		"urls"
    	]
    },
    	"text/vcard": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"vcard"
    	]
    },
    	"text/vnd.a": {
    	source: "iana"
    },
    	"text/vnd.abc": {
    	source: "iana"
    },
    	"text/vnd.ascii-art": {
    	source: "iana"
    },
    	"text/vnd.curl": {
    	source: "iana",
    	extensions: [
    		"curl"
    	]
    },
    	"text/vnd.curl.dcurl": {
    	source: "apache",
    	extensions: [
    		"dcurl"
    	]
    },
    	"text/vnd.curl.mcurl": {
    	source: "apache",
    	extensions: [
    		"mcurl"
    	]
    },
    	"text/vnd.curl.scurl": {
    	source: "apache",
    	extensions: [
    		"scurl"
    	]
    },
    	"text/vnd.debian.copyright": {
    	source: "iana"
    },
    	"text/vnd.dmclientscript": {
    	source: "iana"
    },
    	"text/vnd.dvb.subtitle": {
    	source: "iana",
    	extensions: [
    		"sub"
    	]
    },
    	"text/vnd.esmertec.theme-descriptor": {
    	source: "iana"
    },
    	"text/vnd.fly": {
    	source: "iana",
    	extensions: [
    		"fly"
    	]
    },
    	"text/vnd.fmi.flexstor": {
    	source: "iana",
    	extensions: [
    		"flx"
    	]
    },
    	"text/vnd.graphviz": {
    	source: "iana",
    	extensions: [
    		"gv"
    	]
    },
    	"text/vnd.in3d.3dml": {
    	source: "iana",
    	extensions: [
    		"3dml"
    	]
    },
    	"text/vnd.in3d.spot": {
    	source: "iana",
    	extensions: [
    		"spot"
    	]
    },
    	"text/vnd.iptc.newsml": {
    	source: "iana"
    },
    	"text/vnd.iptc.nitf": {
    	source: "iana"
    },
    	"text/vnd.latex-z": {
    	source: "iana"
    },
    	"text/vnd.motorola.reflex": {
    	source: "iana"
    },
    	"text/vnd.ms-mediapackage": {
    	source: "iana"
    },
    	"text/vnd.net2phone.commcenter.command": {
    	source: "iana"
    },
    	"text/vnd.radisys.msml-basic-layout": {
    	source: "iana"
    },
    	"text/vnd.si.uricatalogue": {
    	source: "iana"
    },
    	"text/vnd.sun.j2me.app-descriptor": {
    	source: "iana",
    	extensions: [
    		"jad"
    	]
    },
    	"text/vnd.trolltech.linguist": {
    	source: "iana"
    },
    	"text/vnd.wap.si": {
    	source: "iana"
    },
    	"text/vnd.wap.sl": {
    	source: "iana"
    },
    	"text/vnd.wap.wml": {
    	source: "iana",
    	extensions: [
    		"wml"
    	]
    },
    	"text/vnd.wap.wmlscript": {
    	source: "iana",
    	extensions: [
    		"wmls"
    	]
    },
    	"text/vtt": {
    	charset: "UTF-8",
    	compressible: true,
    	extensions: [
    		"vtt"
    	]
    },
    	"text/x-asm": {
    	source: "apache",
    	extensions: [
    		"s",
    		"asm"
    	]
    },
    	"text/x-c": {
    	source: "apache",
    	extensions: [
    		"c",
    		"cc",
    		"cxx",
    		"cpp",
    		"h",
    		"hh",
    		"dic"
    	]
    },
    	"text/x-component": {
    	source: "nginx",
    	extensions: [
    		"htc"
    	]
    },
    	"text/x-fortran": {
    	source: "apache",
    	extensions: [
    		"f",
    		"for",
    		"f77",
    		"f90"
    	]
    },
    	"text/x-gwt-rpc": {
    	compressible: true
    },
    	"text/x-handlebars-template": {
    	extensions: [
    		"hbs"
    	]
    },
    	"text/x-java-source": {
    	source: "apache",
    	extensions: [
    		"java"
    	]
    },
    	"text/x-jquery-tmpl": {
    	compressible: true
    },
    	"text/x-lua": {
    	extensions: [
    		"lua"
    	]
    },
    	"text/x-markdown": {
    	compressible: true,
    	extensions: [
    		"mkd"
    	]
    },
    	"text/x-nfo": {
    	source: "apache",
    	extensions: [
    		"nfo"
    	]
    },
    	"text/x-opml": {
    	source: "apache",
    	extensions: [
    		"opml"
    	]
    },
    	"text/x-org": {
    	compressible: true,
    	extensions: [
    		"org"
    	]
    },
    	"text/x-pascal": {
    	source: "apache",
    	extensions: [
    		"p",
    		"pas"
    	]
    },
    	"text/x-processing": {
    	compressible: true,
    	extensions: [
    		"pde"
    	]
    },
    	"text/x-sass": {
    	extensions: [
    		"sass"
    	]
    },
    	"text/x-scss": {
    	extensions: [
    		"scss"
    	]
    },
    	"text/x-setext": {
    	source: "apache",
    	extensions: [
    		"etx"
    	]
    },
    	"text/x-sfv": {
    	source: "apache",
    	extensions: [
    		"sfv"
    	]
    },
    	"text/x-suse-ymp": {
    	compressible: true,
    	extensions: [
    		"ymp"
    	]
    },
    	"text/x-uuencode": {
    	source: "apache",
    	extensions: [
    		"uu"
    	]
    },
    	"text/x-vcalendar": {
    	source: "apache",
    	extensions: [
    		"vcs"
    	]
    },
    	"text/x-vcard": {
    	source: "apache",
    	extensions: [
    		"vcf"
    	]
    },
    	"text/xml": {
    	source: "iana",
    	compressible: true,
    	extensions: [
    		"xml"
    	]
    },
    	"text/xml-external-parsed-entity": {
    	source: "iana"
    },
    	"text/yaml": {
    	extensions: [
    		"yaml",
    		"yml"
    	]
    },
    	"video/1d-interleaved-parityfec": {
    	source: "iana"
    },
    	"video/3gpp": {
    	source: "iana",
    	extensions: [
    		"3gp",
    		"3gpp"
    	]
    },
    	"video/3gpp-tt": {
    	source: "iana"
    },
    	"video/3gpp2": {
    	source: "iana",
    	extensions: [
    		"3g2"
    	]
    },
    	"video/bmpeg": {
    	source: "iana"
    },
    	"video/bt656": {
    	source: "iana"
    },
    	"video/celb": {
    	source: "iana"
    },
    	"video/dv": {
    	source: "iana"
    },
    	"video/encaprtp": {
    	source: "iana"
    },
    	"video/h261": {
    	source: "iana",
    	extensions: [
    		"h261"
    	]
    },
    	"video/h263": {
    	source: "iana",
    	extensions: [
    		"h263"
    	]
    },
    	"video/h263-1998": {
    	source: "iana"
    },
    	"video/h263-2000": {
    	source: "iana"
    },
    	"video/h264": {
    	source: "iana",
    	extensions: [
    		"h264"
    	]
    },
    	"video/h264-rcdo": {
    	source: "iana"
    },
    	"video/h264-svc": {
    	source: "iana"
    },
    	"video/h265": {
    	source: "iana"
    },
    	"video/iso.segment": {
    	source: "iana"
    },
    	"video/jpeg": {
    	source: "iana",
    	extensions: [
    		"jpgv"
    	]
    },
    	"video/jpeg2000": {
    	source: "iana"
    },
    	"video/jpm": {
    	source: "apache",
    	extensions: [
    		"jpm",
    		"jpgm"
    	]
    },
    	"video/mj2": {
    	source: "iana",
    	extensions: [
    		"mj2",
    		"mjp2"
    	]
    },
    	"video/mp1s": {
    	source: "iana"
    },
    	"video/mp2p": {
    	source: "iana"
    },
    	"video/mp2t": {
    	source: "iana",
    	extensions: [
    		"ts"
    	]
    },
    	"video/mp4": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"mp4",
    		"mp4v",
    		"mpg4"
    	]
    },
    	"video/mp4v-es": {
    	source: "iana"
    },
    	"video/mpeg": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"mpeg",
    		"mpg",
    		"mpe",
    		"m1v",
    		"m2v"
    	]
    },
    	"video/mpeg4-generic": {
    	source: "iana"
    },
    	"video/mpv": {
    	source: "iana"
    },
    	"video/nv": {
    	source: "iana"
    },
    	"video/ogg": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"ogv"
    	]
    },
    	"video/parityfec": {
    	source: "iana"
    },
    	"video/pointer": {
    	source: "iana"
    },
    	"video/quicktime": {
    	source: "iana",
    	compressible: false,
    	extensions: [
    		"qt",
    		"mov"
    	]
    },
    	"video/raptorfec": {
    	source: "iana"
    },
    	"video/raw": {
    	source: "iana"
    },
    	"video/rtp-enc-aescm128": {
    	source: "iana"
    },
    	"video/rtploopback": {
    	source: "iana"
    },
    	"video/rtx": {
    	source: "iana"
    },
    	"video/smpte291": {
    	source: "iana"
    },
    	"video/smpte292m": {
    	source: "iana"
    },
    	"video/ulpfec": {
    	source: "iana"
    },
    	"video/vc1": {
    	source: "iana"
    },
    	"video/vnd.cctv": {
    	source: "iana"
    },
    	"video/vnd.dece.hd": {
    	source: "iana",
    	extensions: [
    		"uvh",
    		"uvvh"
    	]
    },
    	"video/vnd.dece.mobile": {
    	source: "iana",
    	extensions: [
    		"uvm",
    		"uvvm"
    	]
    },
    	"video/vnd.dece.mp4": {
    	source: "iana"
    },
    	"video/vnd.dece.pd": {
    	source: "iana",
    	extensions: [
    		"uvp",
    		"uvvp"
    	]
    },
    	"video/vnd.dece.sd": {
    	source: "iana",
    	extensions: [
    		"uvs",
    		"uvvs"
    	]
    },
    	"video/vnd.dece.video": {
    	source: "iana",
    	extensions: [
    		"uvv",
    		"uvvv"
    	]
    },
    	"video/vnd.directv.mpeg": {
    	source: "iana"
    },
    	"video/vnd.directv.mpeg-tts": {
    	source: "iana"
    },
    	"video/vnd.dlna.mpeg-tts": {
    	source: "iana"
    },
    	"video/vnd.dvb.file": {
    	source: "iana",
    	extensions: [
    		"dvb"
    	]
    },
    	"video/vnd.fvt": {
    	source: "iana",
    	extensions: [
    		"fvt"
    	]
    },
    	"video/vnd.hns.video": {
    	source: "iana"
    },
    	"video/vnd.iptvforum.1dparityfec-1010": {
    	source: "iana"
    },
    	"video/vnd.iptvforum.1dparityfec-2005": {
    	source: "iana"
    },
    	"video/vnd.iptvforum.2dparityfec-1010": {
    	source: "iana"
    },
    	"video/vnd.iptvforum.2dparityfec-2005": {
    	source: "iana"
    },
    	"video/vnd.iptvforum.ttsavc": {
    	source: "iana"
    },
    	"video/vnd.iptvforum.ttsmpeg2": {
    	source: "iana"
    },
    	"video/vnd.motorola.video": {
    	source: "iana"
    },
    	"video/vnd.motorola.videop": {
    	source: "iana"
    },
    	"video/vnd.mpegurl": {
    	source: "iana",
    	extensions: [
    		"mxu",
    		"m4u"
    	]
    },
    	"video/vnd.ms-playready.media.pyv": {
    	source: "iana",
    	extensions: [
    		"pyv"
    	]
    },
    	"video/vnd.nokia.interleaved-multimedia": {
    	source: "iana"
    },
    	"video/vnd.nokia.mp4vr": {
    	source: "iana"
    },
    	"video/vnd.nokia.videovoip": {
    	source: "iana"
    },
    	"video/vnd.objectvideo": {
    	source: "iana"
    },
    	"video/vnd.radgamettools.bink": {
    	source: "iana"
    },
    	"video/vnd.radgamettools.smacker": {
    	source: "iana"
    },
    	"video/vnd.sealed.mpeg1": {
    	source: "iana"
    },
    	"video/vnd.sealed.mpeg4": {
    	source: "iana"
    },
    	"video/vnd.sealed.swf": {
    	source: "iana"
    },
    	"video/vnd.sealedmedia.softseal.mov": {
    	source: "iana"
    },
    	"video/vnd.uvvu.mp4": {
    	source: "iana",
    	extensions: [
    		"uvu",
    		"uvvu"
    	]
    },
    	"video/vnd.vivo": {
    	source: "iana",
    	extensions: [
    		"viv"
    	]
    },
    	"video/vp8": {
    	source: "iana"
    },
    	"video/webm": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"webm"
    	]
    },
    	"video/x-f4v": {
    	source: "apache",
    	extensions: [
    		"f4v"
    	]
    },
    	"video/x-fli": {
    	source: "apache",
    	extensions: [
    		"fli"
    	]
    },
    	"video/x-flv": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"flv"
    	]
    },
    	"video/x-m4v": {
    	source: "apache",
    	extensions: [
    		"m4v"
    	]
    },
    	"video/x-matroska": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"mkv",
    		"mk3d",
    		"mks"
    	]
    },
    	"video/x-mng": {
    	source: "apache",
    	extensions: [
    		"mng"
    	]
    },
    	"video/x-ms-asf": {
    	source: "apache",
    	extensions: [
    		"asf",
    		"asx"
    	]
    },
    	"video/x-ms-vob": {
    	source: "apache",
    	extensions: [
    		"vob"
    	]
    },
    	"video/x-ms-wm": {
    	source: "apache",
    	extensions: [
    		"wm"
    	]
    },
    	"video/x-ms-wmv": {
    	source: "apache",
    	compressible: false,
    	extensions: [
    		"wmv"
    	]
    },
    	"video/x-ms-wmx": {
    	source: "apache",
    	extensions: [
    		"wmx"
    	]
    },
    	"video/x-ms-wvx": {
    	source: "apache",
    	extensions: [
    		"wvx"
    	]
    },
    	"video/x-msvideo": {
    	source: "apache",
    	extensions: [
    		"avi"
    	]
    },
    	"video/x-sgi-movie": {
    	source: "apache",
    	extensions: [
    		"movie"
    	]
    },
    	"video/x-smv": {
    	source: "apache",
    	extensions: [
    		"smv"
    	]
    },
    	"x-conference/x-cooltalk": {
    	source: "apache",
    	extensions: [
    		"ice"
    	]
    },
    	"x-shader/x-fragment": {
    	compressible: true
    },
    	"x-shader/x-vertex": {
    	compressible: true
    }
    };

    var db$1 = /*#__PURE__*/Object.freeze({
        default: db
    });

    var require$$0 = ( db$1 && db ) || db$1;

    /*!
     * mime-db
     * Copyright(c) 2014 Jonathan Ong
     * MIT Licensed
     */

    /**
     * Module exports.
     */

    var mimeDb = require$$0;

    var db$2 = /*#__PURE__*/Object.freeze({
        default: mimeDb,
        __moduleExports: mimeDb
    });

    // import * as mimetype from 'mime-types';
    var mimeData = db$2;
    var extToMime = {};
    Object.keys(mimeData).reduce(function (prev, type) {
        var info = mimeData[type];
        if (info.extensions) {
            info.extensions.reduce(function (_, ext) {
                _[ext] = type;
                return _;
            }, prev);
        }
        return prev;
    }, extToMime);
    function argumentsToString() {
        return arguments.toString();
    }
    var ARGUMENT_TO_STRING = argumentsToString();
    function isTypedArray(value) {
        if (value === undefined || value === null) {
            return false;
        }
        return (Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name ===
            'TypedArray');
    }
    function mime(input) {
        if (typeof input === 'string') {
            var ext = input.replace(/^.*\.([a-z]+)$/i, '$1');
            return extToMime[ext];
        }
        else {
            if (input instanceof ArrayBuffer) {
                input = new Uint8Array(input);
            }
            else {
                input = new Uint8Array(input.buffer);
            }
            return fileType_1(null, input).mime;
        }
    }

    function transformFilesParameterFilter(options, chain) {
        if (!options.files || typeof FormData === 'undefined') {
            return chain.next(options);
        }
        var formdata = new FormData();
        var files = options.files;
        if (!(files instanceof Array)) {
            files = [files];
        }
        files.forEach(function (file) {
            if (file instanceof File) {
                formdata.append(file.filename, file);
            }
            else {
                var data = file.data || file;
                var filename = file.filename || file.name;
                var partname = file.name || data.name || filename;
                if (typeof data === 'string') {
                    var type = mime(filename) ||
                        file.type ||
                        options.contentType ||
                        'text/plain';
                    data = new Blob([data], {
                        type: type,
                    });
                }
                else if (isTypedArray(data)) {
                    var type = mime(data) ||
                        file.type ||
                        options.contentType ||
                        'application/octet-stream';
                    data = new Blob(data, {
                        type: type,
                    });
                }
                else if (!(data instanceof Blob)) {
                    var type = mime(data) ||
                        file.type ||
                        options.contentType ||
                        'application/json';
                    data = new Blob([JSON.stringify(data)], {
                        type: type,
                    });
                }
                formdata.append(partname, data, filename);
            }
        });
        options.formdata = formdata;
        options.contentType = undefined;
        return chain.next(options);
    }

    var api = new SuperAgentAjaxAPI();
    var Ajax = /** @class */ (function () {
        function Ajax(options) {
            this.url = options.url;
            this.method = options.method;
            if (options.filters) {
                this.requestFilters = this.cloneFilters(options.filters.request);
                this.responseErrorFilters = this.cloneFilters(options.filters.failure);
                this.responseSuccessFilters = this.cloneFilters(options.filters.success);
            }
            this.endpoint = options.endpoint;
            this.config = options.config;
        }
        Ajax.prototype.clone = function () {
            return new Ajax({
                url: this.url,
                method: this.method,
                filters: {
                    request: this.cloneFilters(this.requestFilters),
                    failure: this.cloneFilters(this.responseErrorFilters),
                    success: this.cloneFilters(this.responseSuccessFilters),
                },
                endpoint: this.endpoint,
                config: this.config,
            });
        };
        Ajax.prototype.request = function (options) {
            var _this = this;
            if (!options) {
                options = {};
            }
            var responseSuccessFilters = this.resolveResponseSuccessFilters(options.filters ? options.filters.success : undefined);
            var responseErrorFilters = this.resolveResponseErrorFilters(options.filters ? options.filters.failure : undefined);
            var doRequestFilter = function (requestOptions, chain) {
                var resolvedOptions = _this.resolveRequestOptions(requestOptions);
                return api
                    .request(__assign({}, resolvedOptions))
                    .then(function (response) {
                    var result = new FilterChain(responseSuccessFilters, 0).start(response);
                    if (result instanceof Promise) {
                        return result.then(null, doErrorResponse);
                    }
                    else {
                        return result;
                    }
                }, doErrorResponse);
                function doErrorResponse(reason) {
                    var result = new FilterChain(responseErrorFilters, 0).start(reason);
                    return Promise.reject(result);
                }
            };
            var requestFilters = this.resolveRequestFilters(options.filters ? options.filters.request : undefined, doRequestFilter);
            return new FilterChain(requestFilters, 0).start(__assign({}, options, { apiConfig: this.config, url: this.url }));
        };
        Ajax.prototype.resolveRequestOptions = function (options) {
            var url = options.url;
            var method = options.method || this.method;
            var queries = options.queries;
            var credential;
            if (this.config.credential || options.credential) {
                credential = Object.assign({}, this.config.credential, options.credential);
            }
            var headers = Object.assign({}, this.config.headers, options.headers);
            return {
                method: method,
                url: url,
                credential: credential,
                queries: queries,
                payload: options.formdata,
                headers: headers,
                contentType: options.contentType,
                responseType: options.responseType,
            };
        };
        Ajax.prototype.resolveRequestFilters = function (optionFilters, doRequestFilter) {
            return this.concatFilters(optionFilters, this.requestFilters, this.endpoint.requestFilters, transformFilesParameterFilter, doRequestFilter);
        };
        Ajax.prototype.resolveResponseErrorFilters = function (optionFilters) {
            return this.concatFilters(optionFilters, this.responseErrorFilters, this.endpoint.responseErrorFilters);
        };
        Ajax.prototype.resolveResponseSuccessFilters = function (optionFilters) {
            return this.concatFilters(optionFilters, this.responseSuccessFilters, this.endpoint.responseSuccessFilters);
        };
        Ajax.prototype.concatFilters = function () {
            var filters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                filters[_i] = arguments[_i];
            }
            return filters
                .filter(function (filter) { return !!filter; })
                .reduce(function (all, item) {
                return all.concat(item);
            }, []);
        };
        Ajax.prototype.cloneFilters = function (filters) {
            return Array.isArray(filters)
                ? filters.slice(0)
                : filters
                    ? [filters]
                    : [];
        };
        return Ajax;
    }());

    var requestOptionFields = [
        'pathVariables',
        'queries',
        'headers',
        'formdata',
    ];
    function validateRequiredParameterFilters (ajaxConfig) {
        return requestOptionFields
            .filter(function (name) { return !!ajaxConfig[name]; })
            .map(function (field) { return createFilter(ajaxConfig[field], field); });
        function createFilter(paramConfigs, field) {
            return function (options, chain) {
                var pairs = options[field];
                if (pairs === undefined) {
                    pairs = options[field] = {};
                }
                for (var _i = 0, paramConfigs_1 = paramConfigs; _i < paramConfigs_1.length; _i++) {
                    var paramConfig = paramConfigs_1[_i];
                    var paramName = paramConfig.name;
                    var value = void 0;
                    if (typeof FormData !== 'undefined' && pairs instanceof FormData) {
                        value = pairs.get(paramName);
                    }
                    else {
                        value = pairs[paramName];
                    }
                    if (paramConfig.required !== false &&
                        value === undefined &&
                        paramConfig.defaultValue === undefined) {
                        return chain.error(new Error("Required parameter '" + paramName + "' of " + field + " is missing and 'defaultValue' of api config is not defined."));
                    }
                }
                return chain.next(options);
            };
        }
    }

    var requestOptionFields$1 = [
        'pathVariables',
        'queries',
        'headers',
        'formdata',
    ];
    function defaultValueFilter (ajaxConfig) {
        return requestOptionFields$1
            .filter(function (name) { return !!ajaxConfig[name]; })
            .map(function (field) { return createFilter(ajaxConfig[field], field); });
        function createFilter(paramConfigs, field) {
            return function (options, chain) {
                var pairs = options[field];
                if (!pairs) {
                    pairs = options[field] = {};
                }
                for (var _i = 0, paramConfigs_1 = paramConfigs; _i < paramConfigs_1.length; _i++) {
                    var paramConfig = paramConfigs_1[_i];
                    var paramName = paramConfig.name;
                    var value = void 0;
                    if (paramConfig.defaultValue === undefined) {
                        return chain.next(options);
                    }
                    if (pairs instanceof FormData) {
                        value = pairs.get(paramName);
                    }
                    else {
                        value = pairs[paramName];
                    }
                    if (value === undefined) {
                        value = paramConfig.defaultValue;
                    }
                    if (pairs instanceof FormData) {
                        pairs.set(name, value);
                    }
                    else {
                        pairs[name] = value;
                    }
                }
                return chain.next(options);
            };
        }
    }

    var requestOptionFields$2 = [
        'pathVariables',
        'queries',
        'headers',
        'formdata',
    ];
    function optionsValidatorFilters (ajaxConfig) {
        return requestOptionFields$2
            .filter(function (name) { return !!ajaxConfig[name]; })
            .map(function (field) { return createFilter(ajaxConfig[field], field); });
        function createFilter(paramConfigs, field) {
            return function (options, chain) {
                for (var _i = 0, paramConfigs_1 = paramConfigs; _i < paramConfigs_1.length; _i++) {
                    var paramConfig = paramConfigs_1[_i];
                    var validator = paramConfig.validator;
                    options = JSON.parse(JSON.stringify(options));
                    var pairs = options[field];
                    if (!pairs) {
                        pairs = options[field] = {};
                    }
                    var paramName = paramConfig.name;
                    var value = void 0;
                    if (typeof FormData !== 'undefined' && pairs instanceof FormData) {
                        value = pairs.get(paramName);
                    }
                    else {
                        value = pairs[paramName];
                    }
                    if (validator !== undefined &&
                        validator.call(paramConfig, value, options)) {
                        throw new Error("Parameter '" + paramName + "' validation failed: " + value + "\r\nurl: " + ajaxConfig.url);
                    }
                }
                return chain.next(options);
            };
        }
    }

    // const PATH_VARIABLE_REGEX = /\$\{([^\}]+)\}/g;
    function mkreg(str) {
        return str.replace(/([\$\[\]\(\)\{\}\^\+\.\*\?\\\-])/g, '\\$1');
    }
    /**
     *
     * @param {string} text - template string
     * @param {string} [prefix='${'] - 占位符 前缀
     * @param {string} [suffix='}'] - 占位符后缀
     * @param {boolean} [useReg=false] - 如果为true,则不会替换占位符的正则表达式的特殊符号， 默认为false
     */
    function parse(text, prefix, suffix, useReg) {
        if (prefix === void 0) { prefix = '${'; }
        if (suffix === void 0) { suffix = '}'; }
        if (useReg === void 0) { useReg = false; }
        if (typeof text !== 'string') {
            return merge.bind(null, []);
        }
        var prefReg = !useReg ? mkreg(prefix) : prefix;
        var sufReg = !useReg ? mkreg(suffix) : suffix;
        var reg = new RegExp(prefReg + "(.*?)" + sufReg, 'g');
        var compiled = [];
        var lastIndex = 0;
        while (true) {
            var result = reg.exec(text);
            if (result === null) {
                break;
            }
            var match = result[0];
            var key = result[1];
            var index = result.index;
            compiled.push(textplain.bind(null, text.slice(lastIndex, index)));
            compiled.push(placeholder.bind(null, key));
            lastIndex = index + match.length;
        }
        compiled.push(textplain.bind(null, text.slice(lastIndex)));
        return new Template(merge.bind(null, compiled));
    }
    function textplain(text, variables) {
        return text;
    }
    function placeholder(key, variables, notFound) {
        if (!variables) {
            return '';
        }
        if (key in variables) {
            return variables[key];
        }
        else if (notFound !== undefined) {
            return notFound(key);
        }
        return '';
    }
    function merge(compiled, variables, notFound) {
        if (!variables) {
            variables = {};
        }
        return compiled.map(function (parser) { return parser(variables, notFound); }).join('');
    }
    var Template = /** @class */ (function () {
        function Template(parsed) {
            this.parsed = parsed;
        }
        Template.prototype.execute = function (variables, notFound) {
            return this.parsed(variables, notFound);
        };
        Template.parse = parse;
        return Template;
    }());
    var res = Template.parse('http://127.0.0.1:8989/api/:who/:where/', ':', '(?=(/|\\\\))', true).execute({
        who: 'maria',
        where: 'USA'
    }, function notFound(key) {
        return ':' + key;
    });
    console.info(res);

    var templateCache = {};
    function pathVariableFilter(options, chain) {
        var variables = options.apiConfig.pathVariables;
        var vars = options.pathVariables || {};
        if (variables) {
            variables.forEach(function (variable) {
                var name = variable.name;
                var defaultValue = variable.defaultValue;
                if (vars[name] === undefined && defaultValue !== undefined) {
                    vars[name] = defaultValue;
                }
            });
        }
        var encodedVariables = {};
        for (var _i = 0, _a = Object.entries(vars); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var decoded = value;
            try {
                decoded = decodeURI(decoded);
            }
            catch (error) {
                // ignored
            }
            encodedVariables[key] = encodeURI(decoded);
        }
        options.pathVariables = encodedVariables;
        var template = templateCache[options.url];
        if (!template) {
            template = templateCache[options.url] = Template.parse(options.url, ':', '(?=(/|\\\\|\\.))', true);
        }
        options.url = template.execute(encodedVariables, function (key) { return ":" + key; });
        return chain.next(options);
    }

    function queriesFilter (options, chain) {
        var queries = options.queries || {};
        var queriesConfig = options.apiConfig.queries;
        if (queriesConfig) {
            queriesConfig.forEach(function (query) {
                var name = query.name;
                if (query.defaultValue !== undefined &&
                    queries[name] === undefined) {
                    queries[name] = query.defaultValue;
                }
            });
        }
        options.queries = queries;
        return chain.next(options);
    }

    function jsonParameterFilter(options, chain) {
        if (options.json) {
            if (typeof options.json === 'string') {
                options.formdata = JSON.parse(options.json);
            }
            else {
                options.formdata = options.json;
            }
            options.contentType = 'application/json';
        }
        return chain.next(options);
    }

    var OPPORTUNITY_RESPONSE_ERROR = 'response-error';
    var OPPORTUNITY_REQUEST = 'request';
    var OPPORTUNITY_RESPONSE_SUCCESS = 'response-success';
    var Endpoint = /** @class */ (function () {
        function Endpoint(server, basePath) {
            if (basePath === void 0) { basePath = ''; }
            this.server = server;
            this.basePath = basePath;
            this.requestFilters = [pathVariableFilter, queriesFilter];
            this.responseSuccessFilters = [];
            this.responseErrorFilters = [];
            this.apis = new Map();
        }
        Endpoint.prototype.addFilter = function (filter, opportunity) {
            switch (opportunity) {
                case FilterOpportunity.REQUEST:
                    this.requestFilters = this.requestFilters.concat(filter);
                    break;
                case FilterOpportunity.RESPONSE_ERROR:
                    this.responseErrorFilters = this.responseErrorFilters.concat(filter);
                    break;
                case FilterOpportunity.RESPONSE_SUCCESS:
                    this.responseSuccessFilters = this.responseSuccessFilters.concat(filter);
                    break;
                default:
                    throw new Error("Unexpected opportunity value: " + opportunity);
            }
            return this;
        };
        Endpoint.prototype.registerAPI = function (name, config) {
            if (this.apis.has(name)) {
                throw new Error("Duplicated api name: " + name);
            }
            var path = config.path, _a = config.method, method = _a === void 0 ? 'GET' : _a;
            var url = config.url;
            if (!url && !path) {
                throw new Error('API configuration error: missing "url" and "path"');
            }
            else if (!url) {
                url = join(this.server, this.basePath, path || '');
            }
            var filters = {
                request: [],
                success: [],
                failure: [],
            };
            filters.request = filters.request
                .concat(validateRequiredParameterFilters(config))
                .concat(defaultValueFilter(config))
                .concat(optionsValidatorFilters(config));
            if (config.formdata) {
                filters.request.unshift(jsonParameterFilter);
            }
            var apiFilters = config.filters;
            if (apiFilters && apiFilters.request) {
                if (typeof apiFilters.request === 'function') {
                    filters.request.unshift(apiFilters.request);
                }
                else if (Array.isArray(apiFilters.request)) {
                    filters.request = apiFilters.request.concat(filters.request);
                }
            }
            var cachedApiConfig = __assign({}, config, { url: url,
                method: method, original: config, filters: __assign({}, filters) });
            this.apis.set(name, cachedApiConfig);
            return this;
        };
        Endpoint.prototype.configure = function (_a) {
            var _this = this;
            var basePath = _a.basePath, filters = _a.filters, apis = _a.apis;
            if (basePath) {
                this.basePath = basePath;
            }
            if (filters) {
                this.addFilters(filters.request, FilterOpportunity.REQUEST);
                this.addFilters(filters.failure, FilterOpportunity.RESPONSE_ERROR);
                this.addFilters(filters.success, FilterOpportunity.RESPONSE_SUCCESS);
            }
            if (apis) {
                Object.keys(apis).forEach(function (name) {
                    return _this.registerAPI(name, apis[name]);
                });
            }
            return this;
        };
        Endpoint.prototype.api = function (name) {
            if (!this.apis.has(name)) {
                throw new Error("api '" + name + "' has not been registered!");
            }
            var config = this.apis.get(name);
            if (!config) {
                return;
            }
            return new Ajax({
                url: config.url || '',
                endpoint: this,
                method: config.method || HttpMethod.GET,
                config: config || {},
                filters: config.filters,
            });
        };
        Endpoint.prototype.addFilters = function (filters, opt) {
            var _this = this;
            if (filters && !(filters instanceof Array)) {
                filters = [filters];
            }
            filters.filter(function (filter) { return !!filter; }).forEach(function (filter) {
                _this.addFilter(filter, FilterOpportunity.REQUEST);
            });
        };
        Endpoint.OPPORTUNITY_REQUEST = OPPORTUNITY_REQUEST;
        Endpoint.OPPORTUNITY_RESPONSE_ERROR = OPPORTUNITY_RESPONSE_ERROR;
        Endpoint.OPPORTUNITY_RESPONSE_SUCCESS = OPPORTUNITY_RESPONSE_SUCCESS;
        return Endpoint;
    }());

    var index = {
        Endpoint: Endpoint,
        FilterChain: FilterChain,
    };

    return index;

})));
//# sourceMappingURL=index.full.js.map
