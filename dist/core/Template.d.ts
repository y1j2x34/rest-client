import { Primitive } from './types';
export declare type TemplateVariales = undefined | {
    [key: string]: Primitive;
};
export declare type notFoundCallback = (key: string) => string;
export declare class Template {
    private parsed;
    constructor(parsed: (variables: TemplateVariales, notFound?: notFoundCallback) => string);
    execute(variables: TemplateVariales, notFound?: notFoundCallback): string;
}
export default class TemplateParser {
    private regex;
    /**
     * @param {string} [prefix='${'] - 占位符 前缀
     * @param {string} [suffix='}'] - 占位符后缀
     * @param {boolean} [escape=false] - 如果为true,则不会替换占位符的正则表达式的特殊符号， 默认为false
     */
    constructor(prefix?: string, suffix?: string, escape?: boolean);
    parse(text: string): Template;
}
