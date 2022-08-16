/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import { Command } from 'commander';
import * as stripe from '../lib/stripe';
import readConfig from '../lib/read-config';

const init = new Command('init')
  .description('Initialize the Stripe environment')
  .argument('<config>', 'path to JSON config file')
  .action(async (config: string) => {
    try {
      const configFile = await readConfig(config);

      stripe.setupStripe();

      const products = await stripe.createProducts(configFile.tiers);

      await stripe.setupCustomerPortal(configFile.customerPortal, products);
    } catch (error) {
      console.error(`\x1b[31m${(error as Error).message}\x1b[0m`);
    }
  });

export default init;
