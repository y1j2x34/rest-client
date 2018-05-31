import { Primitive } from './types';
export declare type TemplateVariales = undefined | {
    [key: string]: Primitive;
};
export declare type notFoundCallback = (key: string) => string;
export default class Template {
    private parsed;
    static readonly parse: (text: string, prefix?: string, suffix?: string, useReg?: boolean) => Template;
    constructor(parsed: (variables: TemplateVariales, notFound?: notFoundCallback) => string);
    execute(variables: TemplateVariales, notFound?: notFoundCallback): string;
}
