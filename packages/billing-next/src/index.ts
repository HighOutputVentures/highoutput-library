import 'reflect-metadata';
import { Container } from 'inversify';
import Stripe from 'stripe';
import R from 'ramda';
import * as express from 'express';
import parse from 'co-body';
import { ConfigProvider } from './providers/config.provider';
import { StripeProvider } from './providers/stripe.provider';
import { TYPES } from './types';
import { IStripeProviderStorageAdapter } from './interfaces/stripe.provider';
import {
  IAuthorizationAdapter,
  User,
} from './interfaces/authorization.adapter';
import { ExpressApiProvider } from './providers/express-api.provider';
import { IApiProvider, Response } from './interfaces/api.provider';

export class BillingServer {
  #container = new Container();

  constructor(params: {
    stripeSecretKey: string;
    configFilePath: string;
    endpointSigningSecret: string;
    stripeProviderStorageAdapter: IStripeProviderStorageAdapter;
    authorizationAdapter: IAuthorizationAdapter;
  }) {
    this.#container.bind(TYPES.Stripe).toConstantValue(
      new Stripe(params.stripeSecretKey, {
        apiVersion: '2022-08-01',
      }),
    );
    this.#container
      .bind(TYPES.ConfigProvider)
      .toConstantValue(new ConfigProvider(params.configFilePath));
    this.#container.bind(TYPES.StripeProvider).to(StripeProvider);
    this.#container
      .bind(TYPES.StripeProviderStorageAdapter)
      .toConstantValue(params.stripeProviderStorageAdapter);
    this.#container
      .bind(TYPES.AuthorizationAdapter)
      .toConstantValue(params.authorizationAdapter);
    this.#container.bind(TYPES.ApiProvider).to(ExpressApiProvider);
  }

  public expressMiddleware() {
    const expressApi = this.#container.get<IApiProvider>(TYPES.ApiProvider);
    const authorizationAdapter = this.#container.get<IAuthorizationAdapter>(
      TYPES.AuthorizationAdapter,
    );

    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const ENDPOINTS_REGEX =
        /^\/tiers$|^\/secret$|^\/subscription|^\/portal$|^\/webhook/;
      const { method, path } = req;
      const hasMatch = R.match(ENDPOINTS_REGEX, path);

      if (R.isNil(hasMatch)) {
        next();
        return;
      }

      const [endpoint] = hasMatch;
      const isWebhookRequest = R.test(/webhook/, endpoint);
      const user =
        !isWebhookRequest &&
        (await authorizationAdapter.authorize({
          header: req.headers as Record<string, string>,
        }));

      if (!isWebhookRequest && !user) {
        res
          .set('Content-Type', 'application/json')
          .status(401)
          .send({
            error: {
              code: 'INVALID_ACCESS',
              message: 'User is not found.',
            },
          });
        return;
      }

      let data: Response;

      try {
        switch (true) {
          case R.test(/GET/, method) && R.test(/tiers/, endpoint):
            data = await expressApi.getTiers();
            break;
          case R.test(/GET/, method) && R.test(/secret/, endpoint):
            data = await expressApi.getSecret({ user: (user as User).id });
            break;
          case R.test(/GET/, method) && R.test(/subscription/, endpoint):
            data = await expressApi.getSubscription({
              user: (user as User).id,
            });
            break;
          case R.test(/GET/, method) && R.test(/portal/, endpoint):
            data = await expressApi.getPortal({ user: (user as User).id });
            break;
          case R.test(/PUT/, method) && R.test(/subscription/, endpoint): {
            const body = await parse(req);

            if (!body.tier) {
              throw new Error('Lacking property in request payload: price');
            }

            data = await expressApi.putSubscription({
              user: (user as User).id,
              body,
            });
            break;
          }
          default:
            data = null as never;
            break;
        }
      } catch (error) {
        res.status(400).send({ error: (error as Error).message });
        return;
      }

      if (R.isNil(data)) {
        res.sendStatus(404);
        return;
      }

      if (data.status === 301) {
        res.redirect(data.status, data.body?.redirect_url as string);
        return;
      }

      res.status(data.status).send(data.body);
    };
  }
}
