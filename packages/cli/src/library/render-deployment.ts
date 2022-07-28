import { Deployment, DeploymentStatus } from '../types'
import R from 'ramda';
import chalk from 'chalk';

export default function render(deployment: Deployment) {
  let line = `${chalk.bold('ID')}: ${deployment.id}\n`;
  const tags = R.map((tag)=>{
    return `${tag.name}: ${tag.value}`;
  }, deployment.tags);

  const environment = R.map((variable)=>{
    return `${variable.name}: ${variable.value}`;
  }, deployment.environment || []);

  const mod = [DeploymentStatus.Creating, DeploymentStatus.Updating, DeploymentStatus.Deleting].includes(deployment.status) ? chalk.yellow :
    deployment.status === DeploymentStatus.Running ? chalk.green :
    deployment.status === DeploymentStatus.Failed ? chalk.red :
    deployment.status === DeploymentStatus.Deploying ? chalk.blue :
    chalk.white;

  line += `${chalk.bold('Status')}: ${mod(deployment.status)}\n`;
  line += `${chalk.bold('URL')}: ${deployment.url || ''}\n`;
  line += `${chalk.bold('Repository')}: ${deployment.repository}\n`;
  line += `${chalk.bold('Tags')}:\n  ${tags.join('\n  ')}\n`;
  line += `${chalk.bold('Directory')}: ${deployment.directory || ''}\n`;
  line += `${chalk.bold('Environment')}:\n  ${environment.join('\n  ')}\n`;
  line += `${chalk.bold('Date Created')}: ${deployment.dateTimeCreated.toISOString()}\n`;
  line += `${chalk.bold('Date Updated')}: ${deployment.dateTimeUpdated.toISOString()}\n`;

  return line;
}
