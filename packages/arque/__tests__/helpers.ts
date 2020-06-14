import Chance from 'chance';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import crypto from 'crypto';
import generateId from '../src/lib/util/generate-id';
import generateEventId from '../src/lib/util/generate-event-id';

chai.use(chaiAsPromised);

export const chance = new Chance();

export { expect };

export function generateFakeEvent() {
  const { id, timestamp } = generateEventId();

  return {
    id,
    type: 'Created',
    body: {
      username: chance.first().toLowerCase(),
    },
    aggregate: {
      id: crypto.randomBytes(16),
      type: 'Account',
      version: 1,
    },
    version: 1,
    timestamp,
  };
}

export function generateFakeSnapshot() {
  const timestamp = new Date();
  const aggregate = crypto.randomBytes(16);

  return {
    id: generateId(timestamp),
    aggregateId: crypto.randomBytes(12),
    aggregateType: 'Account',
    aggregateVersion: 1,
    state: {
      username: chance.first().toLowerCase(),
    },
    timestamp,
  };
}
