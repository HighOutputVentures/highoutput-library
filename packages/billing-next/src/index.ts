import 'reflect-metadata';
import { Container } from 'inversify';
import Stripe from 'stripe';
import { ConfigProvider } from './providers/config.provider';
import { StripeProvider } from './providers/stripe.provider';
import { TYPES } from './types';
import { IStripeProviderStorageAdapter } from './interfaces/stripe.provider';
import { IAuthorizationAdapter } from './interfaces/authorization.adapter';

export class BilligServer {
  constructor(params: {
    stripeSecretKey: string;
    configFilePath: string;
    stripeProviderStorageAdapter: IStripeProviderStorageAdapter;
    authorizationAdapter: IAuthorizationAdapter;
  }) {
    const container = new Container();

    container.bind(TYPES.Stripe).toConstantValue(
      new Stripe(params.stripeSecretKey, {
        apiVersion: '2022-08-01',
      }),
    );
    container
      .bind(TYPES.ConfigProvider)
      .toConstantValue(new ConfigProvider(params.configFilePath));
    container.bind(TYPES.StripeProvider).to(StripeProvider);
  }
}
