import { Primitive } from './types';

export type TemplateVariales =
    | undefined
    | {
          [key: string]: Primitive;
      };

export type notFoundCallback = (key:string) => string;
type Parser = (variables: TemplateVariales, notFound?:notFoundCallback) => string;

// const PATH_VARIABLE_REGEX = /\$\{([^\}]+)\}/g;

function mkreg(str: string): string {
    return str.replace(/([\$\[\]\(\)\{\}\^\+\.\*\?\\\-])/g, '\\$1');
}
/**
 *
 * @param {string} text - template string
 * @param {string} [prefix='${'] - 占位符 前缀
 * @param {string} [suffix='}'] - 占位符后缀
 * @param {boolean} [useReg=false] - 如果为true,则不会替换占位符的正则表达式的特殊符号， 默认为false
 */
function parse(
    text: string,
    prefix: string = '${',
    suffix: string = '}',
    useReg: boolean = false
): Template {
    if (typeof text !== 'string') {
        return merge.bind(null, []);
    }
    const prefReg = !useReg ? mkreg(prefix) : prefix;
    const sufReg = !useReg ? mkreg(suffix) : suffix;
    const reg = new RegExp(`${prefReg}(.*?)${sufReg}`, 'g');

    const compiled: Parser[] = [];
    let lastIndex = 0;
    while (true) {
        const result = reg.exec(text);
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

function textplain(text: string, variables?: TemplateVariales) {
    return text;
}

function placeholder(key: string, variables: TemplateVariales, notFound?: notFoundCallback) {
    if (!variables) {
        return '';
    }
    if(key in variables) {
        return variables[key];
    } else if(notFound !== undefined) {
        return notFound(key);
    }
    return '';
}

function merge(compiled: Parser[], variables: TemplateVariales, notFound?:notFoundCallback) {
    if (!variables) {
        variables = {};
    }
    return compiled.map(parser => parser(variables, notFound)).join('');
}

export default class Template {
    public static readonly parse = parse;
    constructor(private parsed: (variables: TemplateVariales, notFound?: notFoundCallback) => string) {}
    public execute(variables: TemplateVariales, notFound?:notFoundCallback ): string {
        return this.parsed(variables, notFound);
    }
}

const res = Template.parse(
    'http://127.0.0.1:8989/api/:who/:where/',
    ':',
    '(?=(/|\\\\))',
    true
).execute({
    who: 'maria',
    where: 'USA'
}, function notFound(key) {
    return ':' + key;
});
console.info(res);
