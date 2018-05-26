(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('superagent'), require('mime-types')) :
    typeof define === 'function' && define.amd ? define(['superagent', 'mime-types'], factory) :
    (global.Rest = factory(global.request,global.mimetype));
}(this, (function (request,mimetype) { 'use strict';

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
        return paths
            .filter(function (path) { return !!path; })
            .map(function (path) {
            if (path.match(/^[a-z]+:\/{2,}.*/i)) {
                return path;
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
                    req = request.get(options.url);
                    break;
                case HttpMethod.DELETE:
                    req = request.del(options.url);
                    break;
                case HttpMethod.PATCH:
                    req = request.patch(options.url);
                    break;
                case HttpMethod.HEAD:
                    req = request.head(options.url);
                    break;
                case HttpMethod.POST:
                    req = request.post(options.url);
                    break;
                case HttpMethod.PUT:
                    req = request.put(options.url);
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

    function argumentsToString() {
        return arguments.toString();
    }
    var ARGUMENT_TO_STRING = argumentsToString();
    function isTypedArray(value) {
        return (Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name ===
            'TypedArray');
    }
    function mime(input) {
        if (typeof input === 'string') {
            return mimetype.lookup(input) || undefined;
        }
        // TODO: detect file type of buffer
        // if (input instanceof ArrayBuffer) {
        //     input = new Uint8Array(input);
        // } else {
        //     input = new Uint8Array(input.buffer);
        // }
        // return filetype.call(null, input).mime;
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
                this.responseErrorFilters = this.cloneFilters(options.filters.request);
                this.responseSuccessFilters = this.cloneFilters(options.filters.request);
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
                    responseError: this.cloneFilters(this.responseErrorFilters),
                    responseSuccess: this.cloneFilters(this.responseSuccessFilters),
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
            var responseSuccessFilters = this.resolveResponseSuccessFilters(options.filters ? options.filters.responseSuccess : undefined);
            var responseErrorFilters = this.resolveResponseErrorFilters(options.filters ? options.filters.responseError : undefined);
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
            return new FilterChain(requestFilters, 0).start(options);
        };
        Ajax.prototype.resolveRequestOptions = function (options) {
            var url = '';
            var method = options.method || this.method;
            var queries = options.queries;
            var credential = Object.assign({}, this.config.credential, options.credential);
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

    var OPPORTUNITY_RESPONSE_ERROR = 'response-error';
    var OPPORTUNITY_REQUEST = 'request';
    var OPPORTUNITY_RESPONSE_SUCCESS = 'response-success';
    var Endpoint = /** @class */ (function () {
        function Endpoint(server, basePath) {
            this.server = server;
            this.basePath = basePath;
            this.requestFilters = [];
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
            var cachedApiConfig = __assign({}, config, { url: url,
                method: method, original: config });
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
                this.addFilters(filters.responseError, FilterOpportunity.RESPONSE_ERROR);
                this.addFilters(filters.responseSuccess, FilterOpportunity.RESPONSE_SUCCESS);
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

    var TERMINAL_RESULT$1 = new Promise(function () { return undefined; });
    var FilterChain$1 = /** @class */ (function () {
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
            return TERMINAL_RESULT$1 === value;
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
            return TERMINAL_RESULT$1;
        };
        FilterChain.prototype.chainAt = function (index) {
            return new FilterChain(this.filters, index);
        };
        FilterChain.prototype.nextchain = function () {
            return this.chainAt(this.index + 1);
        };
        return FilterChain;
    }());

    var index = {
        Endpoint: Endpoint,
        FilterChain: FilterChain$1,
    };

    return index;

})));
//# sourceMappingURL=index.js.map
