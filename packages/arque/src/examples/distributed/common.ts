import { DistributedEventStore, ActiveMQConnection } from '@arque/core';

export const connection = new ActiveMQConnection();

export const eventStore = new DistributedEventStore({
  connection: new ActiveMQConnection(),
});
