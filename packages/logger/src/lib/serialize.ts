import * as R from 'ramda';

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
