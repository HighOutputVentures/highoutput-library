import R from 'ramda';
import Loki, { LokiMemoryAdapter } from 'lokijs';
import AppError from '@highoutput/error';
import cleanDeep from 'clean-deep';
import {
  EventStoreDatabase, Event, ID,
} from '../../types';

type SerializedEvent = Omit<Event, 'id' | 'aggregate'> &
  {
    id: string;
    aggregate: {
      id: string;
      type: string;
      version: number;
    };
    'aggregate.id'?: string;
    'aggregate.type'?: string;
    'aggregate.version'?: number;
  };

export function serializeEvent(event: Event): SerializedEvent {
  return {
    ...R.pick(['type', 'body', 'version', 'timestamp'], event),
    id: event.id.toString('hex'),
    aggregate: {
      ...event.aggregate,
      id: event.aggregate.id.toString('hex'),
    },
  };
}

export function deserializeEvent(event: SerializedEvent): Event {
  return {
    ...R.pick(['type', 'body', 'version', 'timestamp'], event),
    id: Buffer.from(event.id, 'hex'),
    aggregate: {
      ...event.aggregate,
      id: Buffer.from(event.aggregate.id, 'hex'),
    },
  };
}

export default class implements EventStoreDatabase {
  private readonly loki = new Loki(
    'EventStore',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly collection = this
    .loki
    .addCollection<SerializedEvent>('events');

  public async saveEvent(event: Event): Promise<void> {
    if (this.collection.findOne({
      'aggregate.id': event.aggregate.id.toString('hex'),
      'aggregate.version': event.aggregate.version,
    })) {
      throw new AppError('AGGREGATE_VERSION_EXISTS', 'Aggregate version already exists.');
    }

    this.collection.insertOne(serializeEvent(event));
  }

  public async retrieveAggregateEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]> {
    let query: Record<string, any> = {
      'aggregate.id': params.aggregate.toString('hex'),
    };

    if (params.after) {
      query = {
        ...query,
        'aggregate.version': {
          $gt: params.after,
        },
      };
    }

    return this.collection
      .chain()
      .find(query)
      .sort(R.ascend(R.path(['aggregate', 'version'])))
      .limit(params.first || 1000)
      .data()
      .map(deserializeEvent);
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
    const filters = R.map((filter) => {
      if (filter.aggregate) {
        return cleanDeep({
          ...R.omit(['aggregate'], filter),
          'aggregate.id': filter.aggregate.id?.toString('hex'),
          'aggregate.type': filter.aggregate.type,
        });
      }

      return filter;
    }, params.filters);

    if (filters.length === 0) {
      return [];
    }

    let query: Record<string, any> = {};

    if (params.after) {
      query = {
        ...query,
        id: {
          $gt: params.after.toString('hex'),
        },
      };
    }

    if (R.isEmpty(query)) {
      query = {
        $or: filters,
      };
    } else {
      query = {
        $and: [
          query,
          {
            $or: filters,
          },
        ],
      };
    }

    return this.collection
      .chain()
      .find(query)
      .sort(R.ascend(R.prop('id')))
      .limit(params.first || 1000)
      .data()
      .map(deserializeEvent);
  }
}
