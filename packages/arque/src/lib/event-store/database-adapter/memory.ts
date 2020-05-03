import R from 'ramda';
import Loki, { LokiMemoryAdapter } from 'lokijs';
import { EventStoreDatabaseAdapter, Event, Snapshot, ID } from '../../types';

export default class implements EventStoreDatabaseAdapter {
  private readonly loki = new Loki(
    'EventStore',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly EventCollection = this.loki.addCollection('events');

  public readonly SnapshotCollection = this.loki.addCollection('snapshots');

  public async saveEvent(params: Event): Promise<void> {
    this.EventCollection.insertOne({
      ...params,
      id: params.id.toString('hex'),
      aggregateId: params.aggregateId.toString('hex'),
    });
  }

  public async saveSnapshot(params: Snapshot): Promise<void> {
    this.SnapshotCollection.insertOne(params);
  }

  public async retrieveLatestSnapshot(params: {
    aggregateId: string;
    aggregateType: string;
    lastAggregateVersion?: number;
  }): Promise<Snapshot | null> {
    let query: Record<string, any> = R.pick(['aggregateId', 'aggregateType'], params);

    if (!R.isNil(params.lastAggregateVersion)) {
      query = {
        ...query,
        aggregateVersion: {
          $lte: params.lastAggregateVersion,
        },
      };
    }

    const [result] = await this.SnapshotCollection.chain()
      .find(query)
      .sort(R.descend(R.prop('aggregateVersion')))
      .limit(1)
      .data();

    return result || null;
  }

  public async retrieveEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]>;
  public async retrieveEvents(params: {
    first?: number;
    after?: Buffer;
    filters: {
      aggregateType: string;
      type?: string;
    }[];
  }): Promise<Event[]>;
  public async retrieveEvents(params: Record<string, any>): Promise<Event[]> {
    let query: Record<string, any> = {};

    if (params.aggregate) {
      query = {
        aggregateId: params.aggregate.toString('hex')
      };

      if (params.after) {
        query = {
          ...query,
          aggregateVersion: {
            $gt: params.after,
          },
        };
      }
    } else {
      if (params.after) {
        query = {
          ...query,
          id: {
            $gt: params.after.toString('hex'),
          },
        };
      }

      if (params.filters && params.filters.length > 0) {
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
      }
    }

    return this.EventCollection.chain()
      .find(query)
      .sort(R.ascend(R.prop('id')))
      .limit(params.first || 1000)
      .data()
      .map(item => {
        delete item.meta;
        delete item['$loki'];
        return {
          ...item,
          id: Buffer.from(item.id, 'hex'),
          aggregateId: Buffer.from(item.aggregateId, 'hex'),
        };
      })
  }
}