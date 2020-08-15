/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import Queue from 'p-queue';
import R from 'ramda';
import Cache from 'lru-cache';
import {
  ID,
  Event,
  EventStore,
  SnapshotStore,
} from '@arque/types';
import {
  AGGREGATE_TYPE_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  SNAPSHOT_STORE_METADATA_KEY,
  AGGREGATE_EVENT_HANDLERS_METADATA_KEY,
  AGGREGATE_INITIAL_STATE_METADATA_KEY,
  AGGREGATE_CACHE_METADATA_KEY,
} from '../util/metadata-keys';

export default class BaseAggregate<TState = any> {
  private queue: Queue = new Queue({ concurrency: 1 });

  private _version = 0;

  private _state: TState;

  private _id: ID;

  public readonly options = {
    batchSize: 100,
  }

  constructor(
    id: ID,
  ) {
    this._id = id;
    this._state = Object.freeze(Reflect.getMetadata(AGGREGATE_INITIAL_STATE_METADATA_KEY, this));
  }

  public static async load<T>(this: new (id: ID) => T, id: ID) {
    if (!(this as any).cache) {
      (this as any).cache = new Cache<string, Promise<BaseAggregate>>(
        Object.freeze(Reflect.getMetadata(AGGREGATE_CACHE_METADATA_KEY, this)),
      );
    }

    const { cache } = (this as any) as { cache: Cache<string, Promise<BaseAggregate>> };

    let promise = cache.get(id.toString('hex'));

    if (!promise) {
      promise = (async () => {
        const aggregate = new this(id) as never as BaseAggregate;

        await aggregate.restoreFromLatestSnapshot();

        return aggregate;
      })();
      cache.set(id.toString('hex'), promise);
    }

    const aggregate = await promise;
    await aggregate.fold();

    return aggregate as never as T;
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
    let next = state;

    for (const { filter, handler } of Reflect.getMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, this)) {
      if (R.equals(filter, R.pick(R.keys(filter) as any, event))) {
        next = handler(state, event);
      }
    }

    return next;
  }

  public async restoreFromLatestSnapshot() {
    const store: SnapshotStore = Reflect.getMetadata(SNAPSHOT_STORE_METADATA_KEY, this);

    await this.queue.add(async () => {
      const snapshot = await store.retrieveLatestSnapshot({
        id: this.id,
        version: this.version,
      });

      if (snapshot) {
        this._version = snapshot.aggregate.version;
        this._state = R.clone(snapshot.state);
      }
    });
  }

  public async fold() {
    await this.queue.add(async () => {
      let state = R.clone(this.state);

      let { version } = this;

      let events: Event[];
      do {
        events = (await this.eventStore.retrieveAggregateEvents({
          aggregate: this.id,
          first: this.options.batchSize,
          after: version,
        })) as Event[];

        for (const event of events) {
          state = this.apply(state, event);

          version = event.aggregate.version;
        }
      } while (events.length === this.options.batchSize);

      this._version = version;
      this._state = Object.freeze(state);
    });
  }

  public async createEvent<T extends Event = Event>(params: {
    type: T['type'];
    body: T['body'];
    version?: number;
  }) {
    await this.fold();

    await this.queue.add(async () => {
      const event = await this.eventStore.createEvent({
        ...params,
        version: params.version || 1,
        aggregate: {
          id: this.id,
          version: this.version + 1,
          type: this.type,
        },
      });

      const state = this.apply(R.clone(this.state), event);

      await event.save();

      this._version = event.aggregate.version;
      this._state = Object.freeze(state);

      if (this.shouldTakeSnapshot) {
        // create snapshot asynchronously
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
