import { EVENT_UPCASTERS_METADATA_KEY } from '../util/metadata-keys';

export default function (filter: { type: string; version: number }) {
  return function (target, _, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(EVENT_UPCASTERS_METADATA_KEY, [
      ...(Reflect.getMetadata(EVENT_UPCASTERS_METADATA_KEY, target) || []),
      {
        filter,
        upcaster: descriptor.value,
      },
    ], target);
  };
}
