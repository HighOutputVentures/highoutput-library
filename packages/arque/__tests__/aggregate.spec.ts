import crypto from 'crypto';
import {
  Aggregate,
  EventStoreClient,
  MemoryEventStoreDatabaseAdapter,
  EventStoreServer,
} from '../src';
import { ID } from '../src/lib/types';

class BalanceAggregate extends Aggregate {
  constructor(id: ID) {
    super(id, new EventStoreClient(), 0);
  }

  get type() {
    return 'Balance';
  }
}

describe('Aggregate', () => {
  before(async function() {
    this.database = new MemoryEventStoreDatabaseAdapter();
    this.server = new EventStoreServer({ database: this.database });
    await this.server.start();
  });

  after(async function () {
    await this.server.stop();
    await this.client.stop();
  });

  describe('#createEvent', () => {
    it.only('should create event', async () => {
      const aggregate = new BalanceAggregate(crypto.randomBytes(12));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100
        },
      });
    });
  });
});
