import { ID } from '../types';

type User = {
  id: ID;
  emailAddress: string;
}

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
  findOneUserByEmail(params: { email: string }): Promise<TUser | null>;
}