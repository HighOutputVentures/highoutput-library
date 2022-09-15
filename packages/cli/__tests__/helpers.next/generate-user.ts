import { ObjectID, User } from '../../src/types';
import faker from '@faker-js/faker';
import { suid } from 'rand-token';

export function generateUser(): User {
  return {
    id: new ObjectID(),
    name: faker.name.firstName(),
    apiToken: suid(16),
    dateTimeCreated: new Date(),
    dateTimeUpdated: new Date(),
  };
}
