/* eslint-disable no-restricted-syntax */
import R from 'ramda';
import { DateTime } from 'luxon';
import crypto from 'crypto';
import MemoryEventStoreDatabase from '../../../../src/lib/event-store/database/memory';
import {
  generateFakeEvent, generateFakeSnapshot, expect, chance,
} from '../../../helpers';
import generateId from '../../../../src/lib/util/generate-id';

describe('MemoryEventStoreDatabase', () => {
  beforeEach(function () {
    this.database = new MemoryEventStoreDatabase();
  });

  describe('#saveEvent', () => {
    beforeEach(async function () {
      this.event = generateFakeEvent();
    });

    it('should save event', async function () {
      await this.database.saveEvent(this.event);

      expect(await this.database.collections.Event.findOne({ id: this.event.id.toString('hex') })).to.be.ok;
    });

    it('should not save multiple events with the same aggregateId, aggregateType and aggregateVersion',
      async function () {
        await this.database.saveEvent(this.event);

        await expect(this.database.saveEvent(this.event)).to.eventually.be.rejected.to.has.property(
          'code',
          'AGGREGATE_VERSION_EXISTS',
        );
      });
  });

  describe('#saveSnapshot', () => {
    it('should save snapshot', async function () {
      const snapshot = generateFakeSnapshot();

      await this.database.saveSnapshot(snapshot);

      expect(await this.database.collections.Snapshot.findOne({ id: snapshot.id.toString('hex') })).to.be.ok;
    });
  });

  describe('#retrieveLatestSnapshot', () => {
    beforeEach(async function () {
      this.aggregateId = crypto.randomBytes(12);
      this.aggregateType = 'Account';

      this.database.collections.Snapshot.insert(R.times((index) => {
        const snapshot = generateFakeSnapshot();

        return {
          ...snapshot,
          id: snapshot.id.toString('hex'),
          aggregateId: this.aggregateId.toString('hex'),
          aggregateType: this.aggregateType,
          aggregateVersion: (index + 1) * 10,
        };
      }, 10));

      this.database.collections.Snapshot.insert(R.times(() => {
        const snapshot = generateFakeSnapshot();

        return {
          ...snapshot,
          id: snapshot.id.toString('hex'),
          aggregateId: snapshot.aggregateId.toString('hex'),
        };
      }, 10));
    });

    it('should retrieve the latest snapshot', async function () {
      const result = await this.database.retrieveLatestSnapshot({
        aggregateId: this.aggregateId,
        aggregateType: this.aggregateType,
      });

      expect(result).to.be.ok.has.all.keys([
        'id',
        'aggregateId',
        'aggregateType',
        'aggregateVersion',
        'state',
        'timestamp',
      ]);
      expect(result).has.property('aggregateVersion', 100);
      expect(result.id instanceof Buffer).to.be.true;
      expect(result.aggregateId instanceof Buffer).to.be.true;
      expect(typeof result.aggregateType === 'string').to.be.true;
      expect(typeof result.aggregateVersion === 'number').to.be.true;
      expect(result.timestamp instanceof Date).to.be.true;
    });
  });

  describe('#retrieveAggregateEvents', () => {
    beforeEach(async function () {
      this.aggregateId = crypto.randomBytes(12);
      this.aggregateType = 'Account';

      this.database.collections.Event.insert(R.times((index) => {
        const event = generateFakeEvent();

        return {
          ...event,
          id: event.id.toString('hex'),
          aggregateId: this.aggregateId.toString('hex'),
          aggregateType: this.aggregateType,
          aggregateVersion: index + 1,
        };
      }, 100));

      this.database.collections.Event.insert(R.times(() => {
        const event = generateFakeEvent();

        return {
          ...event,
          id: event.id.toString('hex'),
          aggregateId: event.aggregateId.toString('hex'),
        };
      }, 100));
    });

    it('should retrieve aggregate events', async function () {
      const result = await this.database.retrieveAggregateEvents({
        aggregateId: this.aggregateId,
        aggregateType: this.aggregateType,
      });

      expect(result).to.be.an('array').to.has.length(100);
      expect(R.pluck<string, typeof result>('aggregateVersion', result))
        .to.deep.equal(R.times((index) => index + 1, 100));

      for (const event of result) {
        expect(event).to.be.ok.has.all.keys([
          'id',
          'type',
          'body',
          'aggregateId',
          'aggregateType',
          'aggregateVersion',
          'version',
          'timestamp',
        ]);
        expect(event).has.property('aggregateId').to.deep.equal(this.aggregateId);
        expect(event).has.property('aggregateType', this.aggregateType);
        expect(event.id instanceof Buffer).to.be.true;
        expect(typeof event.type === 'string').to.be.true;
        expect(event.aggregateId instanceof Buffer).to.be.true;
        expect(typeof event.aggregateType === 'string').to.be.true;
        expect(typeof event.aggregateVersion === 'number').to.be.true;
        expect(typeof event.version === 'number').to.be.true;
        expect(event.timestamp instanceof Date).to.be.true;
      }
    });

    it('should retrieve expected aggregate events when first and after parameters are set', async function () {
      const result = await this.database.retrieveAggregateEvents({
        aggregateId: this.aggregateId,
        aggregateType: this.aggregateType,
        first: 25,
        after: 50,
      });

      expect(result).to.be.an('array').to.has.length(25);
      expect(R.pluck<string, typeof result>('aggregateVersion', result))
        .to.deep.equal(R.times((index) => index + 51, 25));
    });
  });

  describe('#retrieveEvents', () => {
    beforeEach(async function () {
      const now = DateTime.utc().startOf('minute');

      this.database.collections.Event.insert(R.times((index) => {
        const timestamp = now.plus({ minutes: index }).toJSDate();

        const event = {
          ...generateFakeEvent(),
          id: generateId(timestamp),
        };

        return {
          ...event,
          id: event.id.toString('hex'),
          type: 'Created',
          aggregateId: event.aggregateId.toString('hex'),
          aggregateType: 'Account',
          body: {
            username: chance.first().toLowerCase(),
          },
          timestamp,
        };
      }, 100));

      this.database.collections.Event.insert(R.times((index) => {
        const timestamp = now.plus({ minutes: index }).toJSDate();

        const event = {
          ...generateFakeEvent(),
          id: generateId(timestamp),
        };

        return {
          ...event,
          id: event.id.toString('hex'),
          type: chance.pickone(['Incremented', 'Decremented']),
          aggregateId: event.aggregateId.toString('hex'),
          aggregateType: 'Counter',
          body: {
            value: chance.integer({ min: 1, max: 10 }),
          },
          timestamp,
        };
      }, 100));
    });

    it('should retrieve events', async function () {
      const result = await this.database.retrieveEvents({
        filters: [{
          aggregateType: 'Account',
        }],
      });

      expect(result).to.be.an('array').to.has.length(100);

      const ids = R.map((item) => item.id.toString('hex'), result);
      expect(ids).to.deep.equal(R.sort(R.ascend(R.identity), ids));

      for (const event of result) {
        expect(event).to.be.ok.has.all.keys([
          'id',
          'type',
          'body',
          'aggregateId',
          'aggregateType',
          'aggregateVersion',
          'version',
          'timestamp',
        ]);
        expect(event).has.property('aggregateType', 'Account');
        expect(event.id instanceof Buffer).to.be.true;
        expect(typeof event.type === 'string').to.be.true;
        expect(event.aggregateId instanceof Buffer).to.be.true;
        expect(typeof event.aggregateType === 'string').to.be.true;
        expect(typeof event.aggregateVersion === 'number').to.be.true;
        expect(typeof event.version === 'number').to.be.true;
        expect(event.timestamp instanceof Date).to.be.true;
      }
    });

    it('should retrieve events when multiple filters are set', async function () {
      const result = await this.database.retrieveEvents({
        filters: [{
          aggregateType: 'Account',
        }, {
          aggregateType: 'Counter',
        }],
      });

      expect(result).to.be.an('array').to.has.length(200);

      const ids = R.map((item) => item.id.toString('hex'), result);
      expect(ids).to.deep.equal(R.sort(R.ascend(R.identity), ids));

      for (const event of result) {
        expect(event).has.property('aggregateType').that.is.oneOf(['Account', 'Counter']);
      }
    });

    it('should retrieve expected events when type is set in one of the filters', async function () {
      const result = await this.database.retrieveEvents({
        filters: [{
          aggregateType: 'Counter',
          type: 'Incremented',
        }],
      });

      expect(result).to.be.an('array');

      const ids = R.map((item) => item.id.toString('hex'), result);
      expect(ids).to.deep.equal(R.sort(R.ascend(R.identity), ids));

      for (const event of result) {
        expect(event).has.property('aggregateType', 'Counter');
        expect(event).has.property('type', 'Incremented');
      }
    });
  });
});
