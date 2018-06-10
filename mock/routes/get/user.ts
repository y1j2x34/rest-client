import { MockerRequest } from 'superagent-mocker';
import db from '../../db/index';
import { RouterHandler } from '..';

export const path = '/user/:id.do';
export const handler: RouterHandler = (req: MockerRequest) => {
    const id = req.params.id;
    const user = db.users[id];
    if (!user) {
        return {
            status: 404,
            body: `user[${id}] not exists`,
        };
    } else {
        return {
            body: user,
        };
    }
};
