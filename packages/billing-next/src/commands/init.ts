import { Command } from 'commander';
import { Container } from 'inversify';
import mongoose from 'mongoose';
import path from 'path';
import Stripe from 'stripe';
import { MongooseStripeProdiverStorageAdapter } from '../adapters/mongoose-stripe-provider-storage.adapter';
import { IStripeProvider } from '../interfaces/stripe.provider';
import { ConfigProvider } from '../providers/config.provider';
import { StripeProvider } from '../providers/stripe.provider';
import { TYPES } from '../types';

const command = new Command('init')
  .description('initialize the Stripe environment')
  .argument('<config>', 'path to JSON config file')
  .requiredOption(
    '-s, --stripe-secret-key <stripeSecretKey>',
    'stripe secret key',
  )
  .requiredOption('-m, --mongo-db-uri <mongoDbUri>', 'MongoDB URI')
  .action(
    async (
      config: string,
      options: {
        stripeSecretKey: string;
        mongoDbUri: string;
      },
    ) => {
      const container = new Container();

      container.bind(TYPES.Stripe).toConstantValue(
        new Stripe(options.stripeSecretKey, {
          apiVersion: '2022-08-01',
        }),
      );
      container
        .bind(TYPES.ConfigProvider)
        .toConstantValue(
          new ConfigProvider(path.resolve(process.cwd(), config)),
        );

      const connection = mongoose.createConnection(options.mongoDbUri);

      container
        .bind(TYPES.StripeProviderStorageAdapter)
        .toConstantValue(new MongooseStripeProdiverStorageAdapter(connection));

      container.bind(TYPES.StripeProvider).to(StripeProvider);

      const stripeProvider = container.get<IStripeProvider>(
        TYPES.StripeProvider,
      );

      await stripeProvider.initializeTiers();
      await stripeProvider.initializeCustomerPortal();

      await connection.close();
    },
  );

export { command };
