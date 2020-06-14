import { SnapshotStore } from '../types';
import MemorySnapshotStore from '../snapshot-store/memory';

let store: SnapshotStore;

export default function () {
  if (!store) {
    store = new MemorySnapshotStore();
  }

  return store;
}
