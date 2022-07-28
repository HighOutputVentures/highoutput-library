import { Deployment, DeploymentStatus } from '../types'
import R from 'ramda';
import Str from '@supercharge/strings';
import chalk from 'chalk';
import { DateTime } from 'luxon';

export default function(deployments: Pick<Deployment, 'id' | 'tags' | 'status' | 'dateTimeUpdated'>[]) {
  const width = 20;
  let output = chalk.bold([
    'DEPLOYMENT ID',
    'NAME',
    'STATUS',
    'DATE UPDATED'
  ].map(item => item.padEnd(width, ' ')).join('') + '\n');

  for (const deployment of deployments) {
    let line = deployment.id.toString().padEnd(width, ' ');

    line += Str(R.find(R.propEq('name', 'name'), deployment.tags)?.value || '')
      .trim()
      .limit(width, '...')
      .padRight(width, ' ')
      .get();

    const mod = [DeploymentStatus.Creating, DeploymentStatus.Updating, DeploymentStatus.Deleting].includes(deployment.status) ? chalk.yellow :
      deployment.status === DeploymentStatus.Running ? chalk.green :
      deployment.status === DeploymentStatus.Failed ? chalk.red :
      deployment.status === DeploymentStatus.Deploying ? chalk.blue :
      chalk.white;

    line += mod(deployment.status.padEnd(width, ' '));

    const dateTimeUpdated = DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string;

    line += dateTimeUpdated.padEnd(width, ' ');

    output += `${line}\n`;
  }

  return output;
}
