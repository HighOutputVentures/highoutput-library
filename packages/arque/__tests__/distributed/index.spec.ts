import crypto from 'crypto';
import R from 'ramda';
import { expect } from 'chai';
import delay from '@highoutput/delay';
import { fork } from 'child_process';
import path from 'path';
import { database } from './library';
import {
  start,
  stop,
  command,
  query,
} from '.';

describe('Distributed', () => {
  before(async function () {
    this.server = fork(
      path.resolve(__dirname, './event-store.ts'),
      {
        execArgv: ['--require', 'ts-node/register'],
      },
    );

    await delay(250);

    await start();
  });

  it('should update the application state correctly', async () => {
    const [first, second, third, fourth] = R.times(() => crypto.randomBytes(16), 4);

    await Promise.all([
      (async () => {
        await command.credit(first, 50);
        await command.debit(first, 20);
        await command.credit(first, 5);
      })(),
      (async () => {
        await command.credit(second, 1000);
        await command.credit(second, 25);
      })(),
      (async () => {
        await command.credit(third, 15);
        await command.debit(third, 25).catch(R.always);
      })(),
    ]);

    await delay(100);

    const balances = await Promise.all(R.map((id) => query.balance(id), [first, second, third, fourth]));
    expect(balances).to.deep.equal([35, 1025, 15, 0]);
  });

  after(async function () {
    await Promise.all([
      database.dropCollection('events'),
      database.dropCollection('projections'),
      database.dropCollection('balances'),
      database.dropCollection('snapshots'),
    ]);

    await stop();

    this.server.kill('SIGTERM');
  });
});
