export default function(filter: { type?: string; version?: number; }) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(propertyKey, filter, target);
    return descriptor;
  };
}
