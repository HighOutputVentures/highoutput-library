import BalanceProjection from './projection';
import BalanceAggregate from './aggregate';
import BalanceModel from './model';

export default {
  async start() {
    await new BalanceProjection().start();
  },
  command: {
    async credit(id: Buffer, delta: number) {
      await BalanceAggregate.credit(id, delta);
    },
    async debit(id: Buffer, delta: number) {
      await BalanceAggregate.debit(id, delta);
    },
  },
  query: {
    async balance(id: Buffer) {
      const document = BalanceModel.findOne({ id: id.toString('hex') });

      return document?.value || 0;
    },
  },
};
