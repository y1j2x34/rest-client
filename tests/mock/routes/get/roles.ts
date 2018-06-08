import { MockerRequest } from 'superagent-mocker';
import db from '../../db/index';

export const path = '/role/:id.do';
export const handler = (req: MockerRequest) => {
    const id = req.params.id;
    const role = db.roles[id];
    if (!role) {
        return {
            status: 404,
            data: {
                success: false,
                reason: `role [${id}] not exists`,
            },
        };
    } else {
        return {
            data: {
                success: true,
                data: role,
            },
        };
    }
};
