import chalk from 'chalk';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';
import program from '../../src/program';
import { DateTime } from 'luxon';
import Chance from 'chance';
import { generateUser } from '../helpers.next/generate-user';

const chance = new Chance();

describe('user', () => {
  afterEach(async function () {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    test('create user', async function () {
      const spy = jest.spyOn(global.console, 'log');

      const user = {
        ...generateUser(),
        dateTimeUpdated: DateTime.now()
          .minus({ minutes: chance.minute() })
          .toJSDate(),
      };

      nock(API_BASE_URL)
        .put(/^\/users\/(.+)$/)
        .reply(200, {
          ...user,
          id: user.id.toString(),
          dateTimeCreated: new Date(),
        });

      const args = ['node', './dist/index.js', 'user', 'create', user.name];

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(
        chalk.bold(
          'USER ID             NAME                API TOKEN                     DATE UPDATED        '
        )
      );
      expect(outputs[1]).toContain(user.id.toString());
      expect(outputs[1]).toContain(user.name);
      expect(outputs[1]).toContain(user.apiToken);
      expect(outputs[1]).toContain(
        DateTime.fromJSDate(user.dateTimeUpdated).toRelative() as string
      );
    });
  });
});
