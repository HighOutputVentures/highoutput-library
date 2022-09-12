import { Command } from 'commander';
import { Deployment, ObjectID, ResourceType } from '../../types';
import renderDeployments from '../../library/render-deployments';
import * as client from '../../library/client';

const command = new Command('deploy');

command
  .argument('<id>', 'deployment ID')
  .description('Rebuild and deploy latest changes of your app.')
  .option('-b, --branch <branch_name>', 'Git branch name of code to deploy.')
  .option('-gt, --tag <tag_name>', 'Git tag name of code to deploy.')
  .option('-df, --docker-file <file_name>', 'Custom Dockerfile to be used for building deployments.')
  .action(async (id: string, options: {
    branch?: string;
    tag?: string;
    dockerFile?: string;
  }) => {
    const result = await client.deploy({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
      body: {
        branch: options.branch,
        tag: options.tag,
        dockerFile: options.dockerFile,
      },
    });

    console.log(renderDeployments([result as Deployment]));
  });

export default command;
