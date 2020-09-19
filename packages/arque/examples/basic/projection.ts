/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Event } from '@arque/types';
import {
  BaseProjection, ProjectionEventHandler, Projection,
} from '@arque/core';
import BalanceModel from './model';

@Projection({ id: 'Balance' })
export default class BalanceProjection extends BaseProjection {
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

    const document = BalanceModel.findOne({ id })!;

    document.value -= event.body.delta;

    BalanceModel.update(document);
  }
}
