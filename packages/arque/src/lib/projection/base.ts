/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Queue from 'p-queue';
import R from 'ramda';
import {
  Event,
  PROJECTION_STORE_METADATA_KEY,
  ProjectionStore,
  PROJECTION_ID_METADATA_KEY,
  EventStore,
  EVENT_STORE_METADATA_KEY,
  PROJECTION_EVENT_HANDLERS_METADATA_KEY,
  EventFilter,
} from '../types';

export default abstract class <TEvent extends Event = Event> {
  private startPromise: Promise<void> | null = null;

  private readonly queue = new Queue({ concurrency: 1, autoStart: false });

  private readonly options: {
    batchSize: number;
  }

  public constructor(options: {
    batchSize?: number;
  } = {}) {
    this.options = R.mergeDeepLeft({
      batchSize: 100,
    }, options);
  }

  private async apply(event: Event) {
    // for (const [key, filter] of R.toPairs(Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, this))) {
    //   if (R.equals(filter, R.pick(R.keys(filter), event))) {
    //     await this[key](event);
    //   }
    // }
  }

  public async start() {
    if (!this.startPromise) {
      this.startPromise = (async () => {
        const projectionStore: ProjectionStore = Reflect.getMetadata(PROJECTION_STORE_METADATA_KEY, this);
        const eventStore: EventStore = Reflect.getMetadata(EVENT_STORE_METADATA_KEY, this);
        const id: string = Reflect.getMetadata(PROJECTION_ID_METADATA_KEY, this);

        const projection = await projectionStore.findById(id);

        let after = projection?.lastEvent;
        const first = this.options.batchSize;

        const filters = R.compose<Record<string, EventFilter>, EventFilter[], EventFilter[]>(
          R.uniq,
          R.values,
        )(Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, this));

        while (true) {
          const events = await eventStore.retrieveEvents({
            filters,
            after,
            first,
          });

          for (const event of events) {
            await this.apply(event);

            after = event.id;
          }

          if (events.length < first) {
            break;
          }
        }
      })();
    }

    await this.startPromise;
  }
}
