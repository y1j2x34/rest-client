import { MockerRequest } from 'superagent-mocker';
import db from '../../db/index';
import { MockResponse } from '..';

export const path = '/user/createUser.do';
export function handler(req: MockerRequest): MockResponse {
    const { username, age, roleId } = req.query;

    const role = db.roles[roleId];
    if (!role) {
        return {
            status: 400,
            body: `role not exists: ${roleId}`,
        };
    }
    const userId =
        'user-' +
        Math.random()
            .toString(16)
            .slice(2);
    db.users[userId] = {
        id: userId,
        username,
        role: roleId,
        age,
    };
    return {
        body: {
            userId,
        },
    };
}
