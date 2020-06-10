import crypto from 'crypto';
import { ID } from '../types';

let counter = crypto.randomBytes(3).readUIntBE(0, 3);

export default function generateId(timestamp?: Date): ID {
  const first = Buffer.alloc(6, 0);
  first.writeUIntBE(timestamp?.getTime() || Date.now(), 0, 6);

  const second = Buffer.alloc(3, 0);
  second.writeUIntBE(counter, 0, 3);

  counter += 1;

  return Buffer.concat([first, second, crypto.randomBytes(3)]);
}
