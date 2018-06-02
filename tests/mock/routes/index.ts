import { RouterHandler } from 'superagent-mocker';

export interface Route {
    path: string,
    handler: RouterHandler
};

export interface RouteMap {
    'get': Route[];
    'post': Route[];
    'del': Route[];
    'patch': Route[];
    'put': Route[];
};

const routes: RouteMap = {
    get: [ ],
    post: [ ],
    del: [ ],
    patch: [ ],
    put: [ ]
};

export default routes;
