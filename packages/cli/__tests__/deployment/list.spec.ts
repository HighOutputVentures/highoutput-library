import { Deployment } from '../../src/types';
import nock from 'nock';
import R from 'ramda';
import chalk from 'chalk';
import { API_BASE_URL } from '../../src/library/contants';
import program from '../../src/program';
import generateDeployment from '../helpers.next/generate-deployment';
import { DateTime } from 'luxon';
import Chance from 'chance';

const chance = new Chance();

describe('deployment', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    test('list deployments', async function() {
      const spy = jest.spyOn(global.console, 'log');

      nock(API_BASE_URL)
        .get(/^\/deployments$/)
        .reply(200, R.map<Deployment, unknown>((deployment) => {
          return {
            ...deployment,
            id: deployment.id.toString(),
            dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
          };
        }, R.times(generateDeployment, 10)));

      const args = [
        'node',
        './dist/index.js',
        'deployment',
        'list',
      ];

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].trim().split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      for (const line of R.tail(outputs)) {
        expect(line).toMatch(/^(.+)( *)(.+)( *)(.*)(RUNNING|CREATING|UPDATING|FAILED|DELETING)(.*)( *)$/);
      }
    });
  });
});