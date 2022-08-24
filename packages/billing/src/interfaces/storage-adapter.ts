// eslint-disable-next-line import/extensions
import { Customer, Subscription } from '../types';

export interface StorageAdapter {
  getSubscription(params: { id: Buffer }): Promise<Subscription>;
  updateSubscription(params: {
    id: Buffer;
    subscription: string;
  }): Promise<void>;
  deleteSubscription(params: {
    id: Buffer;
    subscription: string;
  }): Promise<void>;
  findOneCustomerById(params: { id: Buffer }): Promise<Customer | null>;
  saveUserAsCustomer(params: { id: Buffer; customerId: string }): Promise<void>;
}
