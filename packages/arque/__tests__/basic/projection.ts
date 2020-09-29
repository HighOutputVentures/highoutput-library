/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Event } from '@arque/types';
import {
  Projection,
  ProjectionEventHandler,
} from '@arque/core';
import BalanceModel from './model';

export default class BalanceProjection extends Projection {
  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Credited' })
  onCredited(event: Event<{ delta: number }>) {
    const id = event.aggregate.id.toString('hex');

    let document = BalanceModel.findOne({ id });

    if (!document) {
      document = BalanceModel.insertOne({ id, value: 0 })!;
    }

    document.value += event.body.delta;

    BalanceModel.update(document);
  }

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Debited' })
  onDebited(event: Event<{ delta: number }>) {
    const id = event.aggregate.id.toString('hex');

    const document = BalanceModel.findOne({ id });

    if (!document) {
      return;
    }

    document.value -= event.body.delta;

    BalanceModel.update(document);
  }
}
