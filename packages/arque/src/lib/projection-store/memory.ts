import Loki, { LokiMemoryAdapter } from 'lokijs';
import R from 'ramda';
import { ProjectionStore, Projection } from '../types';

type SerializedProjection = Omit<Projection, 'lastEvent'> & { lastEvent: string };

export function serialize(projection: Projection): SerializedProjection {
  return {
    ...R.pick(['id', 'status', 'lastUpdated'], projection),
    lastEvent: projection.lastEvent.toString('hex'),
  };
}

export function deserialize(projection: SerializedProjection): Projection {
  return {
    ...R.pick(['id', 'status', 'lastUpdated'], projection),
    lastEvent: Buffer.from(projection.lastEvent, 'hex'),
  };
}

export default class implements ProjectionStore {
  private readonly loki = new Loki(
    'SnapshotStore',
    { adapter: new LokiMemoryAdapter() },
  );

  public readonly collection = this
    .loki
    .addCollection<SerializedProjection>('projections');

  async findById(id: string) {
    const projection = this.collection.findOne({ id });

    if (!projection) {
      return null;
    }

    return deserialize(projection);
  }

  async save(params: Pick<Projection, 'id' | 'lastEvent' | 'status'>) {
    const projection = this.collection.findOne({ id: params.id });

    if (projection) {
      this.collection.remove(projection);
    }

    this.collection.insert(serialize({
      ...params,
      lastUpdated: new Date(),
    }));

    return true;
  }
}
