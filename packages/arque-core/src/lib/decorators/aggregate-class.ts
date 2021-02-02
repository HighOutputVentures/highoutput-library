import {
  EventStore,
  SnapshotStore,
  Event,
} from '@arque/types';
import {
  AGGREGATE_TYPE_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  SNAPSHOT_STORE_METADATA_KEY,
  AGGREGATE_EVENT_HANDLERS_METADATA_KEY,
  EVENT_UPCASTERS_METADATA_KEY,
  AGGREGATE_INITIAL_STATE_METADATA_KEY,
  AGGREGATE_CACHE_METADATA_KEY,
} from '../util/metadata-keys';

export default function (params: {
  type?: string;
  eventStore?: EventStore;
  snapshotStore?: SnapshotStore;
  eventUpcasters?: {
    filter: { type: string; version: number; aggregate?: { type: string; } };
    upcaster: (event: Event) => Event
  }[];
  eventHandlers?: {
    filter: { type?: string; version?: number };
    handler: (state: any, event: Event) => any;
  }[];
  initialState?: any;
  cache?: {
    max?: number;
    maxAge?: number;
  };
} = {}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(AGGREGATE_TYPE_METADATA_KEY, params.type, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore, target.prototype);
    Reflect.defineMetadata(SNAPSHOT_STORE_METADATA_KEY, params.snapshotStore, target.prototype);
    Reflect.defineMetadata(EVENT_UPCASTERS_METADATA_KEY, [
      ...(Reflect.getMetadata(EVENT_UPCASTERS_METADATA_KEY, target.prototype) || []),
      ...params.eventUpcasters || [],
    ], target.prototype);
    Reflect.defineMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, [
      ...(Reflect.getMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, target.prototype) || []),
      ...params.eventHandlers || [],
    ], target.prototype);
    Reflect.defineMetadata(
      AGGREGATE_INITIAL_STATE_METADATA_KEY,
      params.initialState,
      target.prototype,
    );
    Reflect.defineMetadata(AGGREGATE_CACHE_METADATA_KEY, params.cache, target);
  };
}
