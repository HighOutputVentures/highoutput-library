import crypto from 'crypto';
import {
  Aggregate,
  BaseAggregate,
  AggregateEventHandler,
  EventStoreClient,
  MemoryEventStoreDatabaseAdapter,
  EventStoreServer,
} from '../src';
import { expect } from './helpers';
import { ID, Event } from '../src/lib/types';

@Aggregate({
  type: 'Balance',
  eventStore: new EventStoreClient(),
})
class BalanceAggregate extends BaseAggregate {
  constructor(id: ID) {
    super(id, new EventStoreClient(), 0);
  }

  @AggregateEventHandler({ type: 'Credited' })
  onCredited(state: number, event: Event) {
    return state + event.body.amount;
  }

  @AggregateEventHandler({ type: 'Debited' })
  onDebited(state: number, event: Event) {
    const result = state - event.body.amount;

    if (result < 0) {
      throw new Error('Cannot be less than 0.');
    }

    return result;
  }

  get type() {
    return 'Balance';
  }
}

describe.only('Aggregate', () => {
  before(async function() {
    this.database = new MemoryEventStoreDatabaseAdapter();
    this.server = new EventStoreServer({ database: this.database });
    await this.server.start();
  });

  afterEach(async function() {
    this.database.EventCollection.clear();
    this.database.SnapshotCollection.clear();
  });

  after(async function () {
    await this.server.stop();
  });

  describe('#createEvent', () => {
    it('should create event', async function () {
      const aggregate = new BalanceAggregate(crypto.randomBytes(12));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100
        },
      });

      const event = this.database.EventCollection.findOne({ aggregateType: 'Balance' });
      expect(event).to.has.property('type', 'Credited');
      expect(event).to.has.property('body').that.deep.equals({ amount: 100 });
    });

    it('should update the state correctly', async function () {
      const aggregate = new BalanceAggregate(crypto.randomBytes(12));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100
        },
      });

      await aggregate.createEvent({
        type: 'Debited',
        body: {
          amount: 25
        },
      });

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 5
        },
      });

      expect(aggregate.state).to.equal(80);
    });

    it('should protect the business invariant', async function () {
      const aggregate = new BalanceAggregate(crypto.randomBytes(12));

      await aggregate.createEvent({
        type: 'Credited',
        body: {
          amount: 100
        },
      });

      await expect(aggregate.createEvent({
        type: 'Debited',
        body: {
          amount: 125
        },
      })).to.eventually.be.rejectedWith('Cannot be less than 0.');
    });
  });
});
