/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-undef */
import crypto from 'crypto';
import Loki, { LokiMemoryAdapter } from 'lokijs';
import { expect } from 'chai';
import delay from '@highoutput/delay';
import { Event } from '@arque/types';
import {
  Projection,
  BaseProjection,
  ProjectionEventHandler,
} from '../src';
import { EVENT_STORE_METADATA_KEY, PROJECTION_STORE_METADATA_KEY } from '../src/lib/util/metadata-keys';

@Projection({ id: 'Balance' })
class BalanceProjection extends BaseProjection {
  private readonly loki = new Loki(
    'BalanceProjection',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly model = this
    .loki
    .addCollection<{ id: string; value: number }>('documents');

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Credited' })
  onCredited(event: Event<{ amount: number }>) {
    const id = event.aggregate.id.toString('hex');

    let document = this.model.findOne({ id });

    if (!document) {
      document = this.model.insertOne({ id, value: 0 })!;
    }

    document.value += event.body.amount;

    this.model.update(document);
  }

  @ProjectionEventHandler({ aggregate: { type: 'Balance' }, type: 'Debited' })
  onDebited(event: Event<{ amount: number }>) {
    const id = event.aggregate.id.toString('hex');

    const document = this.model.findOne({ id })!;

    document.value -= event.body.amount;

    this.model.update(document);
  }
}

describe('Projection', () => {
  before(function () {
    this.aggregate = {
      id: crypto.randomBytes(16),
      type: 'Balance',
    };

    this.eventStore = Reflect.getMetadata(EVENT_STORE_METADATA_KEY, BalanceProjection.prototype);
    this.projectionStore = Reflect.getMetadata(PROJECTION_STORE_METADATA_KEY, BalanceProjection.prototype);
  });

  afterEach(function () {
    this.eventStore.database.collection.clear();
    this.projectionStore.collection.clear();
  });

  it('should update the read model correctly', async function () {
    await this.eventStore.createEvent({
      aggregate: {
        ...this.aggregate,
        version: 1,
      },
      type: 'Credited',
      version: 1,
      body: { amount: 100 },
    }).save();

    await this.eventStore.createEvent({
      aggregate: {
        ...this.aggregate,
        version: 2,
      },
      type: 'Debited',
      version: 1,
      body: { amount: 25 },
    }).save();

    const projection = new BalanceProjection();
    await projection.start();

    await this.eventStore.createEvent({
      aggregate: {
        ...this.aggregate,
        version: 3,
      },
      type: 'Credited',
      version: 1,
      body: { amount: 50 },
    }).save();

    await delay(100);

    const document = projection.model.findOne({ id: this.aggregate.id.toString('hex') })!;

    expect(document.value).to.equal(125);
  });
});
