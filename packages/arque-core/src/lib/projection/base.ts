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
} from '@arque/types';
import {
  PROJECTION_STORE_METADATA_KEY,
  PROJECTION_ID_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  PROJECTION_EVENT_HANDLERS_METADATA_KEY,
} from '../util/metadata-keys';
import canHandleEvent from '../util/can-handle-event';

export default class {
  private startPromise: Promise<void> | null = null;

  private readonly queue = new Queue({ concurrency: 1, autoStart: false });

  private readonly options: {
    batchSize: number;
  }

  private lastEvent?: ID;

  private filters: EventFilter[];

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
    )(Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, this));
  }

  private async apply(event: Event) {
    const projectionStore: ProjectionStore = Reflect.getMetadata(PROJECTION_STORE_METADATA_KEY, this);
    const id: string = Reflect.getMetadata(PROJECTION_ID_METADATA_KEY, this);

    for (const { filter, handler } of Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, this)) {
      if (canHandleEvent(filter, event)) {
        await handler.apply(this, [event]);
      }
    }

    await projectionStore.save({
      id,
      lastEvent: event.id,
    });

    this.lastEvent = event.id;
  }

  private async digest() {
    const eventStore: EventStore = Reflect.getMetadata(EVENT_STORE_METADATA_KEY, this);

    const first = this.options.batchSize;

    while (true) {
      const events = await eventStore.retrieveEvents({
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

  public async start() {
    if (!this.startPromise) {
      this.startPromise = (async () => {
        this.initializing = true;

        const projectionStore: ProjectionStore = Reflect.getMetadata(PROJECTION_STORE_METADATA_KEY, this);
        const eventStore: EventStore = Reflect.getMetadata(EVENT_STORE_METADATA_KEY, this);
        const id: string = Reflect.getMetadata(PROJECTION_ID_METADATA_KEY, this);

        await projectionStore.save({
          id,
          status: ProjectionStatus.Initializing,
        });

        const state = await projectionStore.find(id);
        if (state) {
          this.lastEvent = state.lastEvent || undefined;
        }

        await this.digest();

        await Promise.all(this.filters.map((filter) => eventStore.subscribe(
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

        await projectionStore.save({
          id,
          status: ProjectionStatus.Live,
        });
      })();
    }

    await this.startPromise;
  }
}
