import * as request from 'superagent';
import mocker from './mocker';
import * as routes from '../routes/index';

const mock = mocker(request);
mock.timeout = 100;

register('get', routes.get);
register('post', routes.post);

function register(method: string, routeArray) {
    routeArray.forEach(route => {
        mock[method].call(mock, route.path, route.handler);
    });
}

export default request;
