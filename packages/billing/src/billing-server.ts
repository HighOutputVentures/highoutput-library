/* eslint-disable no-console */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import { Request, Response, NextFunction } from 'express';
import * as R from 'ramda';
import { AuthorizationAdapter } from './interfaces/authorization-adapter';
import { StorageAdapter } from './interfaces/storage-adapter';
import { handlerMapper, tryCatch } from './lib/route-handlers';
import { setSecretKey } from './lib/setup';

type Method = keyof typeof handlerMapper;
type Endpoint = keyof typeof handlerMapper[Method];

const ENDPOINTS_REGEX = /^\/tiers$|^\/secret$/;

export default class BillingServer {
  constructor(
    private options: {
      stripeSecretKey: string;
      authorizationAdapter: AuthorizationAdapter;
      storageAdapter: StorageAdapter;
      config: string;
    },
  ) {
    setSecretKey(this.options.stripeSecretKey);
  }

  public expressMiddleware() {
    const { authorizationAdapter, config } = this.options;
    return async function billing(
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      const { method, path } = req;
      const [endpoint] = path.match(ENDPOINTS_REGEX) as RegExpMatchArray;

      if (R.isNil(endpoint)) {
        next();
        return;
      }

      const { authorization: authHeader } = req.headers;

      if (R.isNil(authHeader)) {
        res.sendStatus(404);
        res.send({
          error: {
            code: 'UNAUTHORIZED_ACCESS',
            message: 'Invalid authorization header.',
          },
        });
        return;
      }

      const [scheme, token] = (authHeader as string).split(' ');

      const user = await authorizationAdapter.authorize({
        scheme: scheme as 'Bearer',
        parameters: token,
      });

      if (R.isNil(user)) {
        res.set('Content-Type', 'application/json');
        res.sendStatus(400);
        res.send({
          error: {
            code: 'UNAUTHENTICATED_ACCESS',
            message: 'User is not found.',
          },
        });
        return;
      }

      req.params.configPath = config;

      const handler = R.compose<
        [typeof handlerMapper],
        typeof handlerMapper[Method],
        typeof handlerMapper[Method][Endpoint]
      >(
        R.prop(endpoint.replace(/\//, '')),
        R.prop(method.toLowerCase()),
      )(handlerMapper);

      const [error, data] = await tryCatch(handler, req);

      if (error) {
        res.sendStatus(400);
        return;
      }

      res.json({
        ok: true,
        data,
      });
    };
  }
}
