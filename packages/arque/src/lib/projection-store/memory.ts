/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Loki, { LokiMemoryAdapter } from 'lokijs';
import R from 'ramda';
import { ProjectionStore, ProjectionState, ProjectionStatus } from '../types';

type SerializedProjection = Omit<ProjectionState, 'lastEvent'> & { lastEvent?: string | null };

export function serialize(projection: ProjectionState): SerializedProjection {
  return {
    ...R.pick(['id', 'status', 'lastUpdated'], projection),
    lastEvent: projection.lastEvent?.toString('hex') || null,
  };
}

export function deserialize(projection: SerializedProjection): ProjectionState {
  return {
    ...R.pick(['id', 'status', 'lastUpdated'], projection),
    lastEvent: projection.lastEvent ? Buffer.from(projection.lastEvent, 'hex') : null,
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

  async find(id: string) {
    const projection = this.collection.findOne({ id });

    if (!projection) {
      return null;
    }

    return deserialize(projection);
  }

  async save(params: Pick<ProjectionState, 'id'>
  & Partial<Pick<ProjectionState, 'status' | 'lastEvent'>>) {
    let projection = this.collection.findOne({ id: params.id });

    if (!projection) {
      this.collection.insert(serialize({
        ...R.mergeLeft({
          status: ProjectionStatus.Pending,
        }, params),
        lastUpdated: new Date(),
      }));
      projection = this.collection.findOne({ id: params.id })!;
    }

    if (params.status) {
      projection.status = params.status;
    }

    if (params.lastEvent) {
      projection.lastEvent = params.lastEvent.toString('hex');
    }

    this.collection.update(projection);

    return true;
  }
}
