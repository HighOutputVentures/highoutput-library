import 'mocha';
import { expect } from 'chai';
import { serialize, deserialize } from '../src';

const data: { deserialized: any, serialized: any }[] = [
  {
    deserialized: 1,
    serialized: 1
  },
  {
    deserialized: 'string',
    serialized: 'string'
  },
  {
    deserialized: { one: 1, two: 2 },
    serialized: { one: 1, two: 2 }
  },
  {
    deserialized: new Date('2020-09-20T04:00:00.000Z'),
    serialized: {
      __classObject: true,
      type: 'Date',
      data: '2020-09-20T04:00:00.000Z'
    }
  },
  {
    deserialized: new Set([1, 2, 3, 4]),
    serialized: {
      __classObject: true,
      type: 'Set',
      data: [1, 2, 3, 4]
    }
  },
  {
    deserialized: new Map<string, number>([['one', 1], ['two', 2], ['three', 3]]),
    serialized: {
      __classObject: true,
      type: 'Map',
      data: [['one', 1], ['two', 2], ['three', 3]]
    }
  },
  {
    deserialized: Buffer.from('mOfRn5t7rFI=', 'base64'),
    serialized: {
      __classObject: true,
      type: 'Buffer',
      data: 'mOfRn5t7rFI='
    }
  },
  {
    deserialized: {
      number: 1,
      string: 'string',
      object: { one: 1, two: 2 },
      date: new Date('2020-09-20T04:00:00.000Z'),
      set: new Set([1, 2, 3, 4]),
      map: new Map<string, number>([['one', 1], ['two', 2], ['three', 3]]),
      buffer: Buffer.from('mOfRn5t7rFI=', 'base64')
    },
    serialized: {
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
    }
  },
  {
    deserialized: new Map([['one', new Date('2020-09-20T04:00:00.000Z')]]),
    serialized: {
      __classObject: true,
      type: 'Map',
      data: [
        [
          'one',
          {
            __classObject: true,
            type: 'Date',
            data: '2020-09-20T04:00:00.000Z'
          },
        ]
      ]
    },
  },
];

describe('serialize', () => {
  for (const { deserialized, serialized } of data) {
    it('should return correct output', () => {
      expect(serialize(deserialized)).to.deep.equal(serialized);
    });
  }
});

describe('deserialize', () => {
  for (const { deserialized, serialized } of data) {
    it('should return correct output', () => {
      expect(deserialize(serialized)).to.deep.equal(deserialized);
    });
  }
});
