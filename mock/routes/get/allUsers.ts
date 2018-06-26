import { RouterHandler, MockerRequest } from 'superagent-mocker';
import db from '../../db';

export const path = '/users.do';

export const handler: RouterHandler = (req: MockerRequest) => {
    return {
        body: Object.values(db.users),
    };
};
