import { Deployment, ObjectID, ResourceType } from '../../../types';
import { Command } from 'commander';
import R from 'ramda';
import renderDeployments from '../../library/render-deployments';
import * as client from '../../library/client';
import parseEnvironment from '../../library/parse-environment';
import parseDeploymentTags from '../../library/parse-deployment-tags';

const command = new Command('update');

command
  .argument('<id>', 'deployment ID')
  .description('Update tags and environment variables of your deployment.')
  .option('-e, --env <environment...>', 'The application runtime environment variables. If you need to use build time environment variables, put it into your dockerfile instead. This flag can be used multiple times.')
  .option('-t, --tag <tag...>', 'Resource tags to help identify the deployment.')
  .action(async (id: string, options: {
    env?: string[];
    tag?: string[];
  }) => {
    const deployment = (await client.find({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
    })) as Deployment | null;

    if (!deployment) {
      console.log(renderDeployments([]));

      return;
    }

    const environment = R.uniqBy(
      (item) => item.name.toLowerCase(),
      [...parseEnvironment(options.env || []), ...(deployment.environment || [])],
    );

    const tags = R.uniqBy(
      (item) => item.name.toLowerCase(),
      [...parseDeploymentTags(options.tag || []), ...(deployment.tags || [])],
    );

    const result = await client.update({
      type: ResourceType.Deployment,
      id: ObjectID.from(id),
      body: {
        environment,
        tags,
      },
    });
    
    console.log(renderDeployments([result as Deployment]));
  });

  export default command;