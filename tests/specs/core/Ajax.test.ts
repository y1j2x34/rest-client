import { expect, use, spy } from 'chai';
import * as spies from 'chai-spies';
import 'chai-spies';
import Endpoint from '../../../src/core/Endpoint';
import { variables } from '../global';
import { HttpMethod } from '../../../src/core/types';

use(spies);

describe('test ajax', () => {
    let endpoint: Endpoint;
    before(() => {
        endpoint = new Endpoint(variables.server.host);
        endpoint.registerAPI('listUsers', {
            path: '/users.do',
            method: HttpMethod.GET,
        });
        endpoint.registerAPI('getUser', {
            path: '/user/:id.do',
            method: HttpMethod.GET,
            pathVariables: [
                {
                    name: 'id',
                    required: true,
                },
            ],
        });
        endpoint.registerAPI('getRole', {
            path: '/role/:id.do',
            method: HttpMethod.GET,
            pathVariables: [
                {
                    name: 'id',
                    required: true,
                },
            ],
        });
        endpoint.registerAPI('listRoles', {
            path: '/roles.do',
            method: HttpMethod.GET,
        });
    });
    it('registered api should not undefined', () => {
        expect(endpoint.api('listUsers')).not.undefined;
        expect(endpoint.api('getUser')).not.undefined;
        expect(endpoint.api('getRole')).not.undefined;
        expect(endpoint.api('listRoles')).not.undefined;
    });
    it('should throw when get unregistered api', () => {
        expect(() => {
            endpoint.api('');
        }).throw;
    });
    it('should throw when missing required `pathVariable` parameter', async () => {
        const catchSpy = spy(() => {
            //
        });
        try {
            await endpoint.api('getUser').request();
        } catch (error) {
            catchSpy();
            const message = `Required parameter 'id' of pathVariables is missing and 'defaultValue' of api config is not defined.`;
            expect(error.message).eq(message);
        }
        expect(catchSpy).to.be.called;
    });
});
