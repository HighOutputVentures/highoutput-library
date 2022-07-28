import program from '../../src/program';
import { DatabaseStatus } from '../../types';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';
import generateDatabase from '../helpers.next/generate-database';

describe('database', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('inspect', () => {
    test('inspect database', async () => {
      const database = {
        ...generateDatabase(),
        status: DatabaseStatus.Deleting,
      };

      nock(API_BASE_URL)
        .get(`/databases/${database.id.toString()}`)
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
        'inspect',
        database.id.toString(),
      ]);

      const output = spy.mock.calls[0][0].trim();

      expect(output.includes(database.id.toString())).toBeTruthy();
      expect(output.includes(database.status)).toBeTruthy();
      expect(output.includes(database.uri!)).toBeTruthy();
      expect(output.includes(database.dateTimeCreated.toISOString())).toBeTruthy();
      expect(output.includes(database.dateTimeUpdated.toISOString())).toBeTruthy();
    });
  });
});