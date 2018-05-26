// tslint:disable max-classes-per-file

import {
    AjaxRequest,
    ProgressHandler,
    AbortHandler,
    ErrorHandler,
    CallbackHandler,
} from '../core/types';
import { Request, Response } from 'superagent';
import AjaxResponseImpl from './AjaxResponseImpl';

export type EventHandler = (event: any) => void | AbortHandler | ErrorHandler;

function extendPromise<T>(promise: Promise<T>, methods: {}): AjaxRequest {
    const promiseThen = promise.then;
    const promiseCatch = promise.catch;

    return Object.assign(promise, methods, {
        then(
            fullfilled: (value: any) => any,
            onrejected: ((reason: any) => any)
        ): AjaxRequest {
            const newPromise = promiseThen.call(
                promise,
                fullfilled,
                onrejected
            );
            return extendPromise(newPromise, methods);
        },
        catch(onrejected?: ((reason: any) => any)): AjaxRequest {
            const newPromise = promiseCatch.call(promise, onrejected);
            return extendPromise(newPromise, methods);
        },
    }) as AjaxRequest;
}
export default function newAjaxRequest(req: Request): AjaxRequest {
    const promise = new Promise((resolve, reject) => {
        req.then(
            (resp: Response) => resolve(new AjaxResponseImpl(resp)),
            reject
        );
    });
    const methods = {
        abort(): void {
            req.abort();
        },
        progress(handler: ProgressHandler): void {
            req.on('progress', handler);
        },
        on(name: string, handler: EventHandler): void {
            req.on(name, handler);
        },
        retry(count: number, callback: CallbackHandler): void {
            req.retry(count, (err: any, res: Response) => {
                callback(err, new AjaxResponseImpl(res));
            });
        },
    };
    return extendPromise(promise, methods);
}
