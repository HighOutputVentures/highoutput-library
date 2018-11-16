/// <reference types="node" />
import Koa from 'koa';
import Router from 'koa-router';
import { Server } from 'http';
export interface AuthContext extends Koa.Context {
    request: Koa.Request & {
        user: {
            id: string;
            permissions: string[];
        };
    };
}
export default class HTTPServer {
    protected options: {
        auth?: {
            type: 'jwt';
            options: {
                secretKey: string;
            };
        } | {
            type: 'basic';
            options: {
                authenticate: (username: string, password: string) => Promise<boolean>;
            };
        };
        routerOption?: Router.IRouterOptions;
        port: number;
    };
    app: Koa;
    router: Router;
    server?: Server;
    constructor(options: {
        auth?: {
            type: 'jwt';
            options: {
                secretKey: string;
            };
        } | {
            type: 'basic';
            options: {
                authenticate: (username: string, password: string) => Promise<boolean>;
            };
        };
        routerOption?: Router.IRouterOptions;
        port: number;
    });
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map