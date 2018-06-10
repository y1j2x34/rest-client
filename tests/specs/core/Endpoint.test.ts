import { expect } from 'chai';
import Endpoint from '../../../src/core/Endpoint';
import { HttpMethod } from '../../../src/core/types';
import { variables } from '../global';

describe('test Endpoint', () => {
    it('create empty endpoint', () => {
        const defaultEndpoint = new Endpoint('/');
        console.info(defaultEndpoint);
    });
    it('register api', async () => {
        const endpoint = new Endpoint(variables.server.host, '');
        const apiname = 'getUser';
        endpoint.registerAPI(apiname, {
            path: '/user/:id.do',
            method: HttpMethod.GET,
            pathVariables: [
                {
                    name: 'id',
                    required: true,
                },
            ],
        });
        expect(endpoint.api(apiname)).to.not.undefined;
        expect(endpoint.api(apiname)).to.not.null;
        endpoint
            .api(apiname)
            .request({
                pathVariables: {
                    id: '0',
                },
            })
            .then(console.log, console.error);
    });
});
