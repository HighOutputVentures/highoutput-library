/* eslint-disable no-restricted-syntax */
import R from 'ramda';
import crypto from 'crypto';
import { MongoDBEventStoreDatabase } from '../../../src';
import {
  generateFakeEvent, expect, chance,
} from '../../helpers';

describe('MongoDBEventStoreDatabase', () => {
  before(function () {
    this.database = new MongoDBEventStoreDatabase();
  });

  afterEach(async function () {
    await this.database.model.deleteMany({});
  });

  describe('#saveEvent', () => {
    beforeEach(async function () {
      this.event = generateFakeEvent();
    });

    it('should save event', async function () {
      await this.database.saveEvent(this.event);

      const document = await this.database.model.findOne({ _id: this.event.id });
      expect(document).to.be.ok;
      expect(document).to.that.has.property('_id').that.is.instanceOf(Buffer);
      expect(document).to.that.has.property('type').that.is.a('string');
      expect(document).to.that.has.property('version').that.is.a('number');
      expect(document).to.that.has.property('timestamp').that.is.instanceOf(Date);
      expect(document).to.that.has.property('body');
      expect(document.aggregate).to.that.has.property('id').that.is.instanceOf(Buffer);
      expect(document.aggregate).to.that.has.property('type').that.is.a('string');
      expect(document.aggregate).to.that.has.property('version').that.is.a('number');
    });

    it('should not save multiple events with the same aggregate.id and aggregate.version', async function () {
      await this.database.saveEvent(this.event);

      await expect(this.database.saveEvent(this.event)).to.eventually.be.rejected.to.has.property(
        'code',
        'AGGREGATE_VERSION_EXISTS',
      );
    });
  });

  describe('#retrieveAggregateEvents', () => {
    beforeEach(async function () {
      this.aggregate = {
        id: crypto.randomBytes(16),
        type: 'Account',
      };

      await this.database.model.create(R.times((index) => {
        const event = generateFakeEvent();

        return {
          ...event,
          _id: event.id,
          aggregate: {
            ...this.aggregate,
            version: index + 1,
          },
        };
      }, 100));

      await this.database.model.create(R.times(() => {
        const event = generateFakeEvent();

        return {
          ...event,
          _id: event.id,
        };
      }, 100));
    });

    it('should retrieve aggregate events', async function () {
      const result = await this.database.retrieveAggregateEvents({ aggregate: this.aggregate.id });

      expect(result).to.be.an('array').to.has.length(100);

      expect(R.map(R.path(['aggregate', 'version']), result))
        .to.deep.equal(R.times((index) => index + 1, 100));

      for (const event of result) {
        expect(event).to.be.ok.has.all.keys([
          'id',
          'type',
          'body',
          'aggregate',
          'version',
          'timestamp',
        ]);
        expect(event.aggregate.id).to.deep.equal(this.aggregate.id);
        expect(event.aggregate.type).to.equal(this.aggregate.type);
        expect(event.id instanceof Buffer).to.be.true;
        expect(typeof event.type === 'string').to.be.true;
        expect(event.aggregate.id instanceof Buffer).to.be.true;
        expect(typeof event.aggregate.type === 'string').to.be.true;
        expect(typeof event.aggregate.version === 'number').to.be.true;
        expect(typeof event.version === 'number').to.be.true;
        expect(event.timestamp instanceof Date).to.be.true;
      }
    });

    it('should retrieve expected aggregate events when first and after parameters are set', async function () {
      const result = await this.database.retrieveAggregateEvents({
        aggregate: this.aggregate.id,
        first: 25,
        after: 50,
      });

      expect(result).to.be.an('array').to.has.length(25);
      expect(R.map(R.path(['aggregate', 'version']), result))
        .to.deep.equal(R.times((index) => index + 51, 25));
    });
  });

  describe('#retrieveEvents', () => {
    beforeEach(async function () {
      await this.database.model.create(R.times(() => {
        const event = generateFakeEvent();

        return {
          ...event,
          _id: event.id,
        };
      }, 100));

      await this.database.model.create(R.times(() => {
        const event = generateFakeEvent();

        return {
          ...event,
          _id: event.id,
          type: chance.pickone(['Incremented', 'Decremented']),
          aggregate: {
            ...event.aggregate,
            type: 'Counter',
          },
          body: {
            value: chance.integer({ min: 1, max: 10 }),
          },
        };
      }, 100));
    });

    it('should retrieve events', async function () {
      const result = await this.database.retrieveEvents({
        filters: [{
          aggregate: {
            type: 'Account',
          },
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
          'aggregate',
          'version',
          'timestamp',
        ]);
        expect(event.aggregate.type).to.equal('Account');
        expect(event.id instanceof Buffer).to.be.true;
        expect(typeof event.type === 'string').to.be.true;
        expect(event.aggregate.id instanceof Buffer).to.be.true;
        expect(typeof event.aggregate.type === 'string').to.be.true;
        expect(typeof event.aggregate.version === 'number').to.be.true;
        expect(typeof event.version === 'number').to.be.true;
        expect(event.timestamp instanceof Date).to.be.true;
      }
    });

    it('should retrieve events when multiple filters are set', async function () {
      const result = await this.database.retrieveEvents({
        filters: [{
          aggregate: {
            type: 'Account',
          },
        }, {
          aggregate: {
            type: 'Counter',
          },
        }],
      });

      expect(result).to.be.an('array').to.has.length(200);

      const ids = R.map((item) => item.id.toString('hex'), result);
      expect(ids).to.deep.equal(R.sort(R.ascend(R.identity), ids));

      for (const event of result) {
        expect(event.aggregate.type).is.oneOf(['Account', 'Counter']);
      }
    });

    it('should retrieve expected events when type is set in one of the filters', async function () {
      const result = await this.database.retrieveEvents({
        filters: [{
          aggregate: {
            type: 'Counter',
          },
          type: 'Incremented',
        }],
      });

      expect(result).to.be.an('array');

      const ids = R.map((item) => item.id.toString('hex'), result);
      expect(ids).to.deep.equal(R.sort(R.ascend(R.identity), ids));

      for (const event of result) {
        expect(event.aggregate.type).to.equal('Counter');
        expect(event.type).to.equal('Incremented');
      }
    });
  });
});
