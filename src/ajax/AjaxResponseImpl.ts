import { Response } from "superagent"
import { ResponseError, AjaxResponse } from "../core/types";

export default class AjaxResponseImpl implements AjaxResponse {

    public get accepted() : boolean{
        return this.resp.accepted;
    }
    public get badRequest() : boolean{
        return this.resp.badRequest;
    }
    public get body() : any{
        return this.resp.body;
    }
    public get charset() : string{
        return this.resp.charset;
    }
    public get clientError() : boolean{
        return this.resp.clientError;
    }
    public get error() : ResponseError {
        return this.resp.error;
    }
    public get files() : any{
        return this.resp.files;
    }
    public get forbidden() : boolean{
        return this.resp.forbidden;
    }
    public get header() : any{
        return this.resp.header;
    }
    public get info() : boolean{
        return this.resp.info;
    }
    public get noContent() : boolean{
        return this.resp.noContent;
    }
    public get notAcceptable() : boolean{
        return this.resp.notAcceptable;
    }
    public get notFound() : boolean{
        return this.resp.notFound;
    }
    public get ok() : boolean{
        return this.resp.ok;
    }
    public get unauthorized() : boolean{
        return this.resp.unauthorized;
    }
    public get redirect() : boolean{
        return this.resp.redirect;
    }
    public get serverError() : boolean{
        return this.resp.serverError;
    }
    public get status() : number{
        return this.resp.status;
    }
    public get statusType() : number{
        return this.resp.statusType;
    }
    public get text() : string{
        return this.resp.text;
    }
    public get type() : string{
        return this.resp.type;
    }
    constructor(private resp: Response) {}
    public getHeader(name: string): string {
        return this.resp.get(name);
    };
}
