declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'superagent-mocker' {
    import { SuperAgent, SuperAgentRequest } from 'superagent';

    export interface MockerRequest {
        url: string;
        params: { [key: string]: any };
        body: any;
        headers: { [key: string]: any };
        query: { [key: string]: any };
    }
    export type RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    export type RouterHandler = (req: MockerRequest) => any;

    export interface Mock {
        timeout: number | (() => number);
        get(url: string, handler: RouterHandler): Mock;
        post(url: string, handler: RouterHandler): Mock;
        put(url: string, handler: RouterHandler): Mock;
        del(url: string, handler: RouterHandler): Mock;
        patch(url: string, handler: RouterHandler): Mock;
        clearRoutes(): void;
        ckearRoute(
            method: RequestMethods,
            url: string,
            handler: RouterHandler
        ): void;
    }
    export type IMocker = (request: SuperAgent<any>) => Mock;

    export default function mocker(request: SuperAgent<any>): Mock;
}
