import LRUCache from 'lru-cache';
import {
  EventStore, Event, ID, Connection, ConnectionSubscriber, ConnectionPublisher,
} from '../types';
import generateEventId from '../util/generate-event-id';
import MemoryEventStoreDatabase from './database/memory';
import getConnection from '../util/get-connection';

export default class MemoryEventStore implements EventStore {
  public readonly database = new MemoryEventStoreDatabase();

  private connection: Connection;

  private subscribers: ConnectionSubscriber[] = [];

  private cache = new LRUCache({
    dispose: async (key, promise: Promise<ConnectionPublisher>) => {
      const publisher = await promise;

      await publisher.stop();
    },
  });

  constructor(connection?: Connection) {
    this.connection = connection || getConnection();
  }

  private async publish(event: Event) {
    const topic = `${event.aggregate.type}.${event.type}.${event.version}`;

    let promise = this.cache.get(topic);

    if (!promise) {
      promise = this.connection.createPublisher(topic);
      this.cache.set(topic, promise);
    }

    const publisher = await promise;
    await publisher(event);
  }

  public createEvent(params: Omit<Event, 'id' | 'timestamp'>) {
    if (params.aggregate.id.length !== 16) {
      throw new Error('Aggregate id must be 16 bytes long.');
    }

    const { id, timestamp } = generateEventId();

    const event = {
      ...params,
      id,
      timestamp,
    };

    return {
      ...event,
      save: async () => {
        await this.database.saveEvent(event);
        await this.publish(event);

        return event;
      },
    };
  }

  public async retrieveAggregateEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]> {
    return this.database.retrieveAggregateEvents(params);
  }

  public async retrieveEvents(params: {
    first?: number;
    after?: ID;
    filters: {
      aggregate?: {
        id?: ID;
        type?: string;
      };
      version?: number;
      type?: string;
    }[];
  }): Promise<Event[]> {
    return this.database.retrieveEvents(params);
  }

  public async subscribe(
    params: {
      aggregate?: {
        type?: string;
      };
      type?: string;
      version?: number;
    },
    handler: (event: Event) => Promise<void>,
    options?: { queue?: string; concurrency?: number },
  ) {
    const topic = `${params.aggregate?.type || '*'}.${params.type || '*'}.${params.version || '*'}`;

    const subscriber = await this.connection.createSubscriber(
      topic,
      handler,
      options,
    );

    this.subscribers.push(subscriber);
  }
}
