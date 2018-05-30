import { InternalAjaxRequestOptions } from '../types';
import FilterChain from '../Filterchain';

export default function jsonParameterFilter(
    options: InternalAjaxRequestOptions,
    chain: FilterChain
): any {
    if (options.json) {
        if (typeof options.json === 'string') {
            options.formdata = JSON.parse(options.json);
        } else {
            options.formdata = options.json;
        }
        options.contentType = 'application/json';
    }
    return chain.next(options);
}
