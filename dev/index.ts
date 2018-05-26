import Rest from  '../src/index';
import { HttpMethod } from '../src/core/types';
console.info(Rest);

const endpoint = new Rest.Endpoint('http://127.0.0.1:8989/', '');

endpoint.registerAPI('userInfo', {
    method: HttpMethod.GET,
    path: '/user/info.do'
});

export const userInfoAPI =  endpoint.api('userInfo');

console.info(userInfoAPI);
