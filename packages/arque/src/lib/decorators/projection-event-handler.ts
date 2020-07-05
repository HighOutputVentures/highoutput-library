import {
  PROJECTION_EVENT_HANDLERS_METADATA_KEY,
  EventFilter,
} from '../types';

export default function (filter: EventFilter) {
  return function (target, _, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, [
      ...(Reflect.getMetadata(PROJECTION_EVENT_HANDLERS_METADATA_KEY, target) || []),
      {
        filter,
        handler: descriptor.value,
      },
    ], target);
  };
}
