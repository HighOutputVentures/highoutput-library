/* eslint-disable no-restricted-syntax */
import R from 'ramda';
import { expect } from 'chai';
import crypto from 'crypto';
import { MemoryEventStore } from '../../src/lib/event-store';
import { generateFakeEvent, chance } from '../helpers';
import { serializeEvent } from '../../src/lib/event-store/database/memory';

describe.only('MemoryEventStore', () => {
  before(async function () {
    this.store = new MemoryEventStore();
  });

  afterEach(async function () {
    this.store.database.collection.clear();
  });

  describe('#createEvent', () => {
    it('should be able to create and save event', async function () {
      const event = await this.store.createEvent(R.omit(['id', 'timestamp'], generateFakeEvent())).save();

      expect(event).to.has.all.keys([
        'id',
        'type',
        'body',
        'aggregate',
        'version',
        'timestamp',
      ]);
      expect(this.store.database.collection.findOne({ id: event.id.toString('hex') })).to.be.ok;
    });
  });

  describe('#retrieveAggregateEvents', () => {
    beforeEach(async function () {
      this.aggregate = {
        id: crypto.randomBytes(16),
        type: 'Account',
      };

      this.store.database.collection.insert(R.times((index) => serializeEvent({
        ...generateFakeEvent(),
        aggregate: {
          ...this.aggregate,
          version: index + 1,
        },
      }), 100));

      this.store.database.collection.insert(R.times(() => serializeEvent(generateFakeEvent()), 100));
    });

    it('should retrieve aggregate events', async function () {
      const result = await this.store.retrieveAggregateEvents({ aggregate: this.aggregate.id });

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
  });

  describe('#retrieveEvents', () => {
    beforeEach(async function () {
      this.store.database.collection.insert(R.times(() => serializeEvent(generateFakeEvent()), 100));

      this.store.database.collection.insert(R.times(() => {
        const event = generateFakeEvent();

        return serializeEvent({
          ...event,
          type: chance.pickone(['Incremented', 'Decremented']),
          aggregate: {
            ...event.aggregate,
            type: 'Counter',
          },
          body: {
            value: chance.integer({ min: 1, max: 10 }),
          },
        });
      }, 100));
    });

    it('should retrieve events', async function () {
      const result = await this.store.retrieveEvents({
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
  });
});
