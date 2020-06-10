/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import Queue from 'p-queue';
import R from 'ramda';
import { ID, Event } from '../types';
import EventStoreClient from '../event-store/client';

// type AggregateEventHandler<TState, TEvent> = {
//   filter: { type?: string; version?: number; };
//   handler: (state: TState, event: TEvent) => TState;
// }

export default abstract class Aggregate<TState = any, TEvent extends Event = Event> {
  private queue: Queue = new Queue({ concurrency: 1 });

  private _version = 0;

  private _state: TState;

  private _id: ID;

  private options: {
    batchSize: number;
  };

  protected constructor(
    id: ID,
    private readonly eventStore: EventStoreClient,
    state: TState,
    options?: {
      batchSize?: number;
    },
  ) {
    this._id = id;
    this._state = Object.freeze(state);
    this.options = {
      batchSize: options?.batchSize || 100,
    };
  }

  protected get type(): string {
    throw new Error('Not implemented');
  }

  protected get shouldTakeSnapshot() {
    return false;
  }

  get state(): Readonly<TState> {
    return R.clone(this._state);
  }

  get id() {
    return this._id;
  }

  get version() {
    return this._version;
  }

  private apply(state: TState, event: Event): TState {
    let newState = state;

    for (const item of Reflect.getMetadataKeys(this)) {
      const filter: { type?: string; version?: number } = Reflect.getMetadata(item, this);

      if (R.equals(filter, R.pick(R.keys(filter), event))) {
        newState = this[item](state, event);
      }
    }

    return newState;
  }

  public async fold() {
    let { state } = this;
    let { version } = this;

    let events: TEvent[];
    do {
      events = (await this.eventStore.retrieveAggregateEvents({
        aggregateId: this.id,
        first: this.options.batchSize,
        after: version,
      })) as TEvent[];

      for (const event of events) {
        state = this.apply(state, event);

        version = event.aggregateVersion;
      }
    } while (events.length === this.options.batchSize);

    this._version = version;
    this._state = Object.freeze(state);
  }

  public async createEvent(params: {
    type: TEvent['type'];
    body: TEvent['body'];
    version?: number;
  }) {
    return this.queue.add(async () => {
      await this.fold();

      const event = this.eventStore.generateEvent({
        ...params,
        version: params.version || 1,
        aggregateId: this.id,
        aggregateVersion: this.version + 1,
        aggregateType: this.type,
      });

      const state = this.apply(this.state, event);

      await this.eventStore.saveEvent(event);

      this._version = event.aggregateVersion;
      this._state = Object.freeze(state);

      if (this.shouldTakeSnapshot) {
        this.eventStore.createSnapshot({
          aggregateId: this.id,
          aggregateType: this.type,
          aggregateVersion: this.version,
          state: this.state,
        });
      }
    });
  }
}
