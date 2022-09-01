import 'reflect-metadata';
import { Container } from 'inversify';
import Stripe from 'stripe';
import { ConfigProvider } from './providers/config.provider';
import { StripeProvider } from './providers/stripe.provider';
import { TYPES } from './types';

export class BilligServer {
  constructor(params: { stripeSecretKey: string; configFilePath: string }) {
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
