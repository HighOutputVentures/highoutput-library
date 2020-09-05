import { DistributedEventStore, LocalConnection } from '@arque/core';

export const connection = new LocalConnection();

export const eventStore = new DistributedEventStore({
  connection: new LocalConnection(),
});
