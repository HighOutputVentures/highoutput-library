import hash from '@highoutput/hash';
import { ID } from '../types';
import convertUintToBuffer from './convert-uint-to-buffer';

export default function generateSnapshotId(aggregate: {
  id: ID;
  type: string;
  version: number;
}): ID {
  return Buffer.concat([
    aggregate.id,
    hash(aggregate.type).slice(0, 8),
    convertUintToBuffer(aggregate.version),
  ]);
}
