import chalk from 'chalk';
import program from '../../src/program';
import generateDeployment from '../helpers.next/generate-deployment';
import { DeploymentStatus } from '../../src/types';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';
import { DateTime } from 'luxon';
import Chance from 'chance';

const chance = new Chance();

describe('deployment', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });
  describe('deploy', () => {
    test('deploy the deployment with branch argument', async () => {
      const deployment = {
        ...generateDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .post(`/deployments/${deployment.id.toString()}:deploy`)
        .reply(200, {
          ...deployment,
          id: deployment.id.toString(),
          status: DeploymentStatus.Updating,
        }
      );

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'deployment',
        'deploy',
        deployment.id.toString(),
        '--branch',
        'release',
      ]);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(DeploymentStatus.Updating);
      expect(outputs[1]).toContain(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string);
    });
    test('deploy the deployment with tag argument', async () => {
      const deployment = {
        ...generateDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .post(`/deployments/${deployment.id.toString()}:deploy`)
        .reply(200, {
          ...deployment,
          id: deployment.id.toString(),
          status: DeploymentStatus.Updating,
        }
      );

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'deployment',
        'deploy',
        deployment.id.toString(),
        '--tag',
        'v0.2.1',
      ]);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(DeploymentStatus.Updating);
      expect(outputs[1]).toContain(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string);
    });

    test('deploy the deployment with dockerfile argument', async () => {
      const deployment = {
        ...generateDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .post(`/deployments/${deployment.id.toString()}:deploy`)
        .reply(200, {
          ...deployment,
          id: deployment.id.toString(),
          status: DeploymentStatus.Updating,
        }
      );

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'deployment',
        'deploy',
        deployment.id.toString(),
        '--docker-file',
         chance.word()
      ]);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(DeploymentStatus.Updating);
      expect(outputs[1]).toContain(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string);
    });
  });
});