import { Filter } from './FilterChain';
export declare type Primitive = string | boolean | number;
export declare type IDirection = 'download' | 'upload';
export declare type TypedArray = Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;
export declare type StreamData = File | Blob | ArrayBuffer | TypedArray;
export declare type ResponseType = 'blob' | 'arraybuffer';
export interface IQueriesData {
    [key: string]: Primitive;
}
export interface IHeadersData {
    [key: string]: string;
}
export interface IFormData {
    [key: string]: string;
}
export interface IPathVariables {
    [key: string]: Primitive;
}
export declare enum HttpMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    PATCH = 4,
    HEAD = 5,
}
export declare enum FilterOpportunity {
    REQUEST = 0,
    RESPONSE_SUCCESS = 1,
    RESPONSE_ERROR = 2,
}
export interface IFiltersConfig {
    request?: Filter | Filter[];
    success?: Filter | Filter[];
    failure?: Filter | Filter[];
}
export interface Progress {
    direction: IDirection;
    loaded: number;
    percent?: number;
    total?: number;
}
export declare type ProgressHandler = (prog: Progress) => void;
export declare type AbortHandler = () => void;
export declare type ErrorHandler = (err: any) => void;
export interface IListeners {
    progresss: ProgressHandler;
    abort: AbortHandler;
    error: ErrorHandler;
}
export declare type RequestParamField = 'pathVariables' | 'queries' | 'headers' | 'formdata';
export interface IParamConfig {
    name: string;
    defaultValue?: Primitive;
    required?: boolean;
    validator?: Validator;
}
export interface IQueryConfig extends IParamConfig {
    defaultValue?: Primitive;
}
export interface IHeaderConfig extends IParamConfig {
    defaultValue: string;
}
export interface IPathVariable extends IParamConfig {
    defaultValue?: string;
}
export interface IFormdataConfig extends IParamConfig {
    defaultValue?: Primitive;
}
export declare const ajaxAPIParameterFields: RequestParamField[];
export interface IAPIConfig {
    [key: string]: any;
    url?: string;
    path?: string;
    method: HttpMethod;
    pathVariables?: IPathVariable[];
    queries?: IQueryConfig[];
    headers?: IHeaderConfig[];
    formdata?: IFormdataConfig[];
    filters?: IFiltersConfig;
    listeners?: IListeners;
    credential?: ICredential;
}
export interface ICredential {
    username: string;
    password: string;
}
export interface IAjaxRequestOptions {
    [key: string]: any;
    method?: HttpMethod;
    queries?: IQueriesData;
    headers?: IHeadersData;
    pathVariables?: IPathVariables;
    filters?: IFiltersConfig;
    credential?: ICredential;
    formdata?: FormData | IFormData;
    files?: StreamData | string | string[] | StreamData[] | object | object[];
    json?: string;
    contentType?: string;
    responseType?: ResponseType;
}
export interface InternalAjaxRequestOptions extends IAjaxRequestOptions {
    apiConfig: IAPIConfig;
    url: string;
}
export declare type Validator = (value: any, params: IAjaxRequestOptions) => boolean;
export interface ResponseError extends Error {
    status: number;
    text: string;
    method: string;
    path: string;
}
export declare type CallbackHandler = (err: any, res: AjaxResponse) => void;
export interface IEndpointConfigure {
    basePath: string;
    filters: IFiltersConfig;
    apis: {
        [name: string]: IAPIConfig;
    };
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
    headers: IHeadersData;
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
    progress(handler: ProgressHandler): void;
    on(name: 'abort', handler: AbortHandler): void;
    on(name: 'error', handler: ErrorHandler): void;
    on(name: string, handler: (event: any) => void): void;
    retry(count: number, callback: CallbackHandler): void;
    then(fullfilled?: (value: any) => any, onrejected?: ((reason: any) => any)): AjaxRequest;
    catch(onrejected?: ((reason: any) => any)): AjaxRequest;
}
