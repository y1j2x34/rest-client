import {
    IAjaxRequestOptions,
    IAPIConfig,
    IParamConfig,
    RequestParamField,
} from '../types';
import FilterChain from '../Filterchain';

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
            for (const paramConfig of paramConfigs) {
                const validator = paramConfig.validator;
                options = JSON.parse(JSON.stringify(options));
                let pairs = options[field];
                if (!pairs) {
                    pairs = options[field] = {};
                }
                const paramName = paramConfig.name;
                let value;
                if (pairs instanceof FormData) {
                    value = pairs.get(paramName);
                } else {
                    value = pairs[paramName];
                }
                if (
                    validator !== undefined &&
                    validator.call(paramConfig, value, options)
                ) {
                    throw new Error(
                        `Parameter '${paramName}' validation failed: ${value}\r\nurl: ${
                            ajaxConfig.url
                        }`
                    );
                }
            }
            return chain.next(options);
        };
    }
}
