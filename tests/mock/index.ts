import * as request from 'superagent';
import mocker from './mocker';
import routes from './routes/index';

const mock = mocker(request);
mock.timeout = 100;

for(const [method, routeArray] of Object.entries(routes)) {
    routeArray.forEach(route => {
        mock[method].call(mock, route.path, route.handler);
    })
}

export default request;
