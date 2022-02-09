import * as R from 'ramda';

export function deserialize(object: any): any {
  const type = typeof object;

  if (
    type === 'object' &&
    !(
      object instanceof Date ||
      object instanceof Set ||
      object instanceof Map ||
      object instanceof Buffer
    )
  ) {
    if (object === null) {
      return null;
    }

    if (object instanceof Array) {
      return object.map(deserialize);
    }

    if (object.__classObject) {
      if (object.type === 'Date') {
        return new Date(object.data);
      }

      if (object.type === 'Set') {
        return new Set(object.data.map(deserialize));
      }

      if (object.type === 'Map') {
        return new Map(object.data.map(deserialize));
      }

      if (object.type === 'Buffer') {
        return Buffer.from(object.data, 'base64');
      }
    }

    return R.map(deserialize)(object);
  }

  return object;
}

export const serialize = (data: any) => {
  const type = typeof data;

  if (type === 'string') {
    return data.replace(/\n/g, '\\n');
  }

  if (type === 'number') {
    return data.toString();
  }

  if (type === 'object') {
    if (data instanceof Array) {
      return data.map(serialize);
    }

    if (data instanceof Date) {
      return data.toISOString();
    }

    if (data instanceof Set) {
      return serialize(Array.from(data));
    }

    if (data instanceof Map) {
      return serialize(Array.from(data));
    }

    if (data instanceof Buffer) {
      return data.toString('base64');
    }

    if (data === null) {
      return null;
    }

    return R.map(serialize)(data);
  }

  return data;
};
