import { User } from '../lib/types';

export interface EmailAdapter<T extends User = User> {
  sendEmailOtp(params: {
    otp: string;
    user: T;
  }): Promise<void>;
}
