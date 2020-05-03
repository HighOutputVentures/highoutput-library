import sinon from 'sinon';
import { expect } from 'chai';
import { Context as MochaContext } from 'mocha';
import {
  AmqpConnectionAdapter
} from '../src';
import { chance } from './helpers';

type Context = MochaContext & {
  connection: AmqpConnectionAdapter;
};

describe('AmqpConnectionAdapter', () => {
  beforeEach(async function () {
    this.connection = new AmqpConnectionAdapter();
  });

  afterEach(async function (this: Context) {
    await this.connection.stop();
  });

  it('should establish connection between client and worker', async function (this: Context) {
    const client = await this.connection.createClient('TestClient');

    const workerHandlerSpy = sinon.spy(async (params) => params);
    await this.connection.createWorker('TestClient', workerHandlerSpy);

    const message = chance.paragraph();
    await client(message);

    expect(workerHandlerSpy.calledOnce).to.be.true;
    expect(workerHandlerSpy.args[0][0]).to.equal(message);
  });
});
