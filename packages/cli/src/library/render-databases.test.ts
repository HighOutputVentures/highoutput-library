import R from 'ramda';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import Chance from 'chance';
import generateDatabase from '../../__tests__/helpers.next/generate-database';
import renderDatabases from './render-databases';

const chance = new Chance();

describe('renderDatabases', () => {
  test('single database', () => {
    const database = generateDatabase();
    const dateTimeUpdated = DateTime.now().minus({minutes: chance.minute() }).toJSDate();
    const output = renderDatabases([{
      ...database,
      dateTimeUpdated,
    }]);

    const lines = output.split('\n');

    expect(lines[0]).toBe(chalk.bold('DATABASE ID         NAME                STATUS              DATE UPDATED        '));
    expect(R.includes(database.id.toString(), lines[1])).toBeTruthy();
    expect(R.includes(database.tags[0].value, lines[1])).toBeTruthy();
    expect(R.includes(database.status, lines[1])).toBeTruthy();
    expect(R.includes(DateTime.fromJSDate(dateTimeUpdated).toRelative() as string, lines[1])).toBeTruthy();
  });

  test('multiple databases', () => {
    const databases = R.times(()=> {
      return {
        ...generateDatabase(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }
    }, 10);
    const output = renderDatabases(databases);

    const lines = R.filter(R.identity as never, output.split('\n'));

    expect(lines.length).toBe(databases.length + 1);
    expect(lines[0]).toBe(chalk.bold('DATABASE ID         NAME                STATUS              DATE UPDATED        '));

    for (const index of R.range(0, databases.length)) {
      const database = databases[index];
      const line = lines[index + 1];

      expect(R.includes(database.id.toString(), line)).toBeTruthy();
      expect(R.includes(database.tags[0].value, line)).toBeTruthy();
      expect(R.includes(database.status, line)).toBeTruthy();
      expect(R.includes(DateTime.fromJSDate(database.dateTimeUpdated).toRelative() as string, line)).toBeTruthy();
    }
  });
});
