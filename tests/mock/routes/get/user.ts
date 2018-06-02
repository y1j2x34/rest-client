import { MockerRequest } from "superagent-mocker";
import db from '../../db/index';

export const path = '/user/:id.do';
export const handler = (req: MockerRequest) => {
    const id = req.params.id;
    const user = db.users[id];
    if(!user) {
        return {
            status: 404,
            data: {
                success: false,
                reason: `user[${id}] not exists`
            }
        }
    } else {
        return {
            data: {
                success: true,
                data: user
            }
        };
    }
}
