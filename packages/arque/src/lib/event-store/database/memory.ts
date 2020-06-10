import R from 'ramda';
import Loki, { LokiMemoryAdapter } from 'lokijs';
import AppError from '@highoutput/error';
import {
  EventStoreDatabase, Event, Snapshot, ID,
} from '../../types';

export default class implements EventStoreDatabase {
  private readonly loki = new Loki(
    'EventStore',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly collections = {
    Event: this
      .loki
      .addCollection<
      Omit<Event, 'id' | 'aggregateId'> &
      { id: string; aggregateId: string }
    >('events'),
    Snapshot: this
      .loki
      .addCollection<
      Omit<Snapshot, 'id' | 'aggregateId'> &
      { id: string; aggregateId: string }
    >('snapshots'),
  }

  public async saveEvent(params: Event): Promise<void> {
    if (this.collections.Event.findOne({
      aggregateId: params.aggregateId.toString('hex'),
      aggregateType: params.aggregateType,
    })) {
      throw new AppError('AGGREGATE_VERSION_EXISTS', 'Aggregate version already exists.');
    }

    this.collections.Event.insertOne({
      ...params,
      id: params.id.toString('hex'),
      aggregateId: params.aggregateId.toString('hex'),
    });
  }

  public async saveSnapshot(params: Snapshot): Promise<void> {
    this.collections.Snapshot.insertOne({
      ...params,
      id: params.id.toString('hex'),
      aggregateId: params.aggregateId.toString('hex'),
    });
  }

  public async retrieveLatestSnapshot(params: {
    aggregateId: ID;
    aggregateType: string;
  }): Promise<Snapshot | null> {
    const [result] = this.collections.Snapshot
      .chain()
      .find({
        ...params,
        aggregateId: params.aggregateId.toString('hex'),
      })
      .sort(R.descend(R.prop('aggregateVersion')))
      .limit(1)
      .data()
      .map<Snapshot>((item) => ({
        ...R.omit(['$loki', 'meta'], item),
        id: Buffer.from(item.id, 'hex'),
        aggregateId: Buffer.from(item.aggregateId, 'hex'),
      }));

    if (!result) {
      return null;
    }

    return result || null;
  }

  public async retrieveAggregateEvents(params: {
    aggregateId: ID;
    aggregateType: string;
    first?: number;
    after?: number;
  }): Promise<Event[]> {
    let query: Record<string, any> = {
      aggregateId: params.aggregateId.toString('hex'),
      aggregateType: params.aggregateType,
    };

    if (params.after) {
      query = {
        ...query,
        aggregateVersion: {
          $gt: params.after,
        },
      };
    }

    return this.collections.Event.chain()
      .find(query)
      .sort(R.ascend(R.prop('aggregateVersion')))
      .limit(params.first || 1000)
      .data()
      .map((item) => ({
        ...R.omit(['$loki', 'meta'], item),
        id: Buffer.from(item.id, 'hex'),
        aggregateId: Buffer.from(item.aggregateId, 'hex'),
      }));
  }

  public async retrieveEvents(params: {
    first?: number;
    after?: ID;
    filters: {
      aggregateType: string;
      type?: string;
    }[];
  }): Promise<Event[]> {
    if (params.filters.length === 0) {
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
        $or: params.filters,
      };
    } else {
      query = {
        $and: [
          query,
          {
            $or: params.filters,
          },
        ],
      };
    }

    return this.collections.Event.chain()
      .find(query)
      .sort(R.ascend(R.prop('id')))
      .limit(params.first || 1000)
      .data()
      .map((item) => ({
        ...R.omit(['$loki', 'meta'], item),
        id: Buffer.from(item.id, 'hex'),
        aggregateId: Buffer.from(item.aggregateId, 'hex'),
      }));
  }
}
