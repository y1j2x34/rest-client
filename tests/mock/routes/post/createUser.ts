import { MockerRequest } from "superagent-mocker";
import db from '../../db/index';

export const path = '/user/createUser.do';
export function handler(req: MockerRequest) {
    const {
        username,
        age,
        roleId
    } = req.query;

    const role = db.roles[roleId];
    if(!role) {
        return {
            status: 400,
            data: {
                success: false,
                reason: `role not exists: ${roleId}`
            }
        };
    }
    const userId = 'user-' + Math.random().toString(16).slice(2);
    db.users[userId] = {
        id: userId,
        username,
        role: roleId,
        age
    };
    return {
        data: {
            userId,
            success: true
        }
    }
};
