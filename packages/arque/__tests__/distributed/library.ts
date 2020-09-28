import mongoose from 'mongoose';
import { DistributedEventStore } from '@arque/core';
import ActiveMQConnection from '@arque/activemq-connection';

export const connection = new ActiveMQConnection();

export const eventStore = new DistributedEventStore({
  connection,
});

export const database = mongoose.createConnection('mongodb://localhost/arque');
