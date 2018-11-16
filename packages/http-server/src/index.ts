import Koa from 'koa';
import Router from 'koa-router';
import { jwt } from 'highoutput-auth';
import { Logger } from 'highoutput-utilities';
import { Server } from 'http';

const logger = new Logger(['HTTPServer']);

export interface HTTPServerOptions {
  auth?:
    | {
        type: 'jwt';
        options: {
          secretKey: string;
        };
      }
    | {
        type: 'basic';
        options: {
          authenticate: (
            username: string,
            password: string
          ) => Promise<boolean>;
        };
      };
  routerOption?: Router.IRouterOptions;
  port: number;
}

export default class HTTPServer {
  app: Koa;
  router: Router;
  server?: Server;

  constructor(protected options: HTTPServerOptions) {
    this.app = new Koa();
    this.router = new Router();

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
          ctx.state.claims = await jwt.verify(token, secretKey);
          await next();
        } catch (err) {
          logger.warn(err);
          invalidToken();
        }
      });
    }
  }

  async start() {
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    this.server = await new Promise<Server>(resolve => {
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
        this.server!.close(resolve);
      });
    }
  }
}
