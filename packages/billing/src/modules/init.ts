/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import { Command } from 'commander';
import createProducts from '../lib/create-products';
import readConfig from '../lib/read-config';
import setupCustomerPortal from '../lib/setup-customer-portal';

const init = new Command('init')
  .description('Initialize the Stripe environment')
  .argument('<config>', 'path to JSON config file')
  .action(async (config: string) => {
    try {
      const configFile = await readConfig(config);

      const products = await createProducts(configFile.tiers);

      const portalId = await setupCustomerPortal(
        configFile.customerPortal,
        products,
      );
      console.log(`Customer portal configured successfully: ${portalId}`);
    } catch (error) {
      console.error(`\x1b[31m${(error as Error).message}\x1b[0m`);
    }
  });

export default init;
