import { Command } from 'commander';
import * as client from '../../library/client';
import {
  ObjectID,
  ResourceType,
  User,
} from '../../types'
import renderUsers from '../../library/render-users';

const command = new Command('create')
  .argument('<name>', 'unique user name')
  .description('Create a user.')
  .action(async (name) => {
    const id = new ObjectID();
    const result = (await client.createOrUpdate({
      type: ResourceType.User,
      body: {
        name,
      },
      id,
    })) as User;

    console.log(renderUsers([result]));
  });

export default command;
