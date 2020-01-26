/* eslint-disable no-underscore-dangle */
import R from 'ramda';

export function serialize(object: any): any {
  const type = typeof object;

  if (type === 'object') {
    if (object instanceof Date) {
      return {
        __classObject: true,
        type: 'Date',
        data: object.toISOString(),
      };
    }

    if (object instanceof Set) {
      return {
        __classObject: true,
        type: 'Set',
        data: Array.from(object),
      };
    }

    if (object instanceof Map) {
      return {
        __classObject: true,
        type: 'Map',
        data: Array.from(object),
      };
    }

    if (object instanceof Buffer) {
      return {
        __classObject: true,
        type: 'Buffer',
        data: object.toString('base64'),
      };
    }

    if (object === null) {
      return null;
    }

    return R.map(serialize)(object);
  }

  return object;
}

export function deserialize(object: any): any {
  const type = typeof object;

  if (type === 'object') {
    if (object === null) {
      return null;
    }

    if (object.__classObject) {
      if (object.type === 'Date') {
        return new Date(object.data);
      }

      if (object.type === 'Set') {
        return new Set(object.data);
      }

      if (object.type === 'Map') {
        return new Map(object.data);
      }

      if (object.type === 'Buffer') {
        return Buffer.from(object.data, 'base64');
      }
    }

    return R.map(deserialize)(object);
  }

  return object;
}

export default deserialize;
