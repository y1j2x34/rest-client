import { MockerRequest } from 'superagent-mocker';
import db from '../../db/index';
import { MockResponse } from '..';

export const path = '/user/avator.do';
export function handler(req: MockerRequest): MockResponse {
    const userId = req.query.id;
    const user = db.users[userId];
    if (!user) {
        return {
            status: 404,
            body: {
                success: false,
                reason: `user not exitsts: ${userId}`,
            },
        };
    }
    user.avator = 'updated';
    return {
        body: {
            success: true,
            avator: req.body,
        },
    };
}
