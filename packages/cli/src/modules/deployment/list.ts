import { Deployment, ResourceType } from '../../types'
import { Command } from 'commander';
import renderDeployments from '../../library/render-deployments';
import * as client from '../../library/client';

const command = new Command('list');

command
  .alias('ls')
  .description('List all deployments.')
  .action(async () => {
    const deployments = await client.list({
      type: ResourceType.Deployment
    });

    console.log(renderDeployments(deployments as Deployment[]));
  });

export default command;