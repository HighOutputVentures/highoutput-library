/* eslint-disable func-names */
export default function (filter: { type?: string; version?: number }) {
  return function (target, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, filter, target);
  };
}
