export const serialize = (object: any) => {
  try {
    const type = typeof object;

    if (type === 'string') {
      return object.replace(/\n/g, '\\n');
    }

    if (type === 'number') {
      return object.toString();
    }

    if (type === 'object') {
      if (object?.__classObject) {
        if (object.type === 'Date') {
          return serialize(new Date(object.data));
        }

        if (object.type === 'Set') {
          return serialize(object.data);
        }

        if (object.type === 'Map') {
          return serialize(object.data);
        }

        if (object.type === 'Buffer') {
          return serialize(Buffer.from(object.data, 'base64'));
        }
      }

      if (object?._bsontype === 'Binary') {
        return serialize(object.buffer);
      }

      if (object instanceof Array) {
        return object.reduce((arr, val) => {
          return arr.concat([serialize(val)]);
        }, []);
      }

      if (object instanceof Date) {
        return object.toISOString();
      }

      if (object instanceof Set) {
        return serialize(Array.from(object));
      }

      if (object instanceof Map) {
        return serialize(Array.from(object));
      }

      if (object instanceof Buffer) {
        return object.toString('base64');
      }

      if (object === null) {
        return null;
      }

      return Object.getOwnPropertyNames(object).reduce((arr, key) => {
        return {
          ...arr,
          [key]: serialize(object[key]),
        };
      }, {});
    }

    return object;
  } catch (error) {
    return null;
  }
};
