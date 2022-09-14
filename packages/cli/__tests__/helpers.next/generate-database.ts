import faker from '@faker-js/faker';
import { DatabaseStatus, ObjectID, DatabaseType } from '../../src/types';

export default function () {
  return {
    id: new ObjectID(),
    tags: [
      {
        name: 'name',
        value: faker.word.noun().substring(0, 16),
      },
    ],
    uri: faker.internet.url(),
    type: DatabaseType.MongoDb,
    status: DatabaseStatus.Creating,
    dateTimeCreated: new Date(),
    dateTimeUpdated: new Date(),
  };
}