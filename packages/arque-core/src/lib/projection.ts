/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Queue from 'p-queue';
import R from 'ramda';
import {
  Event,
  EventStore,
  ProjectionStore,
  EventFilter,
  ProjectionStatus,
  ID,
  ConnectionSubscriber,
} from '@arque/types';
import {
  PROJECTION_STORE_METADATA_KEY,
  PROJECTION_ID_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  PROJECTION_EVENT_HANDLERS_METADATA_KEY,
} from './util/metadata-keys';
import canHandleEvent from './util/can-handle-event';
import getProjectionStore from './util/get-projection-store';
import getEventStore from './util/get-event-store';

export default class {
  private startPromise: Promise<void> | null = null;

  private readonly queue = new Queue({ concurrency: 1, autoStart: false });

  private readonly options: {
    batchSize: number;
  }

  private lastEvent?: ID;

  private filters: EventFilter[];

  private subscribers: ConnectionSubscriber[] = [];

  private initializing = false;

  public constructor(options: {
    batchSize?: number;
  } = {}) {
    this.options = R.mergeDeepLeft({
      batchSize: 100,
    }, options);

    this.filters = R.compose<{ filter: EventFilter }[], EventFilter[], EventFilter[]>(
      R.uniq,
      R.pluck('filter'),
    )(Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, this) || []);
  }

  private async apply(event: Event) {
    for (const { filter, handler } of Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, this)) {
      if (canHandleEvent(filter, event)) {
        await handler.apply(this, [event]);
      }
    }

    await this.projectionStore.save({
      id: this.id,
      lastEvent: event.id,
    });

    this.lastEvent = event.id;
  }

  private async digest() {
    const first = this.options.batchSize;

    while (true) {
      const events = await this.eventStore.retrieveEvents({
        filters: this.filters,
        after: this.lastEvent,
        first,
      });

      for (const event of events) {
        await this.apply(event);
      }

      if (events.length < first) {
        break;
      }
    }
  }

  private get eventStore(): EventStore {
    return Reflect.getMetadata(EVENT_STORE_METADATA_KEY, this) || getEventStore();
  }

  private get projectionStore(): ProjectionStore {
    return Reflect.getMetadata(PROJECTION_STORE_METADATA_KEY, this) || getProjectionStore();
  }

  get id(): string {
    return Reflect.getMetadata(PROJECTION_ID_METADATA_KEY, this) || this.constructor.name;
  }

  public async start() {
    if (!this.startPromise) {
      this.startPromise = (async () => {
        this.initializing = true;

        await this.projectionStore.save({
          id: this.id,
          status: ProjectionStatus.Initializing,
        });

        const state = await this.projectionStore.find(this.id);
        if (state) {
          this.lastEvent = state.lastEvent || undefined;
        }

        await this.digest();

        this.subscribers = await Promise.all(this.filters.map((filter) => this.eventStore.subscribe(
          filter,
          async (event: Event) => {
            this.queue.add(async () => {
              if (!this.initializing) {
                await this.apply(event);
              }
            });
          },
          { concurrency: 100 },
        )));

        await this.digest();

        this.initializing = false;

        this.queue.start();

        await this.projectionStore.save({
          id: this.id,
          status: ProjectionStatus.Live,
        });
      })();
    }

    await this.startPromise;
  }

  public async stop() {
    await Promise.all(this.subscribers.map((subscriber) => subscriber.stop()));
  }
}
