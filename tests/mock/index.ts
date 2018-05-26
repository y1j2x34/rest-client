import * as request from 'superagent';
import mocker from './mocker';
console.info(mocker);

const mock = mocker(request);
mock.timeout = 100;

mock.get('/topics/:id', req => {
    console.info(`request topic: `, req);
    return {
        data: {
            id: req.params.id,
            content: 'hello world',
        },
        headers: req.headers,
    };
});
mock.post('update/user/:id', req => {
    console.info(req);
    return {
        data: { success: true },
    };
});
mock.post('upload/formdata', req => {
    console.info(req);
    return {
        data: {
            success: true,
        },
    };
});

export default request;
