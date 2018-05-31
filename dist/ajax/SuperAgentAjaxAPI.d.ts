import IAjaxAPI, { IRequestOptions } from '../core/AjaxAPI';
import { AjaxRequest } from '../core/types';
export default class SuperAgentAjaxAPI implements IAjaxAPI {
    request(options: IRequestOptions): AjaxRequest;
    private createRequest(options);
}
