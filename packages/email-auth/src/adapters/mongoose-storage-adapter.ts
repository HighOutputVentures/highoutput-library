import { StorageAdapter } from '../interfaces';
import { User } from '../lib/types';

export class MongooseStorageAdapter implements StorageAdapter {
  validateOtp(_params: { otp: string; }): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  saveOtp(_params: { user: Buffer; otp: string; }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findOneUserByEmail(_params: { email: string; }): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}