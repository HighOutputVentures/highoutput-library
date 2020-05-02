import sinon from 'sinon';
import { expect } from 'chai';
import {
  AmqpConnectionAdapter
} from '../src';
import { chance } from './helpers';

describe('AmqpConnectionAdapter', () => {
  it('should establish connection between client and worker', async () => {
    const connection = new AmqpConnectionAdapter();

    const address = 'TestClient';

    const client = await connection.createClient(address);

    const workerHandlerSpy = sinon.spy(async (params) => params);
    await connection.createWorker(address, workerHandlerSpy);

    const message = chance.paragraph();
    await client(message);

    await connection.stop();

    expect(workerHandlerSpy.calledOnce).to.be.true;
    expect(workerHandlerSpy.args[0][0]).to.equal(message);
  });
});
