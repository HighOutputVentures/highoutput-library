import delay from '@highoutput/delay';
import { expect } from 'chai';
import crypto from 'crypto';
import { Context as MochaContext } from 'mocha';
import {
  EventStoreClient,
  EventStoreServer,
  MemoryEventStoreDatabaseAdapter,
} from '../src';
import { chance } from './helpers';

type Context = MochaContext & {
  client: EventStoreClient;
  database: MemoryEventStoreDatabaseAdapter;
  server: EventStoreServer;
};

describe('EventStore', () => {
  beforeEach(async function () {
    this.client = new EventStoreClient();
    this.database = new MemoryEventStoreDatabaseAdapter();
    this.server = new EventStoreServer({ database: this.database });
  });

  it('should wait for server to become available', async function (this: Context) {
    delay(2000).then(() => this.server.start());

    const timestamp = Date.now();
    await this.client.initialized;
    expect(Date.now() - timestamp).to.be.greaterThan(2000);
  });

  describe('server is started', () => {
    beforeEach(async function () {
      await this.server.start();
    });

    it('should create event', async function (this: Context) {
      await this.client.createEvent({
        type: 'Created',
        aggregateId: crypto.randomBytes(12),
        aggregateType: 'Account',
        aggregateVersion: 1,
        body: {
          username: chance.first().toLowerCase(),
        },
        version: 1
      });
  
      expect(this.database.EventCollection.count({ aggregateType: 'Account' })).to.equal(1);
    });

    it('should create snapshot', async function (this: Context) {
      await this.client.createSnapshot({
        aggregateId: crypto.randomBytes(12),
        aggregateType: 'Account',
        aggregateVersion: 5,
        state: {
          username: chance.first().toLowerCase(),
          realName: chance.name(),
        },
      });
  
      expect(this.database.SnapshotCollection.count({ aggregateType: 'Account' })).to.equal(1);
    });
  });

  afterEach(async function () {
    await this.server.stop();
    await this.client.stop();
  });
});
