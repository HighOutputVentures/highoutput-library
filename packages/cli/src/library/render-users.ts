import { User } from '../types'
import chalk from 'chalk';
import { DateTime } from 'luxon';

export default function (users: User[]) {
  const width = 20;
  let output = chalk.bold(
    ['USER ID', 'NAME', 'API TOKEN', 'DATE UPDATED']
      .map((item) => {
        if (item === 'API TOKEN') return item.padEnd(30);
        return item.padEnd(width, ' ');
      })
      .join('') + '\n'
  );

  for (const user of users) {
    let line = user.id.toString().padEnd(width, ' ');

    line += user.name.padEnd(width, ' ');

    line += user.apiToken.padEnd(30, ' ');

    line += (
      DateTime.fromJSDate(user.dateTimeUpdated).toRelative() as string
    ).padEnd(width, '');

    output += `${line}\n`;
  }

  return output;
}
