import path from 'path';
import { Deployment, DeploymentTag, DeploymentStatus, EnvironmentVariable, ObjectID, ResourceType } from '../../types'
import { Command } from 'commander';
import R from 'ramda';
import git from 'git-utils';
import renderDeployments from '../../library/render-deployments';
import * as client from '../../library/client';

const command = new Command('create')
  .description('Create a new deployment. Requires your app to have a Dockerfile and runs on port 80.')
  .argument('<name>', 'deployment name')
  .option('-r, --repository <repository>', 'The app\'s github repository SSH clone link.')
  .option('-d, --directory <directory>', 'If using monorepo setup, specify the app directory.')
  .option('-e, --env <environment...>', 'The application runtime environment variables. If you need to use build time environment variables, put it into your dockerfile instead. This flag can be used multiple times.')
  .option('-t, --tag <tag...>', 'Resource tags to help identify the deployment. This flag can be used multiple times')
  .action(async (name: string, options: {
    env?: string[];
    repository: string;
    directory?: string;
    tag?: string[];
  }) => {
    const id = new ObjectID();
    
    const environment = R.compose<
      [string[]],
      (EnvironmentVariable | null)[],
      EnvironmentVariable[],
      EnvironmentVariable[]
    >(
      R.uniqBy<EnvironmentVariable, string>((item) => item.name.toLowerCase()),
      R.filter<EnvironmentVariable | null, EnvironmentVariable>(R.identity as never),
      R.map((item) => {
        const match = item.match(/^([a-zA-Z_][a-zA-Z0-9_]+)=(.*)$/);
  
        if (!match) {
          return null;
        }
  
        const [, name, value] = match;
  
        return {
          name: name.toUpperCase(),
          value
        } as EnvironmentVariable;
      }),
    )(options.env || []);

    const tags = R.compose<
      [string[]],
      (DeploymentTag | null)[],
      DeploymentTag[],
      DeploymentTag[]
    >(
      R.uniqBy<DeploymentTag, string>((item) => item.name.toLowerCase()),
      R.filter<DeploymentTag | null, DeploymentTag>(
        <(value: DeploymentTag | null) => value is DeploymentTag>R.identity
      ),
      R.map((item) => {
        const match = item.match(/^([a-zA-Z_][a-zA-Z0-9_]+)=(.*)$/);

        if (!match) {
          return null;
        }

        const [, name, value] = match;

        return {
          name: name.toLowerCase(),
          value
        } as DeploymentTag;
      }),
    )([...(options.tag || []), `name=${name}`]);
    
    let { repository, directory } = options;

    if (!repository) {
      try {
        const repo = git.open(process.cwd());

        repository = repo.getConfigValue('remote.origin.url');
      } catch (err) {
        if (err instanceof TypeError)
          console.log(err.message, 'error: could not found git');
      }
    }

    if (!directory) {
      try {
        const repo = git.open(process.cwd());
        const absolutePathDirectory = repo.getWorkingDirectory();

        directory = path.relative(absolutePathDirectory, process.cwd());
      } catch (err) {
        if (err instanceof TypeError)
          console.log(err.message, 'error: could not found git');
      }
    }

    const {dateTimeUpdated} = await client.createOrUpdate({
      type: ResourceType.Deployment,
      id,
      body: {
        repository,
        directory,
        tags,
        environment,
      }
    }) as Deployment;

    console.log(renderDeployments([
      {
        id,
        tags: tags,
        status: DeploymentStatus.Creating,
        dateTimeUpdated,
      }
    ]));
  });

export default command;
