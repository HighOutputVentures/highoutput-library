import { Database, ResourceType } from '../../types'
import { Command } from 'commander';
import * as client from '../../library/client';
import renderDatabases from '../../library/render-databases';

const command = new Command('list');

command
  .alias('ls')
  .description('List all databases.')
  .action(async () => {
    const databases = await client.list({
      type: ResourceType.Database
    });

    console.log(renderDatabases(databases as Database[]));
  });

export default command;