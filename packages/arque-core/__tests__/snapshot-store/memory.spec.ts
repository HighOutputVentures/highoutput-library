import crypto from 'crypto';
import R from 'ramda';
import { MemorySnapshotStore } from '../../src';
import { serializeSnapshot } from '../../src/lib/snapshot-store/memory';
import generateSnapshotId from '../../src/lib/util/generate-snapshot-id';
import { chance, expect, generateFakeSnapshot } from '../helpers';

describe('MemorySnapshotStore', () => {
  beforeEach(function () {
    this.store = new MemorySnapshotStore();
  });

  describe('#createSnapshot', () => {
    it('should create and store snapshot', async function () {
      const snapshot = await this.store.createSnapshot(generateFakeSnapshot()).save();

      expect(snapshot).to.has.all.keys([
        'id',
        'aggregate',
        'state',
        'timestamp',
      ]);
      expect(this.store.collection.findOne({ id: snapshot.id.toString('hex') })).to.be.ok;
    });

    it('should replace the existing snapshot', async function () {
      const snapshot = generateFakeSnapshot();

      await this.store.createSnapshot(snapshot).save();

      const username = chance.first().toLowerCase();

      await this.store.createSnapshot({
        ...snapshot,
        state: {
          username,
        },
      }).save();

      expect(this.store.collection.findOne({ id: snapshot.id.toString('hex') }))
        .to.be.ok.to.has.property('state').to.deep.equal({ username });
    });
  });

  describe('#retrieveLatestSnapshot', () => {
    it('should retrieve the latest snapshot', async function () {
      const aggregate = {
        id: crypto.randomBytes(16),
        type: 'Account',
      };

      R.times((index) => {
        const version = (index + 1) * 5;

        this.store.collection.insert(serializeSnapshot({
          id: generateSnapshotId({
            ...aggregate,
            version,
          }),
          aggregate: {
            ...aggregate,
            version,
          },
          state: { username: chance.first().toLowerCase() },
          timestamp: new Date(),
        }));
      }, 10);

      const snapshot = await this.store.retrieveLatestSnapshot({
        ...aggregate,
        version: 23,
      });

      expect(snapshot).to.be.ok;
      expect(snapshot).to.has.all.keys([
        'id',
        'aggregate',
        'state',
        'timestamp',
      ]);
      expect(snapshot.aggregate.version).to.equal(20);
    });
  });
});
