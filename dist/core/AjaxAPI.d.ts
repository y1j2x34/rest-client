import { HttpMethod, ProgressHandler, AbortHandler, AjaxRequest, ICredential, IQueriesData, IHeadersData, ResponseType } from './types';
export declare type Payload = ArrayBuffer | Blob | string | FormData | IQueriesData;
export interface IRequestOptions {
    method?: HttpMethod;
    url: string;
    credential?: ICredential;
    queries?: IQueriesData;
    payload?: Payload;
    headers?: IHeadersData;
    onprogress?: ProgressHandler;
    onabort?: AbortHandler;
    contentType?: string;
    responseType?: ResponseType;
    timeout?: number;
}
export default interface IAjaxAPI {
    request(options: IRequestOptions): AjaxRequest;
}
