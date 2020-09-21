# `@highoutput/serialize`

> A serialization library for complex objects.

## Usage

```
import { serialize } from '@highoutput/serialize';
import assert from 'assert';

const data = {
  number: 1,
  string: 'string',
  object: { one: 1, two: 2 },
  date: new Date('2020-09-20T04:00:00.000Z'),
  set: new Set([1, 2, 3, 4]),
  map: new Map<string, number>([['one', 1], ['two', 2], ['three', 3]]),
  buffer: Buffer.from('mOfRn5t7rFI=', 'base64')
};

assert.deepStrictEqual(
  serialize(data),
  {
    number: 1,
    string: 'string',
    object: { one: 1, two: 2 },
    date: {
      __classObject: true,
      type: 'Date',
      data: '2020-09-20T04:00:00.000Z'
    },
    set: {
      __classObject: true,
      type: 'Set',
      data: [1, 2, 3, 4]
    },
    map: {
      __classObject: true,
      type: 'Map',
      data: [['one', 1], ['two', 2], ['three', 3]]
    },
    buffer: {
      __classObject: true,
      type: 'Buffer',
      data: 'mOfRn5t7rFI='
    }
  },
);
```
