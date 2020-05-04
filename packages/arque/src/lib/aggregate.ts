import Queue from 'p-queue';
import R from 'ramda';
import { ID, Event } from './types';
import EventStoreClient from '../lib/event-store/client';

export default abstract class<TState = any, TEvent extends Event = Event> {
  private queue: Queue = new Queue({ concurrency: 1 });

  private _version: number = 0;

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
    }
  ) {
    this._id = id;
    this._state = Object.freeze(state);
    this.options = {
      batchSize: options?.batchSize || 100,
    };
  }

  abstract type: string;

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

  private apply(state: TState, _event: Event): TState {
    return state;
  }

  public async fold() {
    let state = this.state;
    let version = this.version;

    let events: TEvent[];
    do {
      events = (await this.eventStore.retrieveEvents({
        first: this.options.batchSize,
        after: version,
        aggregate: this.id,
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
    type: TEvent['type'],
    body: TEvent['body'],
    version?: number,
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
