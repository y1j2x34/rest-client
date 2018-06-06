import * as chai from 'chai';
import * as spies from 'chai-spies';
import FilterChain from '../../src/core/FilterChain';

chai.use(spies);

const {expect, spy} = chai;

describe('test filter chain', () => {
    const noopFilter = (value, chain: FilterChain) => {
        // ignore;
    };
    const incrementFilter = (value: number, theChain: FilterChain) => {
        return theChain.next(value + 1);
    }
    it('Filter should be called', () => {
        const spiedFilter = spy(noopFilter);
        const chain = new FilterChain([spiedFilter], 0);
        chain.start(null);
        expect(spiedFilter).to.be.called
    })
    it('Values should be transmitted correctly', () => {
        const chain = new FilterChain([incrementFilter, incrementFilter], 0);
        const retValue = chain.start(0);
        expect(retValue).eq(2);
    });
    it('filters should be called twice if retried', () => {
        const startValue = 0;
        let times = 0;
        const detectValueFilter = (value, chain: FilterChain) => {
            times ++;
            expect(value).eql(startValue);
            return chain.next(Math.random());
        };
        const retryFilter = (value, chain: FilterChain) => {
            if(times < 2) {
                return chain.retry();
            } else {
                return chain.finish(value);
            }
        };
        const detectValueFilterSpy = spy(detectValueFilter);
        const incrementFilterSpy = spy(incrementFilter);
        const retryFilterSpy = spy(retryFilter);
        const startChain = new FilterChain([detectValueFilterSpy, incrementFilterSpy, retryFilterSpy], 0);
        startChain.start(startValue);

        expect(detectValueFilterSpy).to.have.been.called.twice;
        expect(incrementFilterSpy).to.have.been.called.twice;
        expect(retryFilterSpy).to.have.been.called.twice;
    })
    it('filters should be stoped on chain.finish called', () => {
        const finishFilter = (value, chain: FilterChain) => {
            return chain.finish(value);
        }
        const finishFilterSpy = spy(finishFilter);
        const incrementFilterSpy = spy(incrementFilter);

        const startChain = new FilterChain([finishFilterSpy, incrementFilterSpy], 0);
        startChain.start(0);

        expect(finishFilterSpy).to.have.been.called.once;
        expect(incrementFilterSpy).to.have.not.been.called;
    });
    it('filters should be stoped on chain.error called', () => {
        const expectedError = new Error('Unknown error occurred');
        const errorFilter = (value, chain: FilterChain) => {
            return chain.error(expectedError);
        }
        const errorFilterSpy = spy(errorFilter);
        const incrementFilterSpy = spy(incrementFilter);

        const startChain = new FilterChain([errorFilterSpy, incrementFilterSpy], 0);

        const catchSpy = spy(reason => {
            expect(reason).to.eqls(expectedError);
        });
        (startChain.start(0) as Promise<any>).catch(catchSpy);

        expect(catchSpy).to.have.been.called;
        expect(errorFilterSpy).to.have.been.called.once;
        expect(incrementFilterSpy).to.have.not.been.called;
    });
});
