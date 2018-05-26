import { expect } from 'chai';
import '../mock/index';
import * as request from 'superagent';

describe('xxx', () => {
    it('should xxx', async () => {
        request.get('/topics/1').end((err, response) => {
            const resp = response as any;
            console.info(err, resp.data);
            expect(resp.data.body).not.null;
        });
        const ret = await request.get('/topics/2').send();
        console.info('await ret ', ret);
        // request.post('upload/formdata')
        // .send({
        //     file: new Blob(["%PDF"], {type: 'application/pdf'})
        // })
        // .on('progress', e => {
        //     console.info('progress', e);
        // })
        // .then( data => {
        //     console.info('end ', data);
        // });
        request
            .post('update/user/1')
            .type('application/json')
            .send(JSON.stringify({ name: 'xxx', email: 'xxx@qq.com' }))
            .then(data => {
                console.info('user updated');
            });
    });
});
