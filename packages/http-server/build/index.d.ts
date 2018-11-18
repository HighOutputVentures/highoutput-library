/// <reference types="node" />
import Koa from 'koa';
import Router from 'koa-router';
import { Server } from 'http';
export interface HTTPServerOptions {
    auth?: {
        type: 'jwt';
        strict?: boolean;
        options: {
            secretKey: (() => Promise<string>) | string;
        };
    } | {
        type: 'basic';
        strict?: boolean;
        options: {
            authenticate: (username: string, password: string) => Promise<boolean>;
        };
    };
    routerOptions?: Router.IRouterOptions;
    port: number;
}
export default class HTTPServer {
    protected options: HTTPServerOptions;
    app: Koa;
    router: Router;
    server?: Server;
    constructor(options: HTTPServerOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map