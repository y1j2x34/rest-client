import { Filter } from './FilterChain';
export declare type Primitive = string | boolean | number;
export declare enum HttpMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
}
export declare enum FilterOpportunity {
    REQUEST = 0,
    RESPONSE_SUCCESS = 1,
    RESPONSE_ERROR = 2,
}
export interface IFiltersConfig {
    request?: Filter | Filter[];
    responseSuccess: Filter | Filter[];
    responseError: Filter | Filter[];
}
export declare type ProgressListener = () => void;
export declare type AbortListener = () => void;
export declare type ErrorListener = () => void;
export declare type LoadListener = () => void;
export declare type LoadStartListener = () => void;
export declare type LoadEndListener = () => void;
export interface IListeners {
    progresss: ProgressListener;
    abort: AbortListener;
    error: ErrorListener;
    load: LoadListener;
    loadstart: LoadStartListener;
    loadend: LoadEndListener;
}
export interface IQueryConfig {
    name: string;
    defaultValue?: Primitive;
    required?: boolean;
    validator?: Validator;
}
export interface IHeaderConfig {
    name: string;
    defaultValue: string | string[];
    required?: boolean;
}
export interface IPathVariable {
    name: string;
    defaultValue?: Primitive;
}
export interface IAPIConfig {
    url?: string;
    path?: string;
    method: HttpMethod;
    pathVariable?: IPathVariable[];
    queries?: IQueryConfig[];
    headers?: IHeaderConfig[];
    filters?: IFiltersConfig;
    listeners?: IListeners;
}
export declare type Validator = (value: any, params: object) => boolean;
export interface IEndpointConfigure {
    basePath: string;
    filters: IFiltersConfig;
    apis: {
        [name: string]: IAPIConfig;
    };
}
