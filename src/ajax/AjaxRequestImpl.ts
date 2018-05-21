import { AjaxRequest, ProgressHandler, AbortHandler, ErrorHandler, CallbackHandler } from "../core/types";
import { Request, ResponseError } from "superagent";

export type EventHandler = (event: any) => void | AbortHandler | ErrorHandler;

export default class AjaxRequestImpl extends Promise<any> implements AjaxRequest{
    constructor(private req: Request){
        super((resolve, reject) => {
            req.then(resolve, reject);
        });
    }
    public abort(): void {
        this.req.abort();
    }
    public progress(handler: ProgressHandler):void {
        this.req.on('progress', handler);
    }
    public on(name: string, handler: EventHandler):void {
        this.req.on(name, handler);
    }
    public retry(count: number, callback: CallbackHandler):void {
        this.req.retry(count, () => {
            callback();
        });
    }
}
