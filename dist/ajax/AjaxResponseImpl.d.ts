import { Response } from 'superagent';
import { ResponseError, AjaxResponse, IHeadersData } from '../core/types';
export default class AjaxResponseImpl implements AjaxResponse {
    private resp;
    readonly accepted: boolean;
    readonly badRequest: boolean;
    readonly body: any;
    readonly charset: string;
    readonly clientError: boolean;
    readonly error: ResponseError;
    readonly files: any;
    readonly forbidden: boolean;
    readonly headers: IHeadersData;
    readonly info: boolean;
    readonly noContent: boolean;
    readonly notAcceptable: boolean;
    readonly notFound: boolean;
    readonly ok: boolean;
    readonly unauthorized: boolean;
    readonly redirect: boolean;
    readonly serverError: boolean;
    readonly status: number;
    readonly statusType: number;
    readonly text: string;
    readonly type: string;
    constructor(resp: Response);
    getHeader(name: string): string;
}
