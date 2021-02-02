import R from 'ramda';
import crypto from 'crypto';
import { Event } from '@arque/types';
import {
  AggregateEventHandler,
  EventUpcaster,
  AggregateClass,
  Aggregate,
  DistributedEventStore,
  DistributedEventStoreServer,
} from '../../src';
import { expect, generateFakeEvent } from '../helpers';
import getSnapshotStore from '../../src/lib/util/get-snapshot-store';

@AggregateClass({
  initialState: 0,
  eventStore: new DistributedEventStore(),
  eventUpcasters: [
    {
      filter: { type: 'Credited', version: 1, },
      upcaster: (event: any) => ({
        ...event,
        body: {
          ...R.omit(['delta'])(event.body),
          figure: event.body.delta,
        },
      }),
    },
    {
      filter: { type: 'Debited', version: 1, },
      upcaster: (event: any) => ({
        ...event,
        body: {
          ...R.omit(['delta'])(event.body),
          figure: event.body.delta,
        },
      }),
    }
  ]
})
class BalanceAggregate extends Aggregate<number> {
  @EventUpcaster({ type: 'Credited', version: 1 })
  onCreditedV1(event: Event<{ delta: number }>) {
    return {
      ...event,
      body: {
        ...R.omit(['figure'])(event.body),
        figure: event.body.delta,
      }
    }
  }

  @AggregateEventHandler({ type: 'Credited' })
  onCredited(state: number, event: Event<{ delta: number; figure: number }>) {
    return state + event.body.figure;
  }

  
  @AggregateEventHandler({ type: 'Debited' })
  onDebited(state: number, event: Event<{ delta: number; figure: number }>) {
    const result = state - event.body.figure;

    if (result < 0) {
      throw new Error('Cannot be negative.');
    }

    return result;
  }
}

describe('Aggregate Event Upcasting', () => {
  before(async function () {
    this.eventStore = new DistributedEventStoreServer();

    await this.eventStore.start();

    this.snapshotStore = getSnapshotStore();
  });

  after(async function () {
    await this.eventStore.stop();
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

      const event = await this.eventStore.database.collection.findOne({
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
