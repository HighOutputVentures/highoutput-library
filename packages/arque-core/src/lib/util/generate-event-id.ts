import crypto from 'crypto';

const domain = crypto.randomBytes(8);
let counter = 0;
let lastTimestamp = Date.now();

export default function generateEventId() {
  const timestamp = Date.now();

  if (timestamp !== lastTimestamp) {
    counter = 0;
    lastTimestamp = timestamp;
  } else {
    counter += 1;
  }

  const id = Buffer.allocUnsafe(16);
  id.writeUIntBE(timestamp, 0, 6);

  domain.copy(id, 6);

  id.writeUIntBE(counter, 14, 2);

  return {
    id,
    timestamp: new Date(timestamp),
  };
}
