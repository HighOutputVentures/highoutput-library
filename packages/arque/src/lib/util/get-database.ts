import MemoryEventStoreDatabase from '../event-store/database/memory';
import { EventStoreDatabase } from '../types';

let database: EventStoreDatabase;

export default function () {
  if (!database) {
    database = new MemoryEventStoreDatabase();
  }

  return database;
}
