import { Filter } from './Filterchain';
import { IAPIConfig, FilterOpportunity, IEndpointConfigure } from './types';
export default class Endpoint {
    private server;
    private basePath;
    static OPPORTUNITY_REQUEST: string;
    static OPPORTUNITY_RESPONSE_ERROR: string;
    static OPPORTUNITY_RESPONSE_SUCCESS: string;
    private requestFilters;
    private responseSuccessFilters;
    private responseErrorFilters;
    private apis;
    constructor(server: string, basePath: string);
    addFilter(filter: Filter, opportunity: FilterOpportunity): Endpoint;
    registerAPI(name: string, config: IAPIConfig): Endpoint;
    configure({basePath, filters, apis}: IEndpointConfigure): Endpoint;
    private addFilters(filters, opt);
}
