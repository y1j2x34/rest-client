import { MockerRequest } from 'superagent-mocker';
import db from '../../db/index';

export const path = '/user/avator.do';
export function handler(req: MockerRequest){
    const userId = req.query.id;
    const user = db.users[userId];
    if (!user) {
        return {
            status: 404,
            data: {
                success:false,
                reason: `user not exitsts: ${userId}`
            }
        };
    }
    user.avator = 'updated';
    return {
        data: {
            success: true,
            avator: req.body
        }
    };
};
