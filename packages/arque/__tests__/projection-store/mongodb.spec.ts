import { expect } from 'chai';
import { MongoDBProjectionStore, ProjectionStatus } from '../../src';

describe('MongoDBProjectionStore', () => {
  beforeEach(async function () {
    this.store = new MongoDBProjectionStore();
  });

  afterEach(async function () {
    await this.store.model.deleteMany({});
    await this.store.connection.close();
  });

  describe('#find', () => {
    it('should return correct projection state', async function () {
      await this.store.model.create({ _id: 'Balance', status: ProjectionStatus.Initializing });

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

      const document = await this.store.model.findOne({ _id: 'Balance' });

      expect(document).to.be.ok;
      expect(document.status).to.equal(ProjectionStatus.Initializing);
    });
  });
});
