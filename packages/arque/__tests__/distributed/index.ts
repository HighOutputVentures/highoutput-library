import { fork } from 'child_process';
import path from 'path';
import { database, connection } from './library';
import BalanceProjection from './projection';
import BalanceAggregate from './aggregate';

const projection = new BalanceProjection();
const server = fork(
  path.resolve(__dirname, './event-store.ts'),
  {
    execArgv: ['--require', 'ts-node/register'],
  },
);

export async function start() {
  await projection.start();
}

export async function stop() {
  await projection.stop();
  await connection.stop();
  await database.close();
  server.kill('SIGTERM');
}

export const command = {
  async credit(id: Buffer, delta: number) {
    await BalanceAggregate.credit(id, delta);
  },
  async debit(id: Buffer, delta: number) {
    await BalanceAggregate.debit(id, delta);
  },
};

export const query = {
  async balance(id: Buffer) {
    const document = await BalanceProjection.models.BalanceModel.findOne({ _id: id });

    return document?.value || 0;
  },
};
