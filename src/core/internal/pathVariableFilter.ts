import { InternalAjaxRequestOptions } from '../types';
import FilterChain from '../FilterChain';
import Template from '../Template';

const templateCache: {
    [url: string]: Template;
} = {};

export default function pathVariableFilter(
    options: InternalAjaxRequestOptions,
    chain: FilterChain
): any {
    const variables = options.apiConfig.pathVariables;
    const vars = options.pathVariables || {};
    if (variables) {
        variables.forEach(variable => {
            const name = variable.name;
            const defaultValue = variable.defaultValue;
            if (vars[name] === undefined && defaultValue !== undefined) {
                vars[name] = defaultValue;
            }
        });
    }

    const encodedVariables: {
        [key: string]: string;
    } = {};

    for (const [key, value] of Object.entries(vars)) {
        let decoded = value;
        try {
            decoded = decodeURI(decoded);
        } catch (error) {
            // ignored
        }
        encodedVariables[key] = encodeURI(decoded);
    }
    options.pathVariables = encodedVariables;

    let template = templateCache[options.url];
    if (!template) {
        template = templateCache[options.url] = Template.parse(
            options.url,
            ':',
            '(?=(/|\\\\|\\.))',
            true
        );
    }
    options.url = template.execute(encodedVariables, (key) => `:${key}`);

    return chain.next(options);
}
