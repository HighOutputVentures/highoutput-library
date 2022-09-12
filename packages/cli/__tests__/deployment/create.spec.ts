import chalk from 'chalk';
import nock from 'nock';
import R from 'ramda';
import generateDeployment from '../helpers.next/generate-deployment';
import { API_BASE_URL } from '../../src/library/contants';
import program from '../../src/program';
import { DeploymentStatus } from '../../src/types';
import { DateTime } from 'luxon';
import Chance from 'chance';

const chance = new Chance();

describe('deployment', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    test('create deployment', async function() {
      const spy = jest.spyOn(global.console, 'log');

      const deployment = {
        ...generateDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .put(/^\/deployments\/(.+)$/)
        .reply(200, {
          id: deployment.id.toString(),
          ...R.pick(['repository', 'directory', 'tags', 'environment', 'dateTimeUpdated'], deployment),
          status: DeploymentStatus.Creating,
          dateTimeCreated: new Date(),
        });

      const args = [
        'node',
        './dist/index.js',
        'deployment',
        'create',
        deployment.tags[0].value,
        '-r',
        deployment.repository,
        '-d',
        deployment.directory!,
      ];

      for (const { name, value } of deployment.environment!) {
        args.push('-e');
        args.push(`${name}=${value}`);
      }

      for (const { name, value } of R.tail(deployment.tags)) {
        args.push('-t');
        args.push(`${name}=${value}`);
      }

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(deployment.tags[0].value);
      expect(outputs[1]).toContain('CREATING');
      expect(outputs[1]).toContain(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string);
    });

    test('create deployment with dockerfile parameter', async function() {
      const spy = jest.spyOn(global.console, 'log');

      const deployment = {
        ...generateDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .put(/^\/deployments\/(.+)$/)
        .reply(200, {
          id: deployment.id.toString(),
          ...R.pick(['repository', 'directory', 'tags', 'environment', 'dateTimeUpdated', 'dockerFile'], deployment),
          status: DeploymentStatus.Creating,
          dateTimeCreated: new Date(),
        });

      const args = [
        'node',
        './dist/index.js',
        'deployment',
        'create',
        deployment.tags[0].value,
        '-r',
        deployment.repository,
        '-d',
        deployment.directory!,
        '-df',
        deployment.dockerFile!
      ];

      for (const { name, value } of deployment.environment!) {
        args.push('-e');
        args.push(`${name}=${value}`);
      }

      for (const { name, value } of R.tail(deployment.tags)) {
        args.push('-t');
        args.push(`${name}=${value}`);
      }

      await program.parseAsync(args);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(deployment.tags[0].value);
      expect(outputs[1]).toContain('CREATING');
      expect(outputs[1]).toContain(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string);
    });
  });
});