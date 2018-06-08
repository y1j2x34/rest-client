// tslint: max-classes-per-file: 2
import { Primitive } from './types';

export type TemplateVariales =
    | undefined
    | {
          [key: string]: Primitive;
      };

export type notFoundCallback = (key: string) => string;
type Parser = (
    variables: TemplateVariales,
    notFound?: notFoundCallback
) => string;

function escapeRegex(str: string): string {
    return str.replace(/([\$\[\]\(\)\{\}\^\+\.\*\?\\\-])/g, '\\$1');
}

function textplain(text: string, variables?: TemplateVariales) {
    return text;
}

function placeholder(
    key: string,
    variables: TemplateVariales,
    notFound?: notFoundCallback
) {
    if (!variables) {
        return notFound !== undefined ? notFound(key) : '';
    }
    if (key in variables) {
        return variables[key];
    } else if (notFound !== undefined) {
        return notFound(key);
    }
    return '';
}

function merge(
    compiled: Parser[],
    variables: TemplateVariales,
    notFound?: notFoundCallback
) {
    if (!variables) {
        variables = {};
    }
    return compiled.map(parser => parser(variables, notFound)).join('');
}

export class Template {
    constructor(
        private parsed: (
            variables: TemplateVariales,
            notFound?: notFoundCallback
        ) => string
    ) {}
    public execute(
        variables: TemplateVariales,
        notFound?: notFoundCallback
    ): string {
        return this.parsed(variables, notFound);
    }
}

export default class TemplateParser {
    private regex: RegExp;
    /**
     * @param {string} [prefix='${'] - 占位符 前缀
     * @param {string} [suffix='}'] - 占位符后缀
     * @param {boolean} [escape=false] - 如果为true,则不会替换占位符的正则表达式的特殊符号， 默认为false
     */
    constructor(
        prefix: string = '${',
        suffix: string = '}',
        escape: boolean = false
    ) {
        const prefReg = !escape ? escapeRegex(prefix) : prefix;
        const sufReg = !escape ? escapeRegex(suffix) : suffix;
        this.regex = new RegExp(`${prefReg}(.*?)${sufReg}`, 'g');
    }
    public parse(text: string): Template {
        if (typeof text !== 'string') {
            return merge.bind(null, []);
        }
        const compiled: Parser[] = [];
        let lastIndex = 0;
        while (true) {
            const result = this.regex.exec(text);
            if (result === null) {
                break;
            }
            const match = result[0];
            const key = result[1];
            const index = result.index;

            compiled.push(textplain.bind(null, text.slice(lastIndex, index)));

            compiled.push(placeholder.bind(null, key));

            lastIndex = index + match.length;
        }
        compiled.push(textplain.bind(null, text.slice(lastIndex)));
        return new Template(merge.bind(null, compiled));
    }
}
