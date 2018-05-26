import IAjaxAPI, { IRequestOptions } from '../core/AjaxAPI';
import * as request from 'superagent';
import { HttpMethod, AjaxRequest } from '../core/types';
import newAjaxRequest from './newAjaxRequest';

export default class SuperAgentAjaxAPI implements IAjaxAPI {
    public request(options: IRequestOptions): AjaxRequest {
        const req = this.createRequest(options);
        req
            .on('progress', e => {
                if (options.onprogress) {
                    options.onprogress({
                        ...e,
                    });
                }
            })
            .on('abort', e => {
                if (options.onabort) {
                    options.onabort();
                }
            })
            .send(options.payload);
        return newAjaxRequest(req);
    }
    private createRequest(options: IRequestOptions): request.Request {
        let req;
        switch (options.method) {
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
        if (options.credential) {
            req.auth(options.credential.username, options.credential.password);
        }
        if (options.queries) {
            req.query(options.queries);
        }
        if (options.headers) {
            req.set(options.headers);
        }
        if (options.contentType) {
            req.set('Content-Type', options.contentType);
        }
        if (options.responseType) {
            req.responseType(options.responseType);
        }
        return req;
    }
}
