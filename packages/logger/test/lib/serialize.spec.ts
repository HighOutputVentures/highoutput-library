import 'mocha';
import { expect } from 'chai';

import { serialize } from '../../src/lib/serialize';

const data: { deserialized: any; serialized: any }[] = [
  {
    deserialized: new Date('2020-09-20T04:00:00.000Z'),
    serialized: '2020-09-20T04:00:00.000Z',
  },
  {
    deserialized: new Set([1, 2, 3, 4]),
    serialized: ['1', '2', '3', '4'],
  },
  {
    deserialized: new Map<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]),
    serialized: [
      ['one', '1'],
      ['two', '2'],
      ['three', '3'],
    ],
  },
  {
    deserialized: Buffer.from('mOfRn5t7rFI=', 'base64'),
    serialized: 'mOfRn5t7rFI=',
  },
  {
    deserialized: {
      date: new Date('2020-09-20T04:00:00.000Z'),
      set: new Set([1, 2, 3, 4]),
      map: new Map<string, number>([
        ['one', 1],
        ['two', 2],
        ['three', 3],
      ]),
      buffer: Buffer.from('mOfRn5t7rFI=', 'base64'),
    },
    serialized: {
      date: '2020-09-20T04:00:00.000Z',
      set: ['1', '2', '3', '4'],
      map: [
        ['one', '1'],
        ['two', '2'],
        ['three', '3'],
      ],
      buffer: 'mOfRn5t7rFI=',
    },
  },
  {
    deserialized: new Map([['one', new Date('2020-09-20T04:00:00.000Z')]]),
    serialized: [['one', '2020-09-20T04:00:00.000Z']],
  },
];

describe('serrialize', () => {
  for (const { deserialized, serialized } of data) {
    it('should return correct output', () => {
      expect(serialize(deserialized)).to.deep.equal(serialized);
    });
  }
});
