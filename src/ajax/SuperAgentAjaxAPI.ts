import IAjaxAPI, { IRequestOptions } from "../core/AjaxAPI";
import * as request from 'superagent';
import { HttpMethod, AjaxRequest } from "../core/types";

export default class SuperAgentAjaxAPI implements IAjaxAPI{
    public request(options: IRequestOptions): Promise<any>  {
        switch(options.method) {
            case HttpMethod.POST:
            case HttpMethod.PUT:
                return this.requestPayload(options);
            default:
                return this.requestSimple(options);
        }
    }
    private createRequest(options: IRequestOptions): request.Request {
        let req;
        switch(options.method) {
            case HttpMethod.GET:
            req = request.get(options.url);
            break;
            case HttpMethod.DELETE:
            req = request.del(options.url);
            break;
            case HttpMethod.PATCH:
            req = request.patch(options.url);
            break;
            case HttpMethod.HEAD:
            req = request.head(options.url);
            break;
            case HttpMethod.POST:
            req = request.post(options.url);
            break;
            case HttpMethod.PUT:
            req = request.put(options.url);
            break;
            default:
            throw new Error(`Unexpected request method: ${options.method}`);
        }
        if(options.credencial) {
            req.auth(options.credencial.username, options.credencial.password)
        }
        if(options.queries) {
            req.query(options.queries);
        }
        if(options.headers) {
            req.set(options.headers);
        }
        if(options.contentType) {
            req.set('Content-Type', options.contentType);
        }
        if(options.responseType) {
            req.responseType(options.responseType);
        }
        return req;
    }
    private requestSimple(options: IRequestOptions): Promise<any> {
        const req = this.createRequest(options);
        return req
        .on('progress', (e) => {
            if(options.onprogress) {
                options.onprogress({
                    ...e
                });
            }
        })
        .on('abort', e => {
            if (options.onabort) {
                options.onabort();
            }
        })
        .send()
        ;
    }
    private requestPayload(options: IRequestOptions): Promise<any> {
        return Promise.resolve();
    }
    private tranformToAjaxRequest(req: request.Request): AjaxRequest {
        return new AjaxRequestImpl(req);
    }
}
