import { ObjectID, ResourceType } from '../../../types';
import { Command } from 'commander';
import * as client from '../../library/client';

const command = new Command('logs');

command
  .argument('<id>', 'deployment ID')
  .description('Display logs of the deployment. Useful when checking why your deployment failed or stuck.')
  .option('--tail', 'Follow logs stream.')
  .option('--lines <number_of_lines>', 'The of line of logs to return')
  .action(async (id, options: {
    tail?: string;
    lines?: string;
  }) => {
    const logs = await client.attribute({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
      name: 'logs',
      query: {
        tail: options.tail ? options.tail : 'false',
        lines: options.lines ? options.lines : '',
      }
    });

    console.log(logs);
  });

export default command;