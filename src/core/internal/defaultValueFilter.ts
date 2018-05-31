import {
    IAjaxRequestOptions,
    IAPIConfig,
    IParamConfig,
    RequestParamField,
} from '../types';
import FilterChain from '../FilterChain';

const requestOptionFields: RequestParamField[] = [
    'pathVariables',
    'queries',
    'headers',
    'formdata',
];

export default function(
    ajaxConfig: IAPIConfig
): Array<(options: IAjaxRequestOptions, chain: FilterChain) => any> {
    return requestOptionFields
        .filter((name: RequestParamField) => !!ajaxConfig[name])
        .map(field => createFilter(ajaxConfig[field] as IParamConfig[], field));

    function createFilter(
        paramConfigs: IParamConfig[],
        field: RequestParamField
    ): (options: IAjaxRequestOptions, chain: FilterChain) => any {
        return (options: IAjaxRequestOptions, chain: FilterChain) => {
            let pairs = options[field];
            if (!pairs) {
                pairs = options[field] = {};
            }
            for (const paramConfig of paramConfigs) {
                const paramName = paramConfig.name;
                let value: any;
                if (paramConfig.defaultValue === undefined) {
                    return chain.next(options);
                }

                if (pairs instanceof FormData) {
                    value = pairs.get(paramName);
                } else {
                    value = pairs[paramName];
                }

                if (value === undefined) {
                    value = paramConfig.defaultValue;
                }

                if (pairs instanceof FormData) {
                    pairs.set(name, value);
                } else {
                    pairs[name] = value;
                }
            }
            return chain.next(options);
        };
    }
}
