import { IAjaxRequestOptions, IParamConfig, RequestParamField } from '../types';
import FilterChain from '../FilterChain';
import { isFormData } from '../utils';

export default function createDefaultValueFilter(
    paramConfigs: IParamConfig[],
    field: RequestParamField
): (options: IAjaxRequestOptions, chain: FilterChain) => any {
    return (options: IAjaxRequestOptions, chain: FilterChain) => {
        let pairs: any = options[field];
        if (!pairs) {
            pairs = options[field] = {};
        }
        for (const paramConfig of paramConfigs) {
            const paramName = paramConfig.name;
            let value: any;
            if (paramConfig.defaultValue === undefined) {
                return chain.next(options);
            }

            if (isFormData(pairs)) {
                value = pairs.get(paramName);
            } else {
                value = pairs[paramName];
            }

            if (value === undefined) {
                value = paramConfig.defaultValue;
            }

            if (isFormData(pairs)) {
                pairs.set(paramName, value);
            } else {
                pairs[paramName] = value;
            }
        }
        return chain.next(options);
    };
}
