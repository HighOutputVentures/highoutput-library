import delay from '@highoutput/delay';
import { expect } from 'chai';
import crypto from 'crypto';
import {
  EventStoreClient,
  EventStoreServer,
  MemoryEventStoreDatabaseAdapter,
} from '../src';
import { chance } from './helpers';
import { generateId } from '../src/lib/util';

describe('EventStore', () => {
  beforeEach(async function () {
    this.client = new EventStoreClient();
    this.database = new MemoryEventStoreDatabaseAdapter();
    this.server = new EventStoreServer({ database: this.database });
  });

  it('should wait for server to become available', async function () {
    delay(2000).then(() => this.server.start());

    const timestamp = Date.now();
    await this.client.initialized;
    expect(Date.now() - timestamp).to.be.greaterThan(2000);
  });

  describe('server is started', () => {
    beforeEach(async function () {
      await this.server.start();
    });

    it('should generate and save event', async function () {
      const event = this.client.generateEvent({
        type: 'Created',
        aggregateId: crypto.randomBytes(12),
        aggregateType: 'Account',
        aggregateVersion: 1,
        body: {
          username: chance.first().toLowerCase(),
        },
        version: 1,
      });

      await this.client.saveEvent(event);

      expect(
        this.database.EventCollection.count({ aggregateType: 'Account' }),
      ).to.equal(1);
    });

    it('should create snapshot', async function () {
      await this.client.createSnapshot({
        aggregateId: crypto.randomBytes(12),
        aggregateType: 'Account',
        aggregateVersion: 5,
        state: {
          username: chance.first().toLowerCase(),
          realName: chance.name(),
        },
      });

      expect(
        this.database.SnapshotCollection.count({ aggregateType: 'Account' }),
      ).to.equal(1);
    });

    it('should create snapshot', async function () {
      await this.client.createSnapshot({
        aggregateId: crypto.randomBytes(12),
        aggregateType: 'Account',
        aggregateVersion: 5,
        state: {
          username: chance.first().toLowerCase(),
          realName: chance.name(),
        },
      });

      expect(
        this.database.SnapshotCollection.count({ aggregateType: 'Account' }),
      ).to.equal(1);
    });

    it('should retrieve events', async function () {
      const aggregateId = crypto.randomBytes(12);
      const aggregateType = 'Account';

      this.database.saveEvent({
        id: generateId(),
        type: 'Created',
        aggregateId,
        aggregateType,
        aggregateVersion: 1,
        body: {
          username: chance.first().toLowerCase(),
        },
        version: 1,
        timestamp: new Date(),
      });

      this.database.saveEvent({
        id: generateId(),
        type: 'Updated',
        aggregateId,
        aggregateType,
        aggregateVersion: 2,
        body: {
          realName: chance.name(),
        },
        version: 1,
        timestamp: new Date(),
      });

      const events = await this.client.retrieveEvents({
        aggregate: aggregateId,
      });

      expect(events).to.has.length(2);
    });
  });

  afterEach(async function () {
    await this.server.stop();
    await this.client.stop();
  });
});
