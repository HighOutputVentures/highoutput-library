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
        strict?: boolean;
        options: {
          secretKey: (() => Promise<string>) | string;
        };
      }
    | {
        type: 'basic';
        strict?: boolean;
        options: {
          authenticate: (username: string, password: string) => Promise<any>;
        };
      };
  routerOptions?: Router.IRouterOptions;
  port: number;
  middlewares?: Koa.Middleware[];
}

export default class HTTPServer {
  app: Koa;
  router: Router;
  server?: Server;

  constructor(protected options: HTTPServerOptions) {
    this.app = new Koa();
    this.router = new Router();
  }

  async start() {
    if (this.options.auth && this.options.auth.type === 'jwt') {
      let { secretKey } = this.options.auth.options;
      if (typeof secretKey !== 'string') {
        secretKey = await secretKey();
      }

      this.app.use(async (ctx, next) => {
        const invalidToken = () => {
          ctx.type = 'application/json';
          ctx.status = 403;
          ctx.body = JSON.stringify({
            code: 'INVALID_TOKEN',
          });
        };

        if (this.options.auth!.strict && !ctx.headers.authorization) {
          invalidToken();
          return;
        }

        if (!ctx.headers.authorization) {
          await next();
          return;
        }

        const match = ctx.headers.authorization.match(/^Bearer (.+)$/);
        if (!match) {
          if (this.options.auth!.strict) {
            invalidToken();
          } else {
            await next();
          }

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

    if (this.options.auth && this.options.auth.type === 'basic') {
      let { authenticate } = this.options.auth.options;

      this.app.use(async (ctx, next) => {
        const invalidCredentials = () => {
          ctx.type = 'application/json';
          ctx.status = 403;
          ctx.body = JSON.stringify({
            code: 'INVALID_CREDENTIALS',
          });
        };

        if (this.options.auth!.strict && !ctx.headers.authorization) {
          invalidCredentials();
          return;
        }

        if (!ctx.headers.authorization) {
          await next();
          return;
        }

        const match = ctx.headers.authorization.match(/^Basic (.+)$/);
        if (!match) {
          if (this.options.auth!.strict) {
            invalidCredentials();
          } else {
            await next();
          }

          return;
        }
        const [, credentials] = match;
        const [username, password] = Buffer.from(credentials, 'base64')
          .toString('utf8')
          .split(':');

        ctx.state.claims = await authenticate(username, password);
        if (!ctx.state.claims) {
          invalidCredentials();
        }
      });
    }

    for (const middleware of this.options.middlewares || []) {
      this.app.use(middleware);
    }

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    this.server = await new Promise<Server>(resolve => {
      const port = this.options.port || 8080;
      const server = this.app.listen(port, () => {
        logger.info(`Server started at port ${port}`);
        resolve(server);
      });
    });
  }

  async stop() {
    if (this.server) {
      await new Promise(resolve => {
        this.server!.close(resolve);
      });
    }
  }
}
