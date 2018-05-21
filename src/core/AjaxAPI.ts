import { HttpMethod, Primitive, ProgressHandler, AbortHandler} from "./types";

export interface IQueriesData { [key:string]: Primitive };
export interface IHeadersData { [key:string]: Primitive};
export interface ICredencial {
    username: string,
    password: string
}
export type Payload = ArrayBuffer | Blob | string | FormData | IQueriesData;

export type ResponseType = 'blob' | 'arraybuffer';


export interface IRequestOptions {
    method?: HttpMethod;
    url: string,
    credencial?: ICredencial;
    queries?: IQueriesData;
    payload?: Payload;
    headers?: IHeadersData;
    onprogress?: ProgressHandler;
    onabort?: AbortHandler;
    contentType?: string;
    responseType?: ResponseType;
    timeout?: number
}

export default interface IAjaxAPI {
    request(options: IRequestOptions):Promise<any>;
}
