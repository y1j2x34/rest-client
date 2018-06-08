import { IAjaxRequestOptions, IParamConfig, RequestParamField } from '../types';
import FilterChain from '../FilterChain';
export default function createValidatorFilter(paramConfigs: IParamConfig[], field: RequestParamField): (options: IAjaxRequestOptions, chain: FilterChain) => any;
