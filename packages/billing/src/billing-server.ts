/* eslint-disable no-console */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import { Request, Response, NextFunction } from 'express';
import * as R from 'ramda';
import { AuthorizationAdapter } from './interfaces/authorization-adapter';
import { StorageAdapter } from './interfaces/storage-adapter';
import {
  Endpoints,
  handlerMapper,
  Mapper,
  Methods,
  tryCatch,
} from './lib/route-handlers';
import { setSecretKey } from './lib/setup';

const ENDPOINTS_REGEX =
  /^\/tiers$|^\/secret$|^\/subscription|^\/portal$|^\/webhook/;

export default class BillingServer {
  constructor(
    private options: {
      stripeSecretKey: string;
      authorizationAdapter: AuthorizationAdapter;
      storageAdapter: StorageAdapter;
      config: string;
      endpointSecret: string;
    },
  ) {
    setSecretKey(this.options.stripeSecretKey);
  }

  public expressMiddleware() {
    const { authorizationAdapter, config, storageAdapter, endpointSecret } =
      this.options;
    return async function billing(
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      const { method, path } = req;

      const hasMatch = path.match(ENDPOINTS_REGEX) as RegExpMatchArray;

      if (R.isNil(hasMatch)) {
        next();
        return;
      }

      const [endpoint] = hasMatch;

      if (!endpoint.includes('webhook')) {
        const { authorization: authHeader } = req.headers;

        if (R.isNil(authHeader)) {
          res.status(404).send({
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
          res
            .set('Content-Type', 'application/json')
            .status(400)
            .send({
              error: {
                code: 'UNAUTHENTICATED_ACCESS',
                message: 'User is not found.',
              },
            });
          return;
        }

        req.params.configPath = config;
      }

      req.params.endpointSecret = endpointSecret;

      const handler = R.compose<
        [Mapper],
        Mapper[Methods],
        Mapper[Methods][Endpoints]
      >(
        R.prop(endpoint.replace(/\//, '')),
        R.prop(method.toLowerCase()),
      )(handlerMapper);

      const [error, data] = await tryCatch(handler, [req, storageAdapter]);

      if (error) {
        console.log('ERROR', error);
        res.status(400).send({
          error: {
            code: error.name,
            message: error.message,
          },
        });
        return;
      }

      if (endpoint.match(/portal/)) {
        res.redirect((data as Record<'url', string>)?.url);
        return;
      }

      res.json({
        ok: true,
        data,
      });
    };
  }
}
