import * as getRole from './get/role';
import * as getUser from './get/user';
import * as allRoles from './get/allRoles';
import * as allUsers from './get/allUsers';

import * as createUser from './post/createUser';
import * as uploadAvator from './post/uploadAvator';
import { MockerRequest } from 'superagent-mocker';

export interface MockResponse {
    status?: number;
    body?: any;
    code?: string;
    contentType?: string;
    headers?: {
        [key: string]: string;
    };
}
export type RouterHandler = (
    req: MockerRequest
) => Promise<MockResponse> | MockResponse;

export interface Route {
    path: string;
    handler: RouterHandler;
}

export interface RouteMap {
    get: Route[];
    post: Route[];
    del: Route[];
    patch: Route[];
    put: Route[];
}

export const get = [getRole, getUser, allUsers, allRoles];
export const post = [createUser, uploadAvator];
export const del = [];
export const patch = [];
export const put = [];
