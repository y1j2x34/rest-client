/// <reference types="superagent" />
import { AjaxRequest, AbortHandler, ErrorHandler } from '../core/types';
import { Request } from 'superagent';
export declare type EventHandler = (event: any) => void | AbortHandler | ErrorHandler;
export default function newAjaxRequest(req: Request): AjaxRequest;
