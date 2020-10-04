import mongoose from 'mongoose';
import {
  ID,
  Event,
} from '@arque/types';
import {
  Aggregate,
  AggregateClass,
  AggregateEventHandler,
  MongoDBSnapshotStore,
} from '@arque/core';
import { eventStore } from './library';

export type BalanceCreditedEvent = Event<{ delta: number }, 'Credited', 'Balance'>;
export type BalanceDebitedEvent = Event<{ delta: number }, 'Debited', 'Balance'>;

@AggregateClass({
  type: 'Balance',
  initialState: 0,
  snapshotStore: new MongoDBSnapshotStore(mongoose.createConnection('mongodb://localhost/arque')),
  eventStore,
})
export default class BalanceAggregate extends Aggregate<number> {
  @AggregateEventHandler({ type: 'Credited' })
  onCredited(state: number, event: BalanceCreditedEvent) {
    return state + event.body.delta;
  }

  @AggregateEventHandler({ type: 'Debited' })
  onDebited(state: number, event: BalanceDebitedEvent) {
    const result = state - event.body.delta;

    if (result < 0) {
      throw new Error('Cannot be negative.');
    }

    return result;
  }

  static async credit(id: ID, delta: number) {
    const aggregate = await this.load(id);

    await aggregate.createEvent<BalanceCreditedEvent>({
      type: 'Credited',
      body: { delta },
    });
  }

  static async debit(id: ID, delta: number) {
    const aggregate = await this.load(id);

    await aggregate.createEvent<BalanceDebitedEvent>({
      type: 'Debited',
      body: { delta },
    });
  }
}
