import { Command } from 'commander';
import { Database, ObjectID, ResourceType } from '../../../types';
import * as client from '../../library/client';
import renderDatabases from '../../library/render-databases';

const command = new Command('delete');

command
  .argument('<id>', 'database ID')
  .description('Delete a database. There is no way to recover data from a deleted database. Use with caution.')
  .action(async (id) => {
    const result = await client.remove({
      type: ResourceType.Database,
      id: ObjectID.from(id),
    });

    console.log(renderDatabases([result as Database]));
  });

export default command;