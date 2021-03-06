import { AGGREGATE_EVENT_HANDLERS_METADATA_KEY } from '../util/metadata-keys';

export default function (filter: { type?: string; version?: number }) {
  return function (target, _, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, [
      ...(Reflect.getMetadata(AGGREGATE_EVENT_HANDLERS_METADATA_KEY, target) || []),
      {
        filter,
        handler: descriptor.value,
      },
    ], target);
  };
}
