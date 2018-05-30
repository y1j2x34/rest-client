import Rest from  '../src/index';
import { HttpMethod } from '../src/core/types';

const endpoint = new Rest.Endpoint('http://127.0.0.1:8989/', 'api');

endpoint.registerAPI('userInfo', {
    method: HttpMethod.GET,
    path: '/user/:what.do',
    queries: [{
        name: 'id',
        required: true
    }],
    pathVariables: [{
        name: 'what',
        required: true
    }]
});

export const userInfoAPI =  endpoint.api('userInfo');

(window as any).userInfoAPI = userInfoAPI;
