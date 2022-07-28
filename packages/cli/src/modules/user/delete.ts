import { Command } from 'commander';
import * as client from '../../library/client';
import { ResourceType, User } from '../../types'

const command = new Command('delete')
  .argument('<id>', 'user ID')
  .description('Delete a user.')
  .action(async (id) => {
    const result = (await client.remove({
      type: ResourceType.User,

      id,
    })) as User;

    console.log(`User ${result.name} got deleted`);
  });

export default command;
