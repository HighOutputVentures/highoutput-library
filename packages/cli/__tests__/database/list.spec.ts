import { Database } from '../../types';
import nock from 'nock';
import R from 'ramda';
import chalk from 'chalk';
import { API_BASE_URL } from '../../src/library/contants';
import program from '../../src/program';
import { DateTime } from 'luxon';
import Chance from 'chance';
import generateDatabase from '../helpers.next/generate-database';

const chance = new Chance();

describe('database', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('list', () => {
    test('list database', async function() {
      const spy = jest.spyOn(global.console, 'log');

      nock(API_BASE_URL)
        .get(/^\/databases$/)
        .reply(200, R.map<Database, unknown>((database) => {
          return {
            ...database,
            id: database.id.toString(),
            dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
          };
        }, R.times(generateDatabase, 10)));

      const args = [
        'node',
        './dist/index.js',
        'database',
        'list',
      ];

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].trim().split('\n');

      expect(outputs[0]).toBe(chalk.bold('DATABASE ID         NAME                STATUS              DATE UPDATED        '));
      for (const line of R.tail(outputs)) {
        expect(line).toMatch(/^(.+)( *)(.+)( *)(.*)(RUNNING|CREATING|UPDATING|FAILED|DELETING)(.*)( *)$/);
      }
    });
  });
});