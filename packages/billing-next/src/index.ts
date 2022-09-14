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
import { IAuthorizationAdapter } from './interfaces/authorization.adapter';
import { ApiProvider } from './providers/api.provider';
import { IApiProvider, Response } from './interfaces/api.provider';

export class BillingServer {
  #container = new Container();

  #signingSecret: string;

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
        maxNetworkRetries: 4,
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
    this.#container.bind(TYPES.ApiProvider).to(ApiProvider);
    this.#signingSecret = params.endpointSigningSecret;
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
      const { method, path } = req;
      const user = await authorizationAdapter.authorize({
        header: req.headers as Record<string, string>,
      });

      let data: Response;

      try {
        switch (true) {
          case R.test(/GET/, method) && R.test(/^\/tiers$/, path):
            if (!user) {
              throw new Error('User not found.');
            }

            data = await expressApi.getTiers();
            break;

          case R.test(/GET/, method) && R.test(/^\/secret$/, path):
            if (!user) {
              throw new Error('User not found.');
            }

            data = await expressApi.getSecret({ user: user.id });
            break;

          case R.test(/GET/, method) && R.test(/^\/subscription$/, path):
            if (!user) {
              throw new Error('User not found.');
            }

            data = await expressApi.getSubscription({
              user: user.id,
            });
            break;

          case R.test(/GET/, method) && R.test(/^\/portal$/, path):
            if (!user) {
              throw new Error('User not found.');
            }

            data = await expressApi.getPortal({ user: user.id });
            break;

          case R.test(/PUT/, method) && R.test(/^\/subscription$/, path): {
            if (!user) {
              throw new Error('User not found.');
            }

            const body = await parse(req);

            if (!body.tier) {
              throw new Error('Lacking property in request payload: price');
            }

            data = await expressApi.putSubscription({
              user: user.id,
              body,
            });
            break;
          }

          case R.test(/POST/, method) && R.test(/^\/webhook$/, path): {
            const { raw: rawBody } = await parse(req, { returnRawBody: true });
            const signature = req.headers['stripe-signature'];

            const webhookParams = {
              endpointSecret: this.#signingSecret,
              rawBody,
              signature,
            };
            data = await expressApi.postWebhook({ body: webhookParams });
            break;
          }
          default:
            next();
            return;
        }
      } catch (error) {
        res.status(400).send({ error: (error as Error).message });
        return;
      }

      if (data.status === 404) {
        res.sendStatus(404);
        return;
      }

      if (data.status === 301) {
        res.redirect(data.status, data.redirectionUrl as string);
        return;
      }

      res.status(data.status).send(data.body);
    };
  }
}
