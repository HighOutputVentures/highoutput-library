// eslint-disable-next-line import/extensions
import { Subscription, User } from '../types';

export interface StorageAdapter<TUser extends User = User> {
  getSubscription(params: { id: Buffer }): Promise<Subscription>;
  updateSubscription(params: {
    id: Buffer;
    subscription: string;
  }): Promise<void>;
  deleteSubscription(params: {
    id: Buffer;
    subscription: string;
  }): Promise<void>;
  findOneCustomerById(params: { id: Buffer }): Promise<TUser | null>;
}
