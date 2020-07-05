import { ProjectionStore } from '../types';
import MemoryProjectionStoreStore from '../projection-store/memory';

let store: ProjectionStore;

export default function () {
  if (!store) {
    store = new MemoryProjectionStoreStore();
  }

  return store;
}
