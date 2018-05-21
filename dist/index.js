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
        return paths.filter(function (path) { return !!path; })
            .map(function (path) {
            if (path.match(/^[a-z]+:\/{2,}.*/i)) {
                return path;
            }
            return path.replace(replacePrefRegExp, '$1')
                .replace(replaceSepsRegExp, '/')
                .replace(replaceSufRegExp, '');
        }).join('/');
    }

    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod[HttpMethod["GET"] = 0] = "GET";
        HttpMethod[HttpMethod["POST"] = 1] = "POST";
        HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
    })(HttpMethod || (HttpMethod = {}));
    var FilterOpportunity;
    (function (FilterOpportunity) {
        FilterOpportunity[FilterOpportunity["REQUEST"] = 0] = "REQUEST";
        FilterOpportunity[FilterOpportunity["RESPONSE_SUCCESS"] = 1] = "RESPONSE_SUCCESS";
        FilterOpportunity[FilterOpportunity["RESPONSE_ERROR"] = 2] = "RESPONSE_ERROR";
    })(FilterOpportunity || (FilterOpportunity = {}));

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
                    this.requestFilters = this
                        .requestFilters
                        .concat(filter);
                    break;
                case FilterOpportunity.RESPONSE_ERROR:
                    this.responseErrorFilters = this
                        .responseErrorFilters
                        .concat(filter);
                    break;
                case FilterOpportunity.RESPONSE_SUCCESS:
                    this.responseSuccessFilters = this
                        .responseSuccessFilters
                        .concat(filter);
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
            this.apis
                .set(name, __assign({}, config, { url: url,
                method: method, original: config }));
            return this;
        };
        Endpoint.prototype.configure = function (_a) {
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
                for (var _i = 0, _b = Object.entries(apis); _i < _b.length; _i++) {
                    var _c = _b[_i], name = _c[0], apiconfig = _c[1];
                    this.registerAPI(name, apiconfig);
                }
            }
            return this;
        };
        Endpoint.prototype.addFilters = function (filters, opt) {
            var _this = this;
            if (filters && !(filters instanceof Array)) {
                filters = [filters];
            }
            filters
                .filter(function (filter) { return !!filter; })
                .forEach(function (filter) {
                _this.addFilter(filter, FilterOpportunity.REQUEST);
            });
        };
        Endpoint.OPPORTUNITY_REQUEST = OPPORTUNITY_REQUEST;
        Endpoint.OPPORTUNITY_RESPONSE_ERROR = OPPORTUNITY_RESPONSE_ERROR;
        Endpoint.OPPORTUNITY_RESPONSE_SUCCESS = OPPORTUNITY_RESPONSE_SUCCESS;
        return Endpoint;
    }());

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

    var index = {
        Endpoint: Endpoint,
        FilterChain: FilterChain
    };

    return index;

})));
//# sourceMappingURL=index.js.map
