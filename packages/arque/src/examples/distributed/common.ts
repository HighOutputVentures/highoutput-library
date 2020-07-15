/* eslint-disable import/prefer-default-export */
import { DistributedEventStore } from '../../lib/event-store';
import { ActiveMQConnection } from '../../lib/connection';

export const connection = new ActiveMQConnection();

export const eventStore = new DistributedEventStore({
  connection: new ActiveMQConnection(),
});
