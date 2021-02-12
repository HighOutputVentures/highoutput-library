import { DistributedEventStoreServer, MongoDBEventStoreDatabase } from '@arque/core';
import ActiveMQConnection from '@arque/activemq-connection';
import { database } from './library';

const connection = new ActiveMQConnection();

const server = new DistributedEventStoreServer({
  connection,
  database: new MongoDBEventStoreDatabase(database),
});

async function start() {
  await database;
  await server.start();
}

async function stop() {
  await server.stop();
  await connection.stop();
  await database.close();
  process.exit();
}

start();

process.on('SIGTERM', () => stop());
