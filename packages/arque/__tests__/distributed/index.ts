import { database, connection } from './library';
import BalanceProjection from './projection';
import BalanceAggregate from './aggregate';

const projection = new BalanceProjection();

export async function start() {
  await database;
  await projection.start();
}

export async function stop() {
  await projection.stop();
  await connection.stop();
  await database.close();
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
    const document = await BalanceProjection.models.Balance.findOne({ _id: id });

    return document?.value || 0;
  },
};
