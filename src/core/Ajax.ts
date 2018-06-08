import {
    IFiltersConfig,
    HttpMethod,
    IAPIConfig,
    IAjaxRequestOptions,
    AjaxRequest,
    InternalAjaxRequestOptions,
} from './types';
import Endpoint from './Endpoint';
import FilterChain, { Filter } from './FilterChain';
import IAjaxAPI, { IRequestOptions } from './AjaxAPI';
import { filters } from './internal/filters';

export type FiltersType = undefined | Filter | Filter[];

export interface AjaxOptions {
    url: string;
    filters?: IFiltersConfig;
    endpoint: Endpoint;
    method: HttpMethod;
    config: IAPIConfig;
}

export default class Ajax {
    private url: string;
    private requestFilters: Filter[];
    private responseSuccessFilters: Filter[];
    private responseErrorFilters: Filter[];
    private endpoint: Endpoint;
    private method: HttpMethod;
    private config: IAPIConfig;
    constructor(private ajaxApi: IAjaxAPI, options: AjaxOptions) {
        this.url = options.url;
        this.method = options.method;
        if (options.filters) {
            this.requestFilters = this.cloneFilters(options.filters.request);
            this.responseErrorFilters = this.cloneFilters(
                options.filters.failure
            );
            this.responseSuccessFilters = this.cloneFilters(
                options.filters.success
            );
        }
        this.endpoint = options.endpoint;
        this.config = options.config;
    }
    public clone(): Ajax {
        return new Ajax(this.ajaxApi, {
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
    }
    public request(options?: IAjaxRequestOptions): AjaxRequest {
        if (!options) {
            options = {};
        }

        const responseSuccessFilters = this.resolveResponseSuccessFilters(
            options.filters ? options.filters.success : undefined
        );
        const responseErrorFilters = this.resolveResponseErrorFilters(
            options.filters ? options.filters.failure : undefined
        );

        const doRequestFilter = (
            requestOptions: InternalAjaxRequestOptions,
            chain: FilterChain
        ) => {
            const resolvedOptions = this.resolveRequestOptions(requestOptions);
            return this.ajaxApi
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
        return new FilterChain(requestFilters, 0).start({
            ...options,
            apiConfig: this.config,
            url: this.url,
        });
    }
    private resolveRequestOptions(
        options: IAjaxRequestOptions
    ): IRequestOptions {
        const url: string = options.url;
        const method = options.method || this.method;
        const queries = options.queries;
        let credential;
        if (this.config.credential || options.credential) {
            credential = Object.assign(
                {},
                this.config.credential,
                options.credential
            );
        }
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
            filters.files(),
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
    private concatFilters(...filtersArray: FiltersType[]): Filter[] {
        return filtersArray
            .filter(filter => !!filter)
            .reduce((all: FiltersType, item: FiltersType) => {
                return (all as Filter[]).concat(item as Filter | Filter[]);
            }, []) as Filter[];
    }
    private cloneFilters(filtersArray?: Filter | Filter[]): Filter[] {
        return Array.isArray(filtersArray)
            ? filtersArray.slice(0)
            : filtersArray
                ? [filtersArray]
                : [];
    }
}
