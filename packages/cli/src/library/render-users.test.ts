import R from 'ramda';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import Chance from 'chance';
import { generateUser } from '../../__tests__/helpers.next/generate-user';
import renderUser from './render-users';

const chance = new Chance();

describe('renderUsers', () => {
  test('single user', () => {
    const user = generateUser();
    const dateTimeUpdated = DateTime.now()
      .minus({ minutes: chance.minute() })
      .toJSDate();
    const output = renderUser([{ ...user, dateTimeUpdated }]);

    const lines = output.split('\n');

    expect(lines[0]).toBe(
      chalk.bold(
        'USER ID             NAME                API TOKEN                     DATE UPDATED        '
      )
    );
    expect(R.includes(user.id.toString(), lines[1])).toBeTruthy();
    expect(R.includes(user.name, lines[1])).toBeTruthy();
    expect(R.includes(user.apiToken, lines[1])).toBeTruthy();
    expect(
      R.includes(
        DateTime.fromJSDate(dateTimeUpdated).toRelative() as string,
        lines[1]
      )
    ).toBeTruthy();
  });

  test('multiple users', () => {
    const users = R.times(() => {
      return {
        ...generateUser(),
        dateTimeUpdated: DateTime.now()
          .minus({ minutes: chance.minute() })
          .toJSDate(),
      };
    }, 10);
    const output = renderUser(users);

    const lines = R.filter(R.identity as never, output.split('\n'));

    expect(lines.length).toBe(users.length + 1);
    expect(lines[0]).toBe(
      chalk.bold(
        'USER ID             NAME                API TOKEN                     DATE UPDATED        '
      )
    );

    for (const index of R.range(0, users.length)) {
      const user = users[index];
      const line = lines[index + 1];

      expect(R.includes(user.id.toString(), line)).toBeTruthy();
      expect(R.includes(user.name, line)).toBeTruthy();
      expect(R.includes(user.apiToken, line)).toBeTruthy();
      expect(
        R.includes(
          DateTime.fromJSDate(user.dateTimeUpdated).toRelative() as string,
          line
        )
      ).toBeTruthy();
    }
  });
});
