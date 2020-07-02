import {
  EventStore, PROJECTION_ID_METADATA_KEY, EVENT_STORE_METADATA_KEY,
} from '../types';
import getEventStore from '../util/get-event-store';

export default function (params: {
  id: string;
  eventStore?: EventStore;
}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(PROJECTION_ID_METADATA_KEY, params.id, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore || getEventStore(), target.prototype);
  };
}
