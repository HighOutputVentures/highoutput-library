/* eslint-disable func-names */
import { expect } from 'chai';
import KafkaConnection from '../src';

describe('KafkaConnection', () => {
  before(async function () {
    this.connection = new KafkaConnection({
      brokers: ['localhost:9092'],
    });
  });

  after(async function () {
    await this.connection.stop();
  });

  describe('#createPublisher', () => {
    it('should be able to create publisher', async function () {
      const publisher = await this.connection.createPublisher('test');

      expect(publisher).to.has.property('stop');
    });
  });

  describe('#createSubscriber', () => {
    it('should be able to create subscriber', async function () {
      const subscriber = await this.connection.createSubscriber(
        'test',
        async () => {}
      );

      expect(subscriber).to.has.property('stop');
    });
  });
});
