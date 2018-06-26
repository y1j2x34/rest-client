import { IAjaxRequestOptions, IParamConfig, RequestParamField } from '../types';
import FilterChain from '../FilterChain';
import { isFormData } from '../utils';

export default function createRequireParameterFilter(
    paramConfigs: IParamConfig[],
    field: RequestParamField
) {
    return (options: IAjaxRequestOptions, chain: FilterChain) => {
        let pairs: any = options[field];
        if (pairs === undefined) {
            pairs = options[field] = {};
        }
        for (const paramConfig of paramConfigs) {
            const paramName = paramConfig.name;
            let value;
            if (isFormData(pairs)) {
                value = pairs.get(paramName);
            } else {
                value = (pairs as any)[paramName];
            }
            if (
                paramConfig.required !== false &&
                value === undefined &&
                paramConfig.defaultValue === undefined
            ) {
                return chain.error(
                    new Error(
                        `Required parameter '${paramName}' of ${field} is missing and 'defaultValue' of api config is not defined.`
                    )
                );
            }
        }
        return chain.next(options);
    };
}
