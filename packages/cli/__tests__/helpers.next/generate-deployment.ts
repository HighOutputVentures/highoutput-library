import faker from '@faker-js/faker';
import R from 'ramda';
import { Deployment, DeploymentStatus, ObjectID } from '@highoutputventures/hovcli/types';
import sample from 'lodash.sample';

export default function (): Deployment {
  return {
    id: new ObjectID(),
    tags: [
      {
        name: 'name',
        value: faker.word.noun().substring(0, 16),
      },
      ...R.times(() => (
        {
          name: faker.word.noun().toLowerCase(),
          value: faker.word.noun(),
        }
      ), 2)
    ],
    repository: faker.internet.url(),
    status: sample([
      DeploymentStatus.Creating,
      DeploymentStatus.Deleting,
      DeploymentStatus.Updating,
      DeploymentStatus.Running,
      DeploymentStatus.Failed,
    ]) as DeploymentStatus,
    environment: R.times(() => (
      {
        name: faker.word.noun().toUpperCase(),
        value: faker.word.noun().substring(0, 16),
      }
    ), 5),
    directory: `./${faker.word.noun()}`,
    url: faker.internet.url(),
    dateTimeCreated: new Date(),
    dateTimeUpdated: new Date(),
  };
}
