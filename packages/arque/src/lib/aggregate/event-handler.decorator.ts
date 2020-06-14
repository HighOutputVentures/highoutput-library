import { EVENT_HANDLERS_METADATA_KEY } from '../types';

/* eslint-disable func-names */
export default function (filter: { type?: string; version?: number }) {
  return function (target, key: string) {
    Reflect.defineMetadata(EVENT_HANDLERS_METADATA_KEY, {
      ...(Reflect.getMetadata(EVENT_HANDLERS_METADATA_KEY, target) || {}),
      [key]: filter,
    }, target);
  };
}
