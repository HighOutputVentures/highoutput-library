import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  Aggregate,
  AggregateEventHandler,
  BaseAggregate,
  DistributedEventStore,
  ActiveMQConnection,
  MongoDBSnapshotStore,
  DistributedEventStoreServer,
  MongoDBEventStoreDatabase,
} from '../../src';
import { expect } from '../helpers';
import {
  Event,
  SNAPSHOT_STORE_METADATA_KEY,
} from '../../src/lib/types';

@Aggregate({
  type: 'Balance',
  initialState: 0,
  eventStore: new DistributedEventStore({
    connection: new ActiveMQConnection(),
  }),
  snapshotStore: new MongoDBSnapshotStore(mongoose.createConnection('mongodb://localhost/test')),
})
class BalanceAggregate extends BaseAggregate {
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
  before(function () {
    this.eventStoreServer = new DistributedEventStoreServer({
      connection: new ActiveMQConnection(),
      database: new MongoDBEventStoreDatabase(mongoose.createConnection('mongodb://localhost/test')),
    });
    this.snapshotStore = Reflect.getMetadata(SNAPSHOT_STORE_METADATA_KEY, BalanceAggregate.prototype);
  });

  after(async function () {
    await this.eventStoreServer.stop();
  });

  describe.skip('#createEvent', () => {
    it('should create event', async function () {
      const aggregate = await BalanceAggregate.load(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          delta: 100,
        },
      });

      const event = this.eventStore.database.collection.findOne({
        'aggregate.type': 'Balance',
      });
      expect(event).to.has.property('type', 'Credited');
      expect(event).to.has.property('body').that.deep.equals({ delta: 100 });
    });
  });
});
