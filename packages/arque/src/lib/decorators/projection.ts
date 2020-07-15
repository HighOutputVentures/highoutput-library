import {
  EventStore,
  ProjectionStore,
  PROJECTION_ID_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  PROJECTION_STORE_METADATA_KEY,
} from '../types';
import getEventStore from '../util/get-event-store';
import getProjectionStore from '../util/get-projection-store';

export default function (params: {
  id: string;
  eventStore?: EventStore;
  projectionStore?: ProjectionStore;
}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(PROJECTION_ID_METADATA_KEY, params.id, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore || getEventStore(), target.prototype);
    Reflect.defineMetadata(PROJECTION_STORE_METADATA_KEY,
      params.projectionStore || getProjectionStore(), target.prototype);
  };
}
