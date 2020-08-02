import { expect } from 'chai';
import { ProjectionStatus } from '@arque/types';
import { MemoryProjectionStore } from '../../src';

describe('MemoryProjectionStore', () => {
  beforeEach(async function () {
    this.store = new MemoryProjectionStore();
  });

  afterEach(async function () {
    await this.store.collection.clear();
  });

  describe('#find', () => {
    it('should return correct projection state', async function () {
      await this.store.collection.insert({
        id: 'Balance',
        status: ProjectionStatus.Initializing,
        lastUpdated: new Date(),
      });

      const result = await this.store.find('Balance');

      expect(result).to.be.ok;
      expect(result).to.has.all.keys(['id', 'status', 'lastEvent', 'lastUpdated']);
    });
  });

  describe('#save', () => {
    it('should save projection state', async function () {
      await this.store.save({
        id: 'Balance',
        status: ProjectionStatus.Initializing,
      });

      const document = await this.store.collection.findOne({ id: 'Balance' });

      expect(document).to.be.ok;
      expect(document.status).to.equal(ProjectionStatus.Initializing);
    });
  });
});
