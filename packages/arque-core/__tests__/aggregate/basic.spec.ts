import crypto from 'crypto';
import { Event } from '@arque/types';
import {
  AggregateEventHandler,
  AggregateClass,
  Aggregate,
} from '../../src';
import { expect, generateFakeEvent } from '../helpers';
import getEventStore from '../../src/lib/util/get-event-store';
import getSnapshotStore from '../../src/lib/util/get-snapshot-store';

@AggregateClass({ initialState: 0 })
class BalanceAggregate extends Aggregate<number> {
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
    this.eventStore = getEventStore();
    this.snapshotStore = getSnapshotStore();
  });

  afterEach(function () {
    this.eventStore.database.collection.clear();
    this.snapshotStore.collection.clear();
  });

  describe('load', () => {
    it('should load an aggregate correctly', async function () {
      let event = generateFakeEvent();

      event = {
        ...event,
        type: 'Credited',
        aggregate: {
          ...event.aggregate,
          type: 'Balance',
        },
        body: { delta: 100 },
      };

      await this.eventStore.database.saveEvent(event);

      const aggregate = await BalanceAggregate.load(event.aggregate.id);
      expect(aggregate.state).to.equal(100);
      expect(aggregate.version).to.equal(1);
    });
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

      const event = this.eventStore.database.collection.findOne({
        'aggregate.type': aggregate.type,
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
