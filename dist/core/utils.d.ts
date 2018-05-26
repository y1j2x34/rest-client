import { TypedArray } from './types';
export declare const isArgument: (arg: any) => boolean;
export declare function toArray<T>(...args: any[]): T[];
export declare function isTypedArray(value: any): boolean;
export declare function mime(input: string | ArrayBuffer | TypedArray): string | undefined;
