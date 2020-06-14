import { ID } from '../types';

export default function generateSnapshotId(aggregate: {
  id: ID;
  version: number;
}): ID {
  const id = Buffer.allocUnsafe(22);
  aggregate.id.copy(id, 0);
  id.writeUIntBE(aggregate.version, 16, 6);

  return id;
}
