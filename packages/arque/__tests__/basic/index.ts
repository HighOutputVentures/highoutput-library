import BalanceProjection from './projection';
import BalanceAggregate from './aggregate';

const projection = new BalanceProjection();

export async function start() {
  await projection.start();
}

export async function stop() {
  await projection.stop();
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
    const document = BalanceProjection.models.Balance.findOne({ id: id.toString('hex') });

    return document?.value || 0;
  },
};
