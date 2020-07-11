import crypto from 'crypto';
import R from 'ramda';
import { MongoDBSnapshotStore } from '../../src';
import generateSnapshotId from '../../src/lib/util/generate-snapshot-id';
import { chance, expect, generateFakeSnapshot } from '../helpers';

describe('MongoDBSnapshotStore', () => {
  beforeEach(function () {
    this.store = new MongoDBSnapshotStore();
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
      expect(this.store.model.findOne({ _id: snapshot.id })).to.be.ok;
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

      expect(await this.store.model.findOne({ _id: snapshot.id }))
        .to.be.ok.to.has.property('state').to.deep.equal({ username });
    });
  });

  describe('#retrieveLatestSnapshot', () => {
    it('should retrieve the latest snapshot', async function () {
      const aggregate = {
        id: crypto.randomBytes(16),
        type: 'Account',
      };

      await Promise.all(R.times(async (index) => {
        const version = (index + 1) * 5;

        await this.store.model.create({
          _id: generateSnapshotId({
            ...aggregate,
            version,
          }),
          aggregate: {
            ...aggregate,
            version,
          },
          state: { username: chance.first().toLowerCase() },
          timestamp: new Date(),
        });
      }, 10));

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
