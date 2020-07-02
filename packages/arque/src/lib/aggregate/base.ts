/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import Queue from 'p-queue';
import R from 'ramda';
import {
  ID,
  Event,
  EventStore,
  SnapshotStore,
  AGGREGATE_TYPE_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  SNAPSHOT_STORE_METADATA_KEY,
  AGGREGATE_EVENT_HANDLERS_METADATA_KEY,
} from '../types';

export default abstract class BaseAggregate<TState = any, TEvent extends Event = Event> {
  private queue: Queue = new Queue({ concurrency: 1 });

  private _version = 0;

  private _state: TState;

  private _id: ID;

  public readonly options = {
    batchSize: 100,
  }

  protected constructor(
    id: ID,
    state: TState,
  ) {
    this._id = id;
    this._state = Object.freeze(state);
  }

  get type(): string {
    return Reflect.getMetadata(AGGREGATE_TYPE_METADATA_KEY, this);
  }

  get eventStore(): EventStore {
    return Reflect.getMetadata(EVENT_STORE_METADATA_KEY, this);
  }

  get snapshotStore(): SnapshotStore {
    return Reflect.getMetadata(SNAPSHOT_STORE_METADATA_KEY, this);
  }

  protected get shouldTakeSnapshot() {
    return false;
  }

  get state(): Readonly<TState> {
    return this._state;
  }

  get id() {
    return this._id;
  }

  get version() {
    return this._version;
  }

  private apply(state: TState, event: Event): TState {
    let next = R.clone(state);

    for (const { filter, handler } of Reflect.getMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, this)) {
      if (R.equals(filter, R.pick(R.keys(filter) as any, event))) {
        next = handler(state, event);
      }
    }

    return next;
  }

  public async fold() {
    let { state } = this;
    let { version } = this;

    let events: TEvent[];
    do {
      events = (await this.eventStore.retrieveAggregateEvents({
        aggregate: this.id,
        first: this.options.batchSize,
        after: version,
      })) as TEvent[];

      for (const event of events) {
        state = this.apply(state, event);

        version = event.aggregate.version;
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

      const event = await this.eventStore.createEvent({
        ...params,
        version: params.version || 1,
        aggregate: {
          id: this.id,
          version: this.version + 1,
          type: this.type,
        },
      });

      const state = this.apply(this.state, event);

      await event.save();

      this._version = event.aggregate.version;
      this._state = Object.freeze(state);

      if (this.shouldTakeSnapshot) {
        this.snapshotStore.createSnapshot({
          aggregate: {
            id: this.id,
            type: this.type,
            version: this.version,
          },
          state,
        }).save();
      }
    });
  }
}
