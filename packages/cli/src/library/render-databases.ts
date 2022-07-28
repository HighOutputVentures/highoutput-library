import { Database, DatabaseStatus } from '../types'
import R from 'ramda';
import Str from '@supercharge/strings';
import chalk from 'chalk';
import { DateTime } from 'luxon';

export default function(databases: Pick<Database, 'id' | 'tags' | 'status' | 'dateTimeUpdated'>[]) {
  const width = 20;
  let output = chalk.bold([
    'DATABASE ID',
    'NAME',
    'STATUS',
    'DATE UPDATED'
  ].map(item => item.padEnd(width, ' ')).join('') + '\n');

  for (const database of databases) {
    let line = database.id.toString().padEnd(width, ' ');

    line += Str(R.find(R.propEq('name', 'name'), database.tags)?.value || '')
      .trim()
      .limit(width, '...')
      .padRight(width, ' ')
      .get();

    const mod = [DatabaseStatus.Creating, DatabaseStatus.Deleting].includes(database.status) ? chalk.yellow :
      database.status === DatabaseStatus.Running ? chalk.green :
      database.status === DatabaseStatus.Failed ? chalk.red :
      database.status === DatabaseStatus.Deploying ? chalk.blue :
      chalk.white;

    line += mod(database.status.padEnd(width, ' '));

    const dateTimeUpdated = DateTime.fromJSDate(database.dateTimeUpdated).toRelative() as string;

    line += dateTimeUpdated.padEnd(width, ' ');

    output += `${line}\n`;
  }

  return output;
}
