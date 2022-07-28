import { Command } from 'commander';
import renderDatabase from '../../library/render-database';
import * as client from '../../library/client';
import { Database, ObjectID, ResourceType } from '../../types'

const command = new Command('inspect');

command
  .argument('<id>', 'database ID')
  .description('Display database details.')
  .action(async (id) => {
    const result = await client.find({
      type: ResourceType.Database,
      id: ObjectID.from(id),
    });

    console.log(renderDatabase(result as Database));
  });

export default command;