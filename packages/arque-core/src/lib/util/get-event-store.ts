import { EventStore } from '@arque/types';
import { MemoryEventStore } from '../event-store';

let store: EventStore;

export default function () {
  if (!store) {
    store = new MemoryEventStore();
  }

  return store;
}
