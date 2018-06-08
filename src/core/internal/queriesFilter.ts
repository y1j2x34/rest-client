import { InternalAjaxRequestOptions } from '../types';
import FilterChain from '../FilterChain';

export default function queriesFilter(
    options: InternalAjaxRequestOptions,
    chain: FilterChain
): any {
    const queries = options.queries || {};
    const queriesConfig = options.apiConfig.queries;
    if (queriesConfig) {
        queriesConfig.forEach(query => {
            const name = query.name;
            if (
                query.defaultValue !== undefined &&
                queries[name] === undefined
            ) {
                queries[name] = query.defaultValue;
            }
        });
    }
    options.queries = queries;
    return chain.next(options);
}
