import Loki, { LokiMemoryAdapter } from 'lokijs';

const loki = new Loki(
  'database',
  { adapter: new LokiMemoryAdapter() },
);

export type BalanceDocument = {
  id: string;
  value: number;
};

const BalanceModel = loki
  .addCollection<BalanceDocument>('balances');

export default BalanceModel;
