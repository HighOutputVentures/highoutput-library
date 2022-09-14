import {
  Deployment,
  DeploymentStatus,
  ObjectID,
} from '../src/types';
import Chance from 'chance';

export const chance = new Chance();

export function generateFakeDeployment(): Deployment {
  return {
    id: new ObjectID(),
    tags: [
      {
        name: 'name',
        value: chance.word().substring(0, 16),
      },
    ],
    repository: chance.url(),
    status: chance.pickone([
      DeploymentStatus.Creating,
      DeploymentStatus.Running,
      DeploymentStatus.Deleting,
      DeploymentStatus.Failed,
    ]),
    environment: [
      {
        name: 'SERVICE_NAME',
        value: chance.word().substring(0, 16),
      },
    ],
    directory: `./${chance.word()}`,
    url: chance.url(),
    dateTimeCreated: new Date(),
    dateTimeUpdated: new Date(),
  };
}
