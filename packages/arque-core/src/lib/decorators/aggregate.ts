import R from 'ramda';
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
  AGGREGATE_INITIAL_STATE_METADATA_KEY,
  AGGREGATE_CACHE_METADATA_KEY,
} from '../util/metadata-keys';
import getEventStore from '../util/get-event-store';
import getSnapshotStore from '../util/get-snapshot-store';

export default function (params: {
  type: string;
  eventStore?: EventStore;
  snapshotStore?: SnapshotStore;
  eventHandlers?: {
    filter: { type?: string; version?: number };
    handler: (state: any, event: Event) => any;
  }[];
  initialState?: any;
  cache?: {
    max?: number;
    maxAge?: number;
  };
}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(AGGREGATE_TYPE_METADATA_KEY, params.type, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore || getEventStore(), target.prototype);
    Reflect.defineMetadata(SNAPSHOT_STORE_METADATA_KEY, params.snapshotStore || getSnapshotStore(), target.prototype);
    Reflect.defineMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, [
      ...(Reflect.getMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, target.prototype) || []),
      ...params.eventHandlers || [],
    ], target.prototype);
    Reflect.defineMetadata(
      AGGREGATE_INITIAL_STATE_METADATA_KEY,
      R.isNil(params.initialState) ? null : params.initialState,
      target.prototype,
    );
    Reflect.defineMetadata(AGGREGATE_CACHE_METADATA_KEY, R.mergeDeepLeft({
      max: 1024,
      maxAge: 1440000,
    }, params.cache || {}), target);
  };
}
