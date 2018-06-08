import { RouterHandler } from 'superagent-mocker';

import * as getRoles from  './get/roles';
import * as getUsers from  './get/user';

import * as createUser from './post/createUser';
import * as uploadAvator from './post/uploadAvator';

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

const routes: RouteMap = {
    get: [getRoles, getUsers],
    post: [createUser, uploadAvator],
    del: [],
    patch: [],
    put: [],
};

export default routes;
