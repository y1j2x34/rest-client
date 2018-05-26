import { expect } from 'chai';

export default class Deferred<T> {
    private res: (value?: T | PromiseLike<T>) => void;
    private rej: (reason?: any) => void;
    private readonly promise: Promise<T>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.res = resolve;
            this.rej = reject;
        });
    }

    public then(
        onfulfilled?: (value: T) => T | PromiseLike<T>,
        onrejected?: (reason: any) => PromiseLike<never>
    ): Promise<T> {
        return this.promise.then(onfulfilled, onrejected);
    }

    public catch(onRejected?: (reason: any) => PromiseLike<never>): Promise<T> {
        return this.promise.catch(onRejected);
    }

    public resolve(value?: T | PromiseLike<T>): void {
        return this.res(value);
    }

    public reject(reason?: any): void {
        return this.rej(reason);
    }
}

// class MyPromise extends Promise <any> {
//     constructor(private promise : Promise<any>) {
//         super((resolve, reject) => {
//             console.info(this.promise);
//             this
//                 .promise
//                 .then(resolve, reject);
//         })
//     }
//     public onprogress(handler : (progress : any) => void) {
//         console.info(handler);
//     }
//     public then(onfullfilled : (value : any) => any, onreject : (reason : any) => any) {
//         const promise = super.then(onfullfilled, onreject);
//         return new MyPromise(promise);
//     }
// }

describe('test custom promise', () => {
    it('should act like promise', async () => {
        const value = {};
        const asyncValue = await new Deferred().resolve(value);
        expect(asyncValue).be.eq(value);
    });
});
