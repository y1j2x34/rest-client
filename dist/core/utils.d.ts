import { TypedArray } from './types';
export declare const isArgument: (arg: any) => boolean;
export declare function toArray<T>(...args: any[]): T[];
export declare function isTypedArray(value: any): boolean;
export declare function mime(input: string | ArrayBuffer | TypedArray): string | undefined;
export declare class Defer<T> {
    resolve: (value: T | Promise<T>) => void;
    reject: (reason: Error) => void;
    private innerPromise;
    constructor();
    readonly promise: Promise<T>;
}
