/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import { Command } from 'commander';
import createProducts from '../lib/create-products';
import readConfig from '../lib/read-config';
import setupCustomerPortal from '../lib/setup-customer-portal';
import setupWebhookEndpoint from '../lib/setup-webhook';

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

      const secret = await setupWebhookEndpoint(configFile.webhook.url);

      console.log(`Webhook endpoint created successfullly! \n
      Your webhook signing secret is: ${secret}
      `);
    } catch (error) {
      console.error(`\x1b[31m${(error as Error).message}\x1b[0m`);
    }
  });

export default init;
