import { Command } from 'commander';
import renderDeployments from '../../library/render-deployments';
import { Deployment, ObjectID, ResourceType } from '../../../types';
import * as client from '../../library/client';

const command = new Command('delete');

command
  .argument('<id>', 'deployment ID')
  .description('Delete a deployment.')
  .action(async (id) => {
    const result = await client.remove({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
    });

    console.log(renderDeployments([result as Deployment]));
  });

export default command;