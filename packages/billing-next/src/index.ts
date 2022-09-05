import 'reflect-metadata';
import { Container } from 'inversify';
import Stripe from 'stripe';
import R from 'ramda';
import * as express from 'express';
import { ConfigProvider } from './providers/config.provider';
import { StripeProvider } from './providers/stripe.provider';
import { TYPES } from './types';
import { IStripeProviderStorageAdapter } from './interfaces/stripe.provider';
import { IAuthorizationAdapter } from './interfaces/authorization.adapter';
import { ExpressApiProvider } from './providers/express-api.provider';
import { IApiProvider, Response } from './interfaces/api.provider';

export class BilligServer {
  #container = new Container();

  constructor(params: {
    stripeSecretKey: string;
    configFilePath: string;
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
  }

  public expressMiddleware() {
    this.#container.bind(TYPES.ApiProvider).to(ExpressApiProvider);
    const expressApi = this.#container.get<IApiProvider>(TYPES.ApiProvider);

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

      if (R.test(/webhook/, endpoint)) {
        // authorize user
      }

      let data: Response;

      switch (true) {
        case R.test(/GET/, method) && R.test(/tiers/, endpoint):
          data = await expressApi.getTiers();
          break;
        default:
          data = null as never;
          break;
      }

      if (R.isNil(data)) {
        res.sendStatus(400);
        return;
      }

      if (data.status === 301) {
        res.redirect(data.body?.url as string);
        return;
      }

      res.status(data.status).send(data.body);
    };
  }
}
