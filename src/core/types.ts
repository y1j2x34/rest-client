import {Filter} from './FilterChain';

export type Primitive = string | boolean | number;
export type IDirection = 'download' | 'upload';

export enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD
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

export type ProgressHandler = (prog: {
    direction: IDirection,
    loaded: number,
    percent?: number,
    total?: number
}) => void;
export type AbortHandler = () => void;
export type ErrorHandler = (err: any) => void;

export interface IListeners {
    progresss : ProgressHandler;
    abort : AbortHandler;
    error : ErrorHandler;
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

export interface ResponseError extends Error {
    status: number;
    text: string;
    method: string;
    path: string;
}

export type CallbackHandler = (err: any, res: AjaxResponse) => void;

export interface IEndpointConfigure {
    basePath: string;
    filters: IFiltersConfig,
    apis:{ [name: string]:IAPIConfig }
}
export interface AjaxResponse {
    accepted: boolean;
    badRequest: boolean;
    body: any;
    charset: string;
    clientError: boolean;
    error: ResponseError;
    files: any;
    forbidden: boolean;
    header: any;
    info: boolean;
    noContent: boolean;
    notAcceptable: boolean;
    notFound: boolean;
    ok: boolean;
    redirect: boolean;
    serverError: boolean;
    status: number;
    statusType: number;
    text: string;
    type: string;
    unauthorized: boolean;
    getHeader(name: string): string;
}
export interface AjaxRequest extends Promise<any> {
    abort(): void;
    progress(handler: ProgressHandler):void;
    on(name: 'abort', handler: AbortHandler):void;
    on(name: 'error', handler: ErrorHandler):void;
    on(name: string, handler: (event: any) => void ):void;
    retry(count: number, callback: CallbackHandler):void;
}
