import { Filter } from './FilterChain';
import { join as joinPath } from './path';
import {
    IAPIConfig,
    FilterOpportunity,
    IEndpointConfigure,
    HttpMethod,
    ajaxAPIParameterFields,
    IParamConfig,
} from './types';
import Ajax from './Ajax';
import pathVariableFilter from './internal/pathVariableFilter';
import jsonParameterFilter from './internal/jsonParameterFilter';
import IAjaxAPI from './AjaxAPI';
import SuperAgentAjaxAPI from '../ajax/SuperAgentAjaxAPI';
import queriesFilter from './internal/queriesFilter';
import { filters as filtersCreator } from './internal/filters';

type ComplexFiltersType = Filter | Filter[] | undefined;

const OPPORTUNITY_RESPONSE_ERROR = 'response-error';
const OPPORTUNITY_REQUEST = 'request';
const OPPORTUNITY_RESPONSE_SUCCESS = 'response-success';

interface ICachedAPIConfig extends IAPIConfig {
    original: IAPIConfig;
}

const superAgentAjaxAPI = new SuperAgentAjaxAPI();

export default class Endpoint {
    public static OPPORTUNITY_REQUEST: string = OPPORTUNITY_REQUEST;
    public static OPPORTUNITY_RESPONSE_ERROR: string = OPPORTUNITY_RESPONSE_ERROR;
    public static OPPORTUNITY_RESPONSE_SUCCESS: string = OPPORTUNITY_RESPONSE_SUCCESS;

    public requestFilters: Filter[] = [pathVariableFilter, queriesFilter];
    public responseSuccessFilters: Filter[] = [];
    public responseErrorFilters: Filter[] = [];
    private apis: Map<string, ICachedAPIConfig> = new Map();

    constructor(
        private server: string,
        private basePath: string = '',
        private ajaxAPI: IAjaxAPI = superAgentAjaxAPI
    ) {}

    public addFilter(filter: Filter, opportunity: FilterOpportunity): Endpoint {
        switch (opportunity) {
            case FilterOpportunity.REQUEST:
                this.requestFilters = this.requestFilters.concat(filter);
                break;
            case FilterOpportunity.RESPONSE_ERROR:
                this.responseErrorFilters = this.responseErrorFilters.concat(
                    filter
                );
                break;
            case FilterOpportunity.RESPONSE_SUCCESS:
                this.responseSuccessFilters = this.responseSuccessFilters.concat(
                    filter
                );
                break;
            default:
                throw new Error(`Unexpected opportunity value: ${opportunity}`);
        }
        return this;
    }
    public registerAPI(name: string, config: IAPIConfig): Endpoint {
        if (this.apis.has(name)) {
            throw new Error(`Duplicated api name: ${name}`);
        }
        const { path, method = 'GET' } = config;
        let { url } = config;

        if (!url && !path) {
            throw new Error(
                'API configuration error: missing "url" and "path"'
            );
        } else if (!url) {
            url = joinPath(this.server, this.basePath, path || '');
        }

        const filters: {
            request: Filter[];
            success: Filter[];
            failure: Filter[];
        } = {
            request: [],
            success: [],
            failure: [],
        };

        ajaxAPIParameterFields
            .filter(field => !!config[field])
            .map(field => {
                filters.request.push(
                    filtersCreator.validateRequired(
                        config[field] as IParamConfig[],
                        field
                    )
                );
                return field;
            })
            .map(field => {
                filters.request.push(
                    filtersCreator.defaultValue(
                        config[field] as IParamConfig[],
                        field
                    )
                );
                return field;
            })
            .map(field => {
                filters.request.push(
                    filtersCreator.validatetor(
                        config[field] as IParamConfig[],
                        field
                    )
                );
                return field;
            });

        if (config.formdata) {
            filters.request.unshift(jsonParameterFilter);
        }
        const apiFilters = config.filters;
        if (apiFilters && apiFilters.request) {
            if (typeof apiFilters.request === 'function') {
                filters.request.unshift(apiFilters.request);
            } else if (Array.isArray(apiFilters.request)) {
                filters.request = apiFilters.request.concat(filters.request);
            }
        }

        const cachedApiConfig = {
            ...config,
            url,
            method,
            original: config,
            filters: {
                ...filters,
            },
        } as ICachedAPIConfig;

        this.apis.set(name, cachedApiConfig);

        return this;
    }
    public configure({
        basePath,
        filters,
        apis,
    }: IEndpointConfigure): Endpoint {
        if (basePath) {
            this.basePath = basePath;
        }
        if (filters) {
            this.addFilters(filters.request, FilterOpportunity.REQUEST);
            this.addFilters(filters.failure, FilterOpportunity.RESPONSE_ERROR);
            this.addFilters(
                filters.success,
                FilterOpportunity.RESPONSE_SUCCESS
            );
        }
        if (apis) {
            Object.keys(apis).forEach(name =>
                this.registerAPI(name, apis[name])
            );
        }
        return this;
    }
    public api(name: string): Ajax {
        const config = this.apis.get(name);
        if (!config) {
            throw new Error(`api '${name}' has not been registered!`);
        }
        return new Ajax(this.ajaxAPI, {
            url: config.url || '',
            endpoint: this,
            method: config.method || HttpMethod.GET,
            config: config || ({} as ICachedAPIConfig),
            filters: config.filters,
            // url: config.url,
            // endpoint: this,
            // method: config.method
            // origin
        });
    }
    private addFilters(filters: ComplexFiltersType, opt: FilterOpportunity) {
        if (filters && !(filters instanceof Array)) {
            filters = [filters] as ComplexFiltersType;
        }
        (filters as Filter[]).filter(filter => !!filter).forEach(filter => {
            this.addFilter(filter, FilterOpportunity.REQUEST);
        });
    }
}
