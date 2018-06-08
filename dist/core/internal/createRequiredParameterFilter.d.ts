import { IAjaxRequestOptions, IParamConfig, RequestParamField } from '../types';
import FilterChain from '../FilterChain';
export default function createRequireParameterFilter(paramConfigs: IParamConfig[], field: RequestParamField): (options: IAjaxRequestOptions, chain: FilterChain) => any;
