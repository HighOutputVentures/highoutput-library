import Amqp from '@highoutput/amqp';
import crypto from 'crypto';
import MemoryEventStoreDatabaseAdapter from './event-store/database-adapter/memory';
import { EventStoreDatabaseAdapter, ConnectionAdapter, ID } from './types';
import { AmqpConnectionAdapter } from '..';

let amqp: Amqp;
export function getAmqp() {
  if (!amqp) {
    amqp = new Amqp();
  }

  return amqp;
}

let database: EventStoreDatabaseAdapter;
export function getDatabase() {
  if (!database) {
    database = new MemoryEventStoreDatabaseAdapter();
  }

  return database;
}

let connection: ConnectionAdapter;
export function getConnection() {
  if (!connection) {
    connection = new AmqpConnectionAdapter();
  }

  return connection;
}

let counter = crypto.randomBytes(3).readUIntBE(0, 3);
export function generateId(timestamp?: Date): ID {
  const first = Buffer.alloc(6, 0);
  first.writeUIntBE(timestamp?.getTime() || Date.now(), 0, 6);

  const second = Buffer.alloc(3, 0);
  second.writeUIntBE(counter, 0, 3);

  counter = counter + 1;

  return Buffer.concat([first, second, crypto.randomBytes(3)]);
}
