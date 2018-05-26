import { IFiltersConfig, HttpMethod, IAPIConfig, IAjaxRequestOptions, AjaxRequest } from './types';
import Endpoint from './Endpoint';
import { Filter } from './Filterchain';
export declare type FiltersType = undefined | Filter | Filter[];
export interface AjaxOptions {
    url: string;
    filters?: IFiltersConfig;
    endpoint: Endpoint;
    method: HttpMethod;
    config: IAPIConfig;
}
export default class Ajax {
    private url;
    private requestFilters;
    private responseSuccessFilters;
    private responseErrorFilters;
    private endpoint;
    private method;
    private config;
    constructor(options: AjaxOptions);
    clone(): Ajax;
    request(options?: IAjaxRequestOptions): AjaxRequest;
    private resolveRequestOptions(options);
    private resolveRequestFilters(optionFilters, doRequestFilter);
    private resolveResponseErrorFilters(optionFilters);
    private resolveResponseSuccessFilters(optionFilters);
    private concatFilters(...filters);
    private cloneFilters(filters?);
}
