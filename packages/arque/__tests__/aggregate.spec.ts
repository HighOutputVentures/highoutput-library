import crypto from 'crypto';
import {
  Aggregate,
  AggregateEventHandler,
  BaseAggregate,
} from '../src';
import { expect } from './helpers';
import {
  ID,
  Event,
  EVENT_STORE_METADATA_KEY,
  SNAPSHOT_STORE_METADATA_KEY,
} from '../src/lib/types';

@Aggregate({ type: 'Balance' })
class BalanceAggregate extends BaseAggregate {
  constructor(id: ID) {
    super(id, 0);
  }

  @AggregateEventHandler({ type: 'Credited' })
  onCredited(state: number, event: Event<{ amount: number }>) {
    return state + event.body.amount;
  }

  @AggregateEventHandler({ type: 'Debited' })
  onDebited(state: number, event: Event<{ amount: number }>) {
    const result = state - event.body.amount;

    if (result < 0) {
      throw new Error('Cannot be negative.');
    }

    return result;
  }
}

describe.only('Aggregate', () => {
  before(function () {
    this.eventStore = Reflect.getMetadata(EVENT_STORE_METADATA_KEY, BalanceAggregate.prototype);
    this.snapshotStore = Reflect.getMetadata(SNAPSHOT_STORE_METADATA_KEY, BalanceAggregate.prototype);
  });

  afterEach(function () {
    this.eventStore.database.collection.clear();
    this.snapshotStore.collection.clear();
  });

  describe('#createEvent', () => {
    it('should create event', async function () {
      const aggregate = new BalanceAggregate(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100,
        },
      });

      const event = this.eventStore.database.collection.findOne({
        'aggregate.type': 'Balance',
      });
      expect(event).to.has.property('type', 'Credited');
      expect(event).to.has.property('body').that.deep.equals({ amount: 100 });
    });

    it('should update the state correctly', async () => {
      const aggregate = new BalanceAggregate(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100,
        },
      });

      await aggregate.createEvent({
        type: 'Debited',
        body: {
          amount: 25,
        },
      });

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 5,
        },
      });

      expect(aggregate.state).to.equal(80);
    });

    it('should protect the business invariant', async () => {
      const aggregate = new BalanceAggregate(crypto.randomBytes(16));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100,
        },
      });

      await expect(
        aggregate.createEvent({
          type: 'Debited',
          body: {
            amount: 125,
          },
        }),
      ).to.eventually.be.rejectedWith('Cannot be negative.');
    });
  });
});
