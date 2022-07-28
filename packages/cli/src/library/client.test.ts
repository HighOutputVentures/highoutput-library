import nock from 'nock';
import R from 'ramda';
import { DeploymentStatus, ResourceType } from '../../types';
import { createOrUpdate } from './client';
import { generateFakeDeployment } from '../../__tests__/helpers';
import { API_BASE_URL } from './contants';

describe('client', () => {
  test('createOrUpdate', async () => {
    const deployment = generateFakeDeployment();

    nock(API_BASE_URL)
      .put(`/deployments/${deployment.id.toString()}`, R.pick([
        'tags',
        'environment',
        'directory',
        'repository',
      ], deployment))
      .reply(200, {
        ...R.pick(['tags', 'repository', 'directory', 'environment', 'url'], deployment),
        status: DeploymentStatus.Creating,
        id: deployment.id.toString(),
        dateTimeCreated: deployment.dateTimeCreated.toISOString(),
        dateTimeUpdated: deployment.dateTimeUpdated.toISOString(),
      });

    const result = await createOrUpdate({
      type: ResourceType.Deployment,
      id: deployment.id,
      body: R.pick(['tags', 'repository', 'directory', 'environment'], deployment),
    });

    expect(result.id.toString()).toBe(deployment.id.toString());
  });
})