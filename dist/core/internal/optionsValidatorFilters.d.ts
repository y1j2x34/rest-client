import { IAjaxRequestOptions, IAPIConfig } from '../types';
import FilterChain from '../FilterChain';
export default function (ajaxConfig: IAPIConfig): Array<(options: IAjaxRequestOptions, chain: FilterChain) => any>;
