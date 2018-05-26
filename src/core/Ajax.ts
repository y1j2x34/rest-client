import {
    IFiltersConfig,
    HttpMethod,
    IAPIConfig,
    IAjaxRequestOptions,
    AjaxRequest,
} from './types';
import Endpoint from './Endpoint';
import FilterChain, { Filter } from './Filterchain';
import { IRequestOptions } from './AjaxAPI';
import SuperAgentAjaxAPI from '../ajax/SuperAgentAjaxAPI';
import transformFilesParameterFilter from './internal/transformFilesParameterFilter';

export type FiltersType = undefined | Filter | Filter[];

export interface AjaxOptions {
    url: string;
    filters?: IFiltersConfig;
    endpoint: Endpoint;
    method: HttpMethod;
    config: IAPIConfig;
}

const api = new SuperAgentAjaxAPI();

export default class Ajax {
    private url: string;
    private requestFilters: Filter[];
    private responseSuccessFilters: Filter[];
    private responseErrorFilters: Filter[];
    private endpoint: Endpoint;
    private method: HttpMethod;
    private config: IAPIConfig;
    constructor(options: AjaxOptions) {
        this.url = options.url;
        this.method = options.method;
        if (options.filters) {
            this.requestFilters = this.cloneFilters(options.filters.request);
            this.responseErrorFilters = this.cloneFilters(
                options.filters.request
            );
            this.responseSuccessFilters = this.cloneFilters(
                options.filters.request
            );
        }
        this.endpoint = options.endpoint;
        this.config = options.config;
    }
    public clone(): Ajax {
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
    }
    public request(options?: IAjaxRequestOptions): AjaxRequest {
        if (!options) {
            options = {};
        }

        const responseSuccessFilters = this.resolveResponseSuccessFilters(
            options.filters ? options.filters.responseSuccess : undefined
        );
        const responseErrorFilters = this.resolveResponseErrorFilters(
            options.filters ? options.filters.responseError : undefined
        );

        const doRequestFilter = (
            requestOptions: IAjaxRequestOptions,
            chain: FilterChain
        ) => {
            const resolvedOptions = this.resolveRequestOptions(requestOptions);
            return api
                .request({
                    ...resolvedOptions,
                })
                .then(response => {
                    const result = new FilterChain(
                        responseSuccessFilters,
                        0
                    ).start(response);
                    if (result instanceof Promise) {
                        return result.then(null, doErrorResponse);
                    } else {
                        return result;
                    }
                }, doErrorResponse);

            function doErrorResponse(reason: any) {
                const result = new FilterChain(responseErrorFilters, 0).start(
                    reason
                );
                return Promise.reject(result);
            }
        };
        const requestFilters = this.resolveRequestFilters(
            options.filters ? options.filters.request : undefined,
            doRequestFilter
        );
        return new FilterChain(requestFilters, 0).start(options);
    }
    private resolveRequestOptions(
        options: IAjaxRequestOptions
    ): IRequestOptions {
        const url: string = '';
        const method = options.method || this.method;
        const queries = options.queries;
        const credential = Object.assign(
            {},
            this.config.credential,
            options.credential
        );
        const headers = Object.assign({}, this.config.headers, options.headers);
        return {
            method,
            url,
            credential,
            queries,
            payload: options.formdata,
            headers,
            contentType: options.contentType,
            responseType: options.responseType,
        };
    }
    private resolveRequestFilters(
        optionFilters: FiltersType,
        doRequestFilter: Filter
    ): Filter[] {
        return this.concatFilters(
            optionFilters,
            this.requestFilters,
            this.endpoint.requestFilters,
            transformFilesParameterFilter,
            doRequestFilter
        );
    }
    private resolveResponseErrorFilters(optionFilters: FiltersType): Filter[] {
        return this.concatFilters(
            optionFilters,
            this.responseErrorFilters,
            this.endpoint.responseErrorFilters
        );
    }
    private resolveResponseSuccessFilters(
        optionFilters: FiltersType
    ): Filter[] {
        return this.concatFilters(
            optionFilters,
            this.responseSuccessFilters,
            this.endpoint.responseSuccessFilters
        );
    }
    private concatFilters(...filters: FiltersType[]): Filter[] {
        return filters
            .filter(filter => !!filter)
            .reduce((all: FiltersType, item: FiltersType) => {
                return (all as Filter[]).concat(item as Filter | Filter[]);
            }, []) as Filter[];
    }
    private cloneFilters(filters?: Filter | Filter[]): Filter[] {
        return Array.isArray(filters)
            ? filters.slice(0)
            : filters
                ? [filters]
                : [];
    }
}
