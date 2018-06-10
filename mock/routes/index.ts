import * as getRoles from './get/roles';
import * as getUsers from './get/user';

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

export const get = [getRoles, getUsers];
export const post = [createUser, uploadAvator];
export const del = [];
export const patch = [];
export const put = [];
