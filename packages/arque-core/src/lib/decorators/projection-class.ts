import {
  Event,
  EventFilter,
  EventStore,
  ProjectionStore,
} from '@arque/types';
import {
  PROJECTION_ID_METADATA_KEY,
  EVENT_STORE_METADATA_KEY,
  EVENT_UPCASTERS_METADATA_KEY,
  PROJECTION_STORE_METADATA_KEY,
  PROJECTION_EVENT_HANDLERS_METADATA_KEY,
} from '../util/metadata-keys';

export default function (params: {
  id?: string;
  eventStore?: EventStore;
  projectionStore?: ProjectionStore;
  eventUpcasters?: {
    filter: { type: string; version: number; aggregate?: { type: string; } };
    upcaster: (event: Event) => Event
  }[];
  eventHandlers?: {
    filter: EventFilter;
    handler: (event: Event) => Promise<void>;
  }[];
} = {}): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(PROJECTION_ID_METADATA_KEY, params.id, target.prototype);
    Reflect.defineMetadata(EVENT_STORE_METADATA_KEY, params.eventStore, target.prototype);
    Reflect.defineMetadata(PROJECTION_STORE_METADATA_KEY, params.projectionStore, target.prototype);
    Reflect.defineMetadata(EVENT_UPCASTERS_METADATA_KEY, [
      ...(Reflect.getMetadata(EVENT_UPCASTERS_METADATA_KEY, target.prototype) || []),
      ...params.eventUpcasters || [],
    ], target.prototype);
    Reflect.defineMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, [
      ...(Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, target.prototype) || []),
      ...params.eventHandlers || [],
    ], target.prototype);
  };
}
