import { ID, User } from '../lib/types';

export interface StorageAdapter<
  TUser extends User = User,
> {
  validateOtp(params: {
    otp: string;
  }): Promise<TUser | null>;
  saveOtp(params: {
    user: ID;
    otp: string;
  }): Promise<void>;
  findOneUserByEmail(params: { emailAddress: string }): Promise<TUser | null>;
}