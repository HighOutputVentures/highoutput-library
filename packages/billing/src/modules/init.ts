/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import { Command } from 'commander';
import { readFile } from 'fs/promises';
import path from 'path';
import { StripeConfig } from '../types';
import * as stripe from '../lib/stripe';

async function readConfig(config: string) {
  const configPath = path.join(process.cwd(), config);
  const data = await readFile(configPath, { encoding: 'utf8' });
  return JSON.parse(data);
}

const init = new Command('init')
  .description('Initialize the Stripe environment')
  .argument('<config>', 'path to JSON config file')
  .action(async (config: string) => {
    try {
      const configFile: StripeConfig = await readConfig(config);

      stripe.setupStripe();

      const prices = await stripe.createProducts(configFile.tiers);

      // TODO: ADD PRODUCT & PRICING TO CUSTOMER PORTAL
      stripe.setupCustomerPortal(configFile.customerPortal);
    } catch (error) {
      console.error(`\x1b[31m${(error as Error).message}\x1b[0m`);
    }
  });

export default init;
