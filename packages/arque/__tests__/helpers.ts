import Chance from 'chance';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import crypto from 'crypto';
import generateEventId from '../src/lib/util/generate-event-id';
import generateSnapshotId from '../src/lib/util/generate-snapshot-id';
import { Event } from '../src/lib/types';

chai.use(chaiAsPromised);

export const chance = new Chance();

export { expect };

export function generateFakeEvent(): Event {
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

  const aggregate = {
    id: crypto.randomBytes(16),
    type: 'Account',
    version: 1,
  };

  return {
    id: generateSnapshotId(aggregate),
    aggregate,
    state: {
      username: chance.first().toLowerCase(),
    },
    timestamp,
  };
}
