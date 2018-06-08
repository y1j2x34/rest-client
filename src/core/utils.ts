import { TypedArray } from './types';
// import * as mimetype from 'mime-types';
import * as filetype from 'file-type';

import * as db from 'mime-db';

const mimeData = db as db.MimeTypeData;

const extToMime: {
    [ext: string]: string;
} = {};

Object.keys(mimeData).reduce((prev, type: string) => {
    const info: db.DataStructure = mimeData[type];
    if (info.extensions) {
        info.extensions.reduce((_: any, ext: string) => {
            _[ext] = type;
            return _;
        }, prev);
    }
    return prev;
}, extToMime);

function argumentsToString() {
    return arguments.toString();
}
const ARGUMENT_TO_STRING = argumentsToString();

export const isArgument = (arg: any): boolean =>
    !!arg && arg.toString() === ARGUMENT_TO_STRING;

export function toArray<T>(...args: any[]): T[] {
    if (args.length === 1) {
        if (args[0] === undefined || args[0] === null) {
            return [];
        } else if (Array.isArray(args[0])) {
            return args[0];
        }
    }
    if (isArgument(args[0])) {
        return toArray.apply(null, args[0]);
    }
    return args;
}
export function isTypedArray(value: any): boolean {
    if (value === undefined || value === null) {
        return false;
    }
    return (
        Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name ===
        'TypedArray'
    );
}

export function mime(
    input: string | ArrayBuffer | TypedArray
): string | undefined {
    if (typeof input === 'string') {
        const ext = input.replace(/^.*\.([a-z]+)$/i, '$1');
        return extToMime[ext];
    } else {
        if (input instanceof ArrayBuffer) {
            input = new Uint8Array(input);
        } else {
            input = new Uint8Array(input.buffer);
        }
        return filetype.call(null, input).mime;
    }
}
