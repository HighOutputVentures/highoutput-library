import { Database, DatabaseStatus } from '../types'
import R from 'ramda';
import chalk from 'chalk';

export default function render(database: Database) {
  let line = `${chalk.bold('ID')}: ${database.id}\n`;
  const tags = R.map((tag)=>{
    return `${tag.name}: ${tag.value}`;
  }, database.tags);

  const mod = [DatabaseStatus.Creating, DatabaseStatus.Deleting].includes(database.status) ? chalk.yellow :
    database.status === DatabaseStatus.Running ? chalk.green :
    database.status === DatabaseStatus.Failed ? chalk.red :
    database.status === DatabaseStatus.Deploying ? chalk.blue :
    chalk.white;

  line += `${chalk.bold('Status')}: ${mod(database.status)}\n`;
  line += `${chalk.bold('URL')}: ${database.uri || ''}\n`;
  line += `${chalk.bold('Tags')}:\n  ${tags.join('\n  ')}\n`;
  line += `${chalk.bold('Date Created')}: ${database.dateTimeCreated.toISOString()}\n`;
  line += `${chalk.bold('Date Updated')}: ${database.dateTimeUpdated.toISOString()}\n`;

  return line;
}
