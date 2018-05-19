import {Filter} from './FilterChain';

export type Primitive = string | boolean | number;

export enum HttpMethod {
    GET,
    POST,
    PUT
}
export enum FilterOpportunity {
    REQUEST,
    RESPONSE_SUCCESS,
    RESPONSE_ERROR,
}
export interface IFiltersConfig {
    request?: Filter | Filter[];
    responseSuccess : Filter | Filter[];
    responseError : Filter | Filter[];
}
export type ProgressListener = () => void;
export type AbortListener = () => void;
export type ErrorListener = () => void;
export type LoadListener = () => void;
export type LoadStartListener = () => void;
export type LoadEndListener = () => void;

export interface IListeners {
    progresss : ProgressListener;
    abort : AbortListener;
    error : ErrorListener;
    load : LoadListener;
    loadstart : LoadStartListener;
    loadend : LoadEndListener;
}
export interface IQueryConfig {
    name : string;
    defaultValue?: Primitive;
    required?: boolean;
    validator?: Validator;
}

export interface IHeaderConfig {
    name : string;
    defaultValue : string | string[];
    required?: boolean
}

export interface IPathVariable {
    name : string;
    defaultValue?: Primitive;
}
export interface IAPIConfig {
    url?: string;
    path?: string;
    method : HttpMethod;
    pathVariable?: IPathVariable[];
    queries?: IQueryConfig[];
    headers?: IHeaderConfig[];
    filters?: IFiltersConfig;
    listeners?: IListeners;
}

export type Validator = (value : any, params : object) => boolean;

export interface IEndpointConfigure {
    basePath: string;
    filters: IFiltersConfig,
    apis:{ [name: string]:IAPIConfig }
}
