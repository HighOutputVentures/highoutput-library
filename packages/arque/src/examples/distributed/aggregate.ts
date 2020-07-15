import mongoose from 'mongoose';
import {
  Aggregate,
  AggregateEventHandler,
  BaseAggregate,
  ID,
  Event,
} from '../..';
import { MongoDBSnapshotStore } from '../../lib/snapshot-store';
import { eventStore } from './common';

@Aggregate({
  type: 'Balance',
  initialState: 0,
  snapshotStore: new MongoDBSnapshotStore(mongoose.createConnection('mongodb://localhost/arque')),
  eventStore,
})
export default class BalanceAggregate extends BaseAggregate {
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

  static async credit(id: ID, delta: number) {
    const aggregate = await this.load(id);

    await aggregate.createEvent({
      type: 'Credited',
      body: { delta },
    });
  }

  static async debit(id: ID, delta: number) {
    const aggregate = await this.load(id);

    await aggregate.createEvent({
      type: 'Debited',
      body: { delta },
    });
  }
}
