import {expect} from 'chai';
import {isArgument, toArray, isTypedArray, mime} from '../../../src/core/utils';
import * as db from 'mime-db';

describe('test utils.isArgument', () => {
    it('utils.isArgument should be an function', () => {
        expect(typeof isArgument).eql('function');
    });
    it('arguments should be argument', () => {
        expect((function anonymous() {
            return isArgument(arguments);
        })()).to.true;
    });
    it('array should not be argument', () => {
        expect(isArgument([])).to.false
    });
    it('undefined should not be argument', () => {
        expect(isArgument(undefined)).to.false
    });
    it('null should not be argument', () => {
        expect(isArgument(null)).to.false
    });
    it('string should not be argument', () => {
        expect(isArgument('')).to.false
    });
})

describe('test utils.toArray', () => {
    it('utils.toArray should be an function', () => {
        expect(typeof toArray).eql('function');
    })
    it('toArray() should be empty array', () => {
        expect(toArray()).eql([])
    })
    it('toArray(undefined) should be empty array', () => {
        expect(toArray(undefined)).eql([])
    })
    it('toArray(null) should be empty array', () => {
        expect(toArray(null)).eql([])
    })
    it('toArray(Arguments) should be array', () => {
        expect((function() {
            return toArray(arguments);
        })()).eql([])
    })
    it('toArray(Arguments) should have same length and elements with that Arguments ', () => {
        const args = [0, 1, 2, 3, 4];
        expect((function() {
            return toArray(arguments);
        }).apply(null, args)).eql(args);
    })
    it('toArray(anArray) should be anArray', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(toArray(arr))
            .to
            .equal(arr);
    })
});

describe('test utils.isTypedArray', () => {
    const buffer = new ArrayBuffer(1024);
    it('utils.isTypedArray should be an function', () => {
        expect(typeof isTypedArray).eql('function');
    })
    it('undefined should not be TypedArray', () => {
        expect(isTypedArray(undefined)).to.false;
    })
    it('null should not be TypedArray', () => {
        expect(isTypedArray(null)).to.false;
    })
    describe('All of these types should be TypedArray ', () => {
        it('Uint8Array should be TypedArray', () => {
            const uint8 = new Uint8Array(buffer);
            expect(isTypedArray(uint8)).to.true;
        })
        it('Uint16Array should be TypedArray', () => {
            const uint16 = new Uint16Array(buffer);
            expect(isTypedArray(uint16)).to.true;
        })
        it('Uint32Array should be TypedArray', () => {
            const uint32 = new Uint32Array(buffer);
            expect(isTypedArray(uint32)).to.true;
        })
        it('Int8Array should be TypedArray', () => {
            const int8 = new Int8Array(buffer);
            expect(isTypedArray(int8)).to.true;
        })
        it('Int16Array should be TypedArray', () => {
            const int16 = new Int16Array(buffer);
            expect(isTypedArray(int16)).to.true;
        })
        it('Int32Array should be TypedArray', () => {
            const int32 = new Int32Array(buffer);
            expect(isTypedArray(int32)).to.true;
        })
        it('Uint8ClampedArray should be TypedArray', () => {
            const uint8Clamped = new Uint8ClampedArray(buffer);
            expect(isTypedArray(uint8Clamped)).to.true;
        })
    })
    it('string should not be TypedArray', () => {
        expect(isTypedArray('')).to.false
    })
    it('boolean should not be TypedArray', () => {
        expect(isTypedArray(true)).to.false
    })
    it('number should not be TypedArray', () => {
        expect(isTypedArray(0)).to.false
    })
    it('Array should not be TypedArray', () => {
        expect(isTypedArray([])).to.false
    })
});

describe('test utils.mime', () => {
    const extToMime: {
        [ext: string]: string;
    } = {};
    before(() => {
        const mimeData = db as db.MimeTypeData;
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
    });
    it('utils.mime should be an function', () => {
        expect(typeof mime).eql('function');
    });
    it('all extension\'s mime-type should be correct', () => {
        for(const [ext, mimeType] of Object.entries(extToMime)) {
            expect(mime(ext)).to.equal(mimeType);
        }
    });
})
