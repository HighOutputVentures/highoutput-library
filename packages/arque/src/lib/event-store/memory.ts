import { EventStore, Event, ID } from '../types';
import generateEventId from '../util/generate-event-id';
import { MemoryEventStoreDatabase } from '../..';

export default class MemoryEventStore implements EventStore {
  public readonly database = new MemoryEventStoreDatabase();

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
      save: () => this.database.saveEvent(event),
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
}
