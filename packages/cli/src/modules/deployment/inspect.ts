import { Command } from 'commander';
import renderDeployment from '../../library/render-deployment';
import * as client from '../../library/client';
import { Deployment, ObjectID, ResourceType } from '../../types'

const command = new Command('inspect');

command
  .argument('<id>', 'deployment ID')
  .description('Display deployment details.')
  .action(async (id) => {
    const result = await client.find({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
    });

    console.log(renderDeployment(result as Deployment));
  });

export default command;