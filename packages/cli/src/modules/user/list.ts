import { Command } from 'commander';
import * as client from '../../library/client';
import { ResourceType, User } from '../../../types';
import renderUsers from '../../library/render-users';

const command = new Command('list')
  .alias('ls')
  .description('list all users.')
  .action(async () => {
    const result = (await client.list({
      type: ResourceType.User,
    })) as User[];

    console.log(renderUsers(result));
  });

export default command;
