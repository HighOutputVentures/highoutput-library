/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import { Command } from 'commander';
import { readFile } from 'fs/promises';

async function readConfig(config: string) {
  const path = `./${config}`;
  const data = await readFile(path, { encoding: 'utf8' });
  return JSON.parse(data);
}

const init = new Command('init')
  .description('Initialize the Stripe environment')
  .argument('<config>', 'path to JSON config file')
  .action(async (config: string) => {
    try {
      const configFile = await readConfig(config);
      console.log(configFile.name, 'secret', process.env.STRIPE_SECRET_KEY);

      // TODO: SETUP STRIPE
      // TODO: CREATE STRIPE PRODUCTS
      // TODO: SETUP CUSTOMER PORTAL
    } catch (error) {
      console.error(`\x1b[31m${(error as Error).message}\x1b[0m`);
    }
  });

export default init;
