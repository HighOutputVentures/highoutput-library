import crypto from 'crypto';
import base32 from 'base32';
import AppError from '@highoutput/error';

export default class DeploymentID {
  private value: Buffer;

  constructor(value?: Buffer) {
    this.value = value || crypto.randomBytes(8);
  }

  public static from(value: string) {
    if (!/^[a-z0-9]{13}$/.test(value)) {
      throw new AppError('INVALID_OBJECT_ID', 'Invalid ObjectID format.');
    }
  
    const buffer = Buffer.from(base32.decode(value), 'binary');

    return new DeploymentID(buffer);
  }

  public toString() {
    return base32.encode(this.value, true);
  }

  public toBuffer() {
    return this.value;
  }
}
