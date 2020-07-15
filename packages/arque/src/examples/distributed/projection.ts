/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from 'mongoose';
import {
  BaseProjection, ProjectionEventHandler, Event, Projection,
} from '../..';
import BalanceModel from './model';
import { MongoDBProjectionStore } from '../../lib/projection-store';
import { eventStore } from './common';

@Projection({
  id: 'Balance',
  eventStore,
  projectionStore: new MongoDBProjectionStore(mongoose.createConnection('mongodb://localhost/arque')),
})
export default class BalanceProjection extends BaseProjection {
  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Credited' })
  async onCredited(event: Event<{ delta: number }>) {
    const document = await BalanceModel.findOne({ _id: event.aggregate.id });

    if (!document) {
      await BalanceModel.create({ _id: event.aggregate.id, value: event.body.delta });
    }

    await document?.update({
      $inc: { value: event.body.delta },
    });
  }

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Debited' })
  async onDebited(event: Event<{ delta: number }>) {
    await BalanceModel.updateOne({ _id: event.aggregate.id }, { $inc: { value: -event.body.delta } });
  }
}
