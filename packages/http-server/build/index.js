"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const highoutput_auth_1 = require("highoutput-auth");
const highoutput_utilities_1 = require("highoutput-utilities");
const logger = new highoutput_utilities_1.Logger(['HTTPServer']);
class HTTPServer {
    constructor(options) {
        this.options = options;
        this.app = new koa_1.default();
        this.router = new koa_router_1.default();
        if (this.options.auth && this.options.auth.type === 'jwt') {
            const { secretKey } = this.options.auth.options;
            this.app.use(async (ctx, next) => {
                const invalidToken = () => {
                    ctx.type = 'application/json';
                    ctx.status = 403;
                    ctx.body = JSON.stringify({
                        code: 'INVALID_TOKEN',
                    });
                };
                if (!ctx.headers.authorization) {
                    invalidToken();
                    return;
                }
                const match = ctx.headers.authorization.match(/^Bearer (.+)$/);
                if (!match) {
                    invalidToken();
                    return;
                }
                const [, token] = match;
                try {
                    ctx.state.claims = await highoutput_auth_1.jwt.verify(token, secretKey);
                    await next();
                }
                catch (err) {
                    logger.warn(err);
                    invalidToken();
                }
            });
        }
    }
    async start() {
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
        this.server = await new Promise(resolve => {
            const port = this.options.port || 8080;
            const server = this.app.listen(port, () => {
                logger.info(`Server started at port ${port}`);
                resolve(server);
            });
        });
        return;
    }
    async stop() {
        if (this.server) {
            await new Promise(resolve => {
                this.server.close(resolve);
            });
        }
    }
}
exports.default = HTTPServer;
//# sourceMappingURL=index.js.map