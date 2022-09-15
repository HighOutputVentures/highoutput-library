import program from '../../src/program';
import { generateFakeDeployment } from '../helpers';
import { DeploymentStatus } from '../../src/types';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';

describe('deployment', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('inspect', () => {
    test('inspect deployment', async () => {
      const deployment = {
        ...generateFakeDeployment(),
        status: DeploymentStatus.Deleting,
      };

      nock(API_BASE_URL)
        .get(`/deployments/${deployment.id.toString()}`)
        .reply(200, () => {
          return {
            ...deployment,
            id: deployment.id.toString(),
            dateTimeCreated: deployment.dateTimeCreated.toISOString(),
            dateTimeUpdated: deployment.dateTimeUpdated.toISOString(),
          }
        });

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'deployment',
        'inspect',
        deployment.id.toString(),
      ]);

      const output = spy.mock.calls[0][0].trim();

      expect(output.includes(deployment.id.toString())).toBeTruthy();
      expect(output.includes(deployment.status)).toBeTruthy();
      expect(output.includes(deployment.url!)).toBeTruthy();
      expect(output.includes(deployment.repository)).toBeTruthy();
      expect(output.includes(deployment.directory!)).toBeTruthy();
      expect(output.includes(deployment.dockerFile!)).toBeTruthy();
      expect(output.includes(deployment.dateTimeCreated.toISOString())).toBeTruthy();
      expect(output.includes(deployment.dateTimeUpdated.toISOString())).toBeTruthy();
    });
  });
});