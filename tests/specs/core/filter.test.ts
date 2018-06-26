import { expect } from 'chai';
import Endpoint from '../../../src/core/Endpoint';
import { HttpMethod } from '../../../src/core/types';
import { variables } from '../global';

describe('test filters', () => {
    describe('test default value filter', () => {
        let endpoint: Endpoint;
        before(() => {
            endpoint = new Endpoint(variables.server.host);
            endpoint.registerAPI('getUser', {
                path: '/user/:id.do',
                method: HttpMethod.GET,
                pathVariables: [
                    {
                        name: 'id',
                        defaultValue: '0',
                    },
                ],
            });
            endpoint.registerAPI('getUser1', {
                path: '/user/:id.do',
                method: HttpMethod.GET,
                pathVariables: [
                    {
                        name: 'id',
                        defaultValue: '1'
                    },
                ],
            });
        });
        it('default path variable', async () => {
            const resp0 = await endpoint.api('getUser').request();
            expect(resp0.body.success).to.be.true;
            expect(resp0.body.data.id).to.eql(0);

            const resp1 = await endpoint.api('getUser1').request();
            expect(resp1.body.success).to.be.true;
            expect(resp1.body.data.id).to.eql(1);
        });
        // ...
    });
});
