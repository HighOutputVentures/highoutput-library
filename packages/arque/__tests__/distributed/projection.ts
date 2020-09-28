/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Document, Schema } from 'mongoose';
import { Event } from '@arque/types';
import {
  Projection,
  ProjectionClass,
  ProjectionEventHandler,
  MongoDBProjectionStore,
} from '@arque/core';
import { database, eventStore } from './library';

@ProjectionClass({
  id: 'Balance',
  eventStore,
  projectionStore: new MongoDBProjectionStore(database),
})
export default class BalanceProjection extends Projection {
  static models = {
    BalanceModel: database.model<{
      id: Buffer;
      value: number;
    } & Document>('Balance', new Schema({
      _id: {
        type: Buffer,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    }, { _id: false })),
  };

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Credited' })
  async onCredited(event: Event<{ delta: number }>) {
    const document = await BalanceProjection.models.BalanceModel.findOne({ _id: event.aggregate.id });

    if (!document) {
      await BalanceProjection.models.BalanceModel.create({ _id: event.aggregate.id, value: event.body.delta });
      return;
    }

    await BalanceProjection.models.BalanceModel.updateOne(
      { _id: event.aggregate.id },
      { $inc: { value: event.body.delta } },
    );
  }

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Debited' })
  async onDebited(event: Event<{ delta: number }>) {
    await BalanceProjection.models.BalanceModel
      .updateOne({ _id: event.aggregate.id }, { $inc: { value: -event.body.delta } });
  }
}
