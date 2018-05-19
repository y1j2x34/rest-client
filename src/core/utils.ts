function argumentsToString() {
    return arguments.toString();
}
const ARGUMENT_TO_STRING = argumentsToString();

export const isArgument = (arg:any) => arg && arg.toString() === ARGUMENT_TO_STRING;

export function toArray<T>(...args: any[]):T[] {
    if (this.isArgument(args[0])) {
        return toArray.apply(null, args[0]);
    } else {
        return args;
    }
}
