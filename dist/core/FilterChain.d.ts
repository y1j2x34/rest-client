export declare type Filter = (value: any, chain: FilterChain) => any;
export default class FilterChain {
    private filters;
    private index;
    static isTerminal(value: any): boolean;
    /**
     * @constructs FilterChain
     * @hideconstructor
     * @param {Filter[]} filters
     * @param {number} index
     */
    constructor(filters: Filter[], index: number);
    next(value: any): any;
    retry(value: any): any;
    start(value: any): any;
    error(reason: Error): Promise<never>;
    finish(result: any): any;
    terminal(): Promise<{}>;
    private chainAt(index);
    private nextchain();
}
