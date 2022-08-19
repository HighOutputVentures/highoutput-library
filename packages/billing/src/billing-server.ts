/* eslint-disable no-console */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import { Request, Response, NextFunction } from 'express';
import * as R from 'ramda';
import { AuthorizationAdapter } from './interfaces/authorization-adapter';
import { handlerMapper, tryCatch } from './lib/route-handlers';
import { setSecretKey } from './lib/setup';

type Method = keyof typeof handlerMapper;
type Endpoint = keyof typeof handlerMapper[Method];

export default class BillingServer {
  constructor(
    private options: {
      stripeSecretKey: string;
      authorizationAdapter: AuthorizationAdapter;
    },
  ) {
    setSecretKey(this.options.stripeSecretKey);
  }

  public expressMiddleware() {
    const { authorizationAdapter } = this.options;
    return async function billing(
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      const user = await authorizationAdapter.authorize('TOKEN');

      if (R.isNil(user)) {
        res.set('Content-Type', 'application/json');
        res.sendStatus(400);
        res.send({
          error: {
            code: 'USER_NOT_FOUND',
            message: 'user with the specified email address does not exist.',
          },
        });

        next();
        return;
      }

      const { method, path } = req;
      const [endpoint] = path.match(/^\/tiers$|^\/secret$/) as RegExpMatchArray;

      if (R.isNil(endpoint)) {
        res.sendStatus(404);
        next();
        return;
      }

      const handler = R.prop(method.toLowerCase() as Method, handlerMapper);
      const [error, data] = await tryCatch(
        R.prop(endpoint.replace(/\//, '') as Endpoint, handler),
      );

      if (error) {
        res.sendStatus(400);
        next();
        return;
      }

      res.json({
        ok: true,
        data,
      });

      next();
    };
  }
}
