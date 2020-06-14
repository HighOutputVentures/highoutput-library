import Loki, { LokiMemoryAdapter } from 'lokijs';
import { EventStore, Event } from '../types';
import generateEventId from '../util/generate-event-id';

type SerializedEvent = Omit<Event, 'id' | 'aggregate'> &
  {
    id: string;
    aggregate: {
      id: string;
      type: string;
      version: number;
    };
  };

export function serializeEvent(snapshot: Snapshot): SerializedEvent {
  return {
    ...R.pick(['state', 'timestamp'], snapshot),
    id: snapshot.id.toString('base64'),
    aggregate: {
      ...snapshot.aggregate,
      id: snapshot.aggregate.id.toString('base64'),
    },
  };
}

export function deserializeSnapshot(snapshot: SerializedSnapshot): Snapshot {
  return {
    ...R.pick(['state', 'timestamp'], snapshot),
    id: Buffer.from(snapshot.id, 'base64'),
    aggregate: {
      ...snapshot.aggregate,
      id: Buffer.from(snapshot.aggregate.id, 'base64'),
    },
  };
}

export default class MemoryEventStore implements EventStore {
  private readonly loki = new Loki(
    'EventStore',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly collection = this
    .loki
    .addCollection<SerializedEvent>('events');

  async createEvent(params: Omit<Event, 'id' | 'timestamp'>) {
    const { id, timestamp } = generateEventId();

    const event = {
      ...params,
      id,
      timestamp,
    };

    return event;
  }
}
