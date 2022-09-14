import chalk from 'chalk';
import program from '../../src/program';
import { DatabaseStatus } from '../../src/types';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';
import generateDatabase from '../helpers.next/generate-database';
import { DateTime } from 'luxon';

describe('database', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('delete', () => {
    test('delete database', async () => {
      const database = {
        ...generateDatabase(),
        status: DatabaseStatus.Deleting,
      };

      nock(API_BASE_URL)
        .delete(`/databases/${database.id.toString()}`)
        .reply(200, () => {
          return {
            ...database,
            id: database.id.toString(),
            dateTimeCreated: database.dateTimeCreated.toISOString(),
            dateTimeUpdated: database.dateTimeUpdated.toISOString(),
          }
        });

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'database',
        'delete',
        database.id.toString(),
      ]);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DATABASE ID         NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(database.tags[0].value);
      expect(outputs[1]).toContain(DatabaseStatus.Deleting);
      expect(outputs[1]).toContain(DateTime.fromJSDate(database.dateTimeUpdated).toRelative() as string);
    });
  });
});