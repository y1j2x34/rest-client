import { IAjaxRequestOptions, IParamConfig, RequestParamField } from '../types';
import FilterChain from '../FilterChain';

export default function createValidatorFilter(
    paramConfigs: IParamConfig[],
    field: RequestParamField
): (options: IAjaxRequestOptions, chain: FilterChain) => any {
    return (options: IAjaxRequestOptions, chain: FilterChain) => {
        for (const paramConfig of paramConfigs) {
            const validator = paramConfig.validator;
            options = JSON.parse(JSON.stringify(options));
            let pairs = options[field];
            if (!pairs) {
                pairs = options[field] = {};
            }
            const paramName = paramConfig.name;
            let value;
            if (typeof FormData !== 'undefined' && pairs instanceof FormData) {
                value = pairs.get(paramName);
            } else {
                value = (pairs as any)[paramName];
            }
            if (
                validator !== undefined &&
                validator.call(paramConfig, value, options)
            ) {
                throw new Error(`Invalid parameter: '${paramName}' = ${value}`);
            }
        }
        return chain.next(options);
    };
}
