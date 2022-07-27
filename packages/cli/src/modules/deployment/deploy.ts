import { Deployment, ObjectID, ResourceType } from '../../../types';
import { Command } from 'commander';
import renderDeployments from '../../library/render-deployments';
import * as client from '../../library/client';

const command = new Command('deploy');

command
  .argument('<id>', 'deployment ID')
  .description('Rebuild and deploy latest changes of your app.')
  .option('-b, --branch <branch_name>', 'Git branch name of code to deploy.')
  .option('-gt, --tag <tag_name>', 'Git tag name of code to deploy.')
  .action(async (id: string, options: {
    branch?: string;
    tag?: string;
  }) => {
  
    const result = await client.deploy({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
      body: {
        branch: options.branch,
        tag: options.tag,
      },
    });
    
    console.log(renderDeployments([result as Deployment]));
  });

  export default command;