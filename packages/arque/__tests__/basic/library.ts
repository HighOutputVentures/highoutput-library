/* eslint-disable import/prefer-default-export */
import Loki, { LokiMemoryAdapter } from 'lokijs';

export const loki = new Loki(
  'database',
  { adapter: new LokiMemoryAdapter() },
);
