import { Filter } from './FilterChain';
import { IAPIConfig, FilterOpportunity, IEndpointConfigure } from './types';
import IAjaxAPI from './AjaxAPI';
export default class Endpoint {
    private server;
    private basePath;
    private ajaxAPI;
    static OPPORTUNITY_REQUEST: string;
    static OPPORTUNITY_RESPONSE_ERROR: string;
    static OPPORTUNITY_RESPONSE_SUCCESS: string;
    requestFilters: Filter[];
    responseSuccessFilters: Filter[];
    responseErrorFilters: Filter[];
    private apis;
    constructor(server: string, basePath?: string, ajaxAPI?: IAjaxAPI);
    addFilter(filter: Filter, opportunity: FilterOpportunity): Endpoint;
    registerAPI(name: string, config: IAPIConfig): Endpoint;
    configure({basePath, filters, apis}: IEndpointConfigure): Endpoint;
    api(name: string): any;
    private addFilters(filters, opt);
}
