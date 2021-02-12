/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Projection,
  ProjectionEventHandler,
} from '@arque/core';
import { loki } from './library';
import { BalanceCreditedEvent, BalanceDebitedEvent } from './aggregate';

export default class BalanceProjection extends Projection {
  static models = {
    Balance: loki
      .addCollection<{
        id: string;
        value: number;
      }>('balances'),
  }

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Credited' })
  onCredited(event: BalanceCreditedEvent) {
    const id = event.aggregate.id.toString('hex');

    let document = BalanceProjection.models.Balance.findOne({ id });

    if (!document) {
      document = BalanceProjection.models.Balance.insertOne({ id, value: 0 })!;
    }

    document.value += event.body.delta;

    BalanceProjection.models.Balance.update(document);
  }

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Debited' })
  onDebited(event: BalanceDebitedEvent) {
    const id = event.aggregate.id.toString('hex');

    const document = BalanceProjection.models.Balance.findOne({ id });

    if (!document) {
      return;
    }

    document.value -= event.body.delta;

    BalanceProjection.models.Balance.update(document);
  }
}
