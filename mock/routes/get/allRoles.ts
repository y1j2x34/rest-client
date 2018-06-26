import { RouterHandler, MockerRequest } from 'superagent-mocker';
import db from '../../db/index';
export const path = '/roles.do';

export const handler: RouterHandler = (req: MockerRequest) => {
    return {
        body: Object.values(db.roles),
    };
};
