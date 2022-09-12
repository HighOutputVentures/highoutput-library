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

  describe('update', () => {
    test('update deployment', async () => {
      const deployment = {
        ...generateDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }

      nock(API_BASE_URL)
        .get(`/deployments/${deployment.id.toString()}`)
        .reply(200, {
          ...deployment,
          id: deployment.id.toString(),
          status: DeploymentStatus.Running,
        });

      nock(API_BASE_URL)
        .patch(`/deployments/${deployment.id.toString()}`)
        .reply(200, {
          ...deployment,
          id: deployment.id.toString(),
          tags: [
            ...deployment.tags,
            {
              name: 'environment',
              value: 'production'
            },
            {
              name: 'project',
              value: 'hovcli'
            },
          ],
          environment: [...(deployment.environment || []), {
            name: 'PORT',
            value: '80'
          }],
          status: DeploymentStatus.Updating,
        }
      );

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'deployment',
        'update',
        deployment.id.toString(),
        '--tag',
        'environment=production',
        '--tag',
        'project=hovcli',
        '--env',
        'PORT=80'
      ]);

      const outputs = spy.mock.calls[0][0].split('\n');

      expect(outputs[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
      expect(outputs[1]).toContain(DeploymentStatus.Updating);
      expect(outputs[1]).toContain(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string);
    });
  });
});