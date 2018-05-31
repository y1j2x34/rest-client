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
            let pairs = options[field];
            if (pairs === undefined) {
                pairs = options[field] = {};
            }
            for (const paramConfig of paramConfigs) {
                const paramName = paramConfig.name;
                let value;
                if (typeof FormData !== 'undefined' && pairs instanceof FormData) {
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
}
