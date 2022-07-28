import { User } from '@highoutputventures/hovcli/types';
import nock from 'nock';
import R from 'ramda';
import chalk from 'chalk';
import { API_BASE_URL } from '../../src/library/contants';
import program from '../../src/program';
import { generateUser } from '../helpers.next/generate-user';
import { DateTime } from 'luxon';
import Chance from 'chance';

const chance = new Chance();

describe('users', () => {
  afterEach(async function () {
    jest.restoreAllMocks();
  });

  describe('list', () => {
    test('list users', async function () {
      const spy = jest.spyOn(global.console, 'log');

      nock(API_BASE_URL)
        .get(/^\/users$/)
        .reply(
          200,
          R.map<User, unknown>((user) => {
            return {
              ...user,
              id: user.id.toString(),
              dateTimeUpdated: DateTime.now()
                .minus({ minutes: chance.minute() })
                .toJSDate(),
            };
          }, R.times(generateUser, 10))
        );

      const args = ['node', './dist/index.js', 'user', 'list'];

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].trim().split('\n');

      expect(outputs[0]).toBe(
        chalk.bold(
          'USER ID             NAME                API TOKEN                     DATE UPDATED        '
        )
      );
      for (const line of R.tail(outputs)) {
        expect(line).toMatch(
          /^(.+)( +)(.+)( +)[a-zA-Z0-9]{24}( +)(.+)( +)(.+)$/
        );
      }
    });
  });
});
