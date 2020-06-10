import Loki, { LokiMemoryAdapter } from 'lokijs';
import R from 'ramda';
import { SnapshotStore, Snapshot, ID } from '../types';
import generateSnapshotId from '../util/generate-snapshot-id';

type SerializedSnapshot = Omit<Snapshot, 'id' | 'aggregate'> &
  {
    id: string;
    aggregate: {
      id: string;
      type: string;
      version: number;
    };
  };

export function serializeSnapshot(snapshot: Snapshot): SerializedSnapshot {
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

export default class MemorySnapshotStore implements SnapshotStore {
  private readonly loki = new Loki(
    'SnapshotStore',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly collection = this
    .loki
    .addCollection<SerializedSnapshot>('snapshots');

  public async createSnapshot(params: {
    aggregate: {
      id: ID;
      type: string;
      version: number;
    };
    state: any;
  }): Promise<Snapshot> {
    const id = generateSnapshotId(params.aggregate);

    const snapshot = {
      ...params,
      id,
      timestamp: new Date(),
    };

    this.collection.findAndRemove({ id: id.toString('base64') });

    this.collection.insert(serializeSnapshot(snapshot));

    return snapshot;
  }

  public async retrieveLatestSnapshot(aggregate: {
    id: ID;
    type: string;
    version: number;
  }): Promise<Snapshot | null> {
    const [result] = this.collection
      .chain()
      .find({
        'aggregate.id': aggregate.id.toString('base64'),
        'aggregate.type': aggregate.type,
        'aggregate.version': {
          $lte: aggregate.version,
        },
      } as any)
      .sort(R.descend(R.path(['aggregate', 'version'])))
      .limit(1)
      .data()
      .map(deserializeSnapshot);

    return result;
  }
}
