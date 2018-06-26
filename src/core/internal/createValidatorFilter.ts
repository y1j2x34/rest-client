import { IAjaxRequestOptions, IParamConfig, RequestParamField } from '../types';
import FilterChain from '../FilterChain';
import { isFormData } from '../utils';

export default function createValidatorFilter(
    paramConfigs: IParamConfig[],
    field: RequestParamField
): (options: IAjaxRequestOptions, chain: FilterChain) => any {
    return (options: IAjaxRequestOptions, chain: FilterChain) => {
        for (const paramConfig of paramConfigs) {
            const validator = paramConfig.validator;
            options = JSON.parse(JSON.stringify(options));
            let pairs: any = options[field];
            if (!pairs) {
                pairs = options[field] = {};
            }
            const paramName = paramConfig.name;
            let value;
            if (isFormData(pairs)) {
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
