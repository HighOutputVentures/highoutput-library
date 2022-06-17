import randomBytes from 'randombytes';
import bs58 from 'bs58';

export function generateObjectId<T = number>(type: T): string {
  return bs58.encode(Buffer.concat([Buffer.from([type as never]), randomBytes(11)]));
}
