import chalk from 'chalk';
import nock from 'nock';
import R from 'ramda';
import { API_BASE_URL } from '../../src/library/contants';
import program from '../../src/program';
import { DatabaseStatus, DatabaseType } from '../../types';
import { DateTime } from 'luxon';
import Chance from 'chance';
import generateDatabase from '../helpers.next/generate-database';

const chance = new Chance();

describe('database', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    test('create database', async function() {
      const spy = jest.spyOn(global.console, 'log');

      const database = {
        ...generateDatabase(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .put(/^\/databases\/(.+)$/)
        .reply(200, {
          id: database.id.toString(),
          ...R.pick([ 'tags', 'dateTimeUpdated'], database),
          status: DatabaseStatus.Creating,
          dateTimeCreated: new Date(),
        });

      const args = [
        'node',
        './dist/index.js',
        'database',
        'create',
        database.tags[0].value,
      ];

      for (const { name, value } of R.tail(database.tags)) {
        args.push('-t');
        args.push(`${name}=${value}`);
      }

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DATABASE ID         NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(database.tags[0].value);
      expect(outputs[1]).toContain('CREATING');
      expect(outputs[1]).toContain(DateTime.fromJSDate(database.dateTimeUpdated).toRelative() as string);
    });

    test('create postgres database', async function() {
      const spy = jest.spyOn(global.console, 'log');

      const database = {
        ...generateDatabase(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .put(/^\/databases\/(.+)$/)
        .reply(200, {
          id: database.id.toString(),
          ...R.pick([ 'tags', 'dateTimeUpdated'], database),
          status: DatabaseStatus.Creating,
          type: DatabaseType.PSql,
          dateTimeCreated: new Date(),
        });

      const args = [
        'node',
        './dist/index.js',
        'database',
        'create',
        database.tags[0].value,
        '--type',
        'postgres'
      ];

      for (const { name, value } of R.tail(database.tags)) {
        args.push('-t');
        args.push(`${name}=${value}`);
      }

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DATABASE ID         NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(database.tags[0].value);
      expect(outputs[1]).toContain('CREATING');
      expect(outputs[1]).toContain(DateTime.fromJSDate(database.dateTimeUpdated).toRelative() as string);
    });
  });
});