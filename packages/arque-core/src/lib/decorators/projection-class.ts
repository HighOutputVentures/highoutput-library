import {
  EventStore,
  ProjectionStore,
} from '@arque/types';
import {
  PROJECTION_ID_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  PROJECTION_STORE_METADATA_KEY,
} from '../util/metadata-keys';

export default function (params: {
  id?: string;
  eventStore?: EventStore;
  projectionStore?: ProjectionStore;
} = {}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(PROJECTION_ID_METADATA_KEY, params.id, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore, target.prototype);
    Reflect.defineMetadata(PROJECTION_STORE_METADATA_KEY, params.projectionStore, target.prototype);
  };
}
