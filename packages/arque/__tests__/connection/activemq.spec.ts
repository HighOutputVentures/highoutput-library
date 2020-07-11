import sinon from 'sinon';
import delay from '@highoutput/delay';
import R from 'ramda';
import { chance, expect } from '../helpers';
import { ActiveMQConnection } from '../../src';

describe('ActiveMQConnection', () => {
  beforeEach(async function () {
    this.connection = new ActiveMQConnection();
  });

  afterEach(async function () {
    await this.connection.stop();
  });

  it('should establish connection between client and worker', async function () {
    const message = chance.paragraph();

    const client = await this.connection.createClient('Test');

    const handler = sinon.spy(async (params) => {
      await delay(50 + Math.random() * 100);

      return params;
    });

    await this.connection.createWorker('Test', handler);

    await client(message);

    expect(handler.calledOnce).to.be.true;
    expect(handler.args[0][0]).to.equal(message);
  });

  it('should distribute messages to multiple workers', async function () {
    const client = await this.connection.createClient('Test');

    const handlers = await Promise.all(R.times(async () => {
      const handler = sinon.spy(async (params) => {
        await delay(50 + Math.random() * 100);

        return params;
      });

      await this.connection.createWorker('Test', handler);

      return handler;
    }, 5));

    await Promise.all(R.times(() => client(chance.paragraph()), 100));

    handlers.forEach((handler) => expect(handler.called).to.be.true);
    expect(R.reduce((accum, handler) => accum + handler.callCount, 0, handlers)).to.equal(100);
  });

  it('should publish message to multiple subscribers', async function () {
    const publisher = await this.connection.createPublisher('test');

    const handlers = await Promise.all(R.times(async () => {
      const handler = sinon.spy(async (params) => params);

      await this.connection.createSubscriber('test', handler);

      return handler;
    }, 5));

    await publisher(chance.paragraph());

    await delay(250);

    handlers.forEach((handler) => expect(handler.called).to.be.true);
  });

  it('should receive messages from multiple publishers', async function () {
    const handlers = await Promise.all(R.times(async () => {
      const handler = sinon.spy(async (params) => params);

      await this.connection.createSubscriber('test.*', handler);

      return handler;
    }, 1));

    await Promise.all(R.times(async () => {
      const publisher = await this.connection.createPublisher(`test.${chance.word()}`);

      await publisher(chance.paragraph());
    }, 5));

    await delay(250);

    handlers.forEach((handler) => expect(handler.callCount).to.equal(5));
  });
});
