import {
  EventStore, SnapshotStore, AGGREGATE_TYPE_METADATA_KEY, EVENT_STORE_METADATA_KEY, SNAPSHOT_STORE_METADATA_KEY,
} from '../types';
import getEventStore from '../util/get-event-store';
import getSnapshotStore from '../util/get-snapshot-store';

/* eslint-disable func-names */
export default function (params: {
  type: string;
  eventStore?: EventStore;
  snapshotStore?: SnapshotStore;
}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(AGGREGATE_TYPE_METADATA_KEY, params.type, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore || getEventStore(), target.prototype);
    Reflect.defineMetadata(SNAPSHOT_STORE_METADATA_KEY, params.snapshotStore || getSnapshotStore(), target.prototype);
  };
}
