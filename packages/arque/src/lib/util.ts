import Amqp from '@highoutput/amqp';
import MemoryEventStoreDatabaseAdapter from './event-store/database-adapter/memory';
import { EventStoreDatabaseAdapter } from './types';

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