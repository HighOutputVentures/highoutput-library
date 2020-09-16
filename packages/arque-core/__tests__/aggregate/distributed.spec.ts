import crypto from 'crypto';
import mongoose from 'mongoose';
import { Event } from '@arque/types';
import {
  Aggregate,
  AggregateEventHandler,
  BaseAggregate,
  DistributedEventStore,
  MongoDBSnapshotStore,
  LocalConnection,
  DistributedEventStoreServer,
  MongoDBEventStoreDatabase,
} from '../../src';
import { expect } from '../helpers';
import {
  SNAPSHOT_STORE_METADATA_KEY,
} from '../../src/lib/util/metadata-keys';

const connection = new LocalConnection();

@Aggregate({
  type: 'Balance',
  initialState: 0,
  eventStore: new DistributedEventStore({
    connection,
  }),
  snapshotStore: new MongoDBSnapshotStore(mongoose.createConnection('mongodb://localhost/test')),
})
class BalanceAggregate extends BaseAggregate<number> {
  @AggregateEventHandler({ type: 'Credited' })
  onCredited(state: number, event: Event<{ delta: number }>) {
    return state + event.body.delta;
  }

  @AggregateEventHandler({ type: 'Debited' })
  onDebited(state: number, event: Event<{ delta: number }>) {
    const result = state - event.body.delta;

    if (result < 0) {
      throw new Error('Cannot be negative.');
    }

    return result;
  }
}

describe('Aggregate', () => {
  before(async function () {
    this.eventStoreServer = new DistributedEventStoreServer({
      connection,
      database: new MongoDBEventStoreDatabase(mongoose.createConnection('mongodb://localhost/test')),
    });

    await this.eventStoreServer.start();

    this.snapshotStore = Reflect.getMetadata(SNAPSHOT_STORE_METADATA_KEY, BalanceAggregate.prototype);
  });

  after(async function () {
    await this.eventStoreServer.stop();
  });

  describe('#createEvent', () => {
    it('should create event', async function () {
      const aggregate = await BalanceAggregate.load(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          delta: 100,
        },
      });

      const event = await this.eventStoreServer.database.model.findOne({
        'aggregate.type': 'Balance',
      });
      expect(event).to.has.property('type', 'Credited');
      expect(event).to.has.property('body').that.deep.equals({ delta: 100 });
    });

    it('should update the state correctly', async () => {
      const aggregate = await BalanceAggregate.load(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          delta: 100,
        },
      });

      await aggregate.createEvent({
        type: 'Debited',
        body: {
          delta: 25,
        },
      });

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          delta: 5,
        },
      });

      expect(aggregate.state).to.equal(80);
    });

    it('should protect the business invariant', async () => {
      const aggregate = await BalanceAggregate.load(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          delta: 100,
        },
      });

      await expect(
        aggregate.createEvent({
          type: 'Debited',
          body: {
            delta: 125,
          },
        }),
      ).to.eventually.be.rejectedWith('Cannot be negative.');
    });
  });
});
