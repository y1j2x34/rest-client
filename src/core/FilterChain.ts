export type Filter = (value: any, chain: FilterChain) => any;

const TERMINAL_RESULT = new Promise(() => undefined);

export default class FilterChain {
    public static isTerminal(value: any) {
        return TERMINAL_RESULT === value;
    }
    private startValue?: any;
    /**
     * @constructs FilterChain
     * @hideconstructor
     * @param {Filter[]} filters
     * @param {number} index
     */
    constructor(private filters: Filter[], private index: number) {
        this.filters = filters.slice(0);
        this.index = index;
    }
    public next(value: any): any {
        if (this.index >= this.filters.length) {
            return this.finish(value);
        }

        const filter = this.filters[this.index];
        const nextchain = this.nextchain();
        nextchain.startValue = this.startValue;
        return filter(value, nextchain);
    }
    public retry(value?: any) {
        let retryValue = value;
        if (value === undefined) {
            retryValue = this.startValue;
        }
        return this.chainAt(0).start(retryValue);
    }
    public start(value: any) {
        this.startValue = value;
        return this.next(value);
    }
    public error(reason: Error) {
        return Promise.reject(reason);
    }
    public finish(result: any) {
        return result;
    }
    public terminal() {
        return TERMINAL_RESULT;
    }
    private chainAt(index: number): FilterChain {
        return new FilterChain(this.filters, index);
    }
    private nextchain(): FilterChain {
        return this.chainAt(this.index + 1);
    }
}
