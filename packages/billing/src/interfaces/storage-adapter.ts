// eslint-disable-next-line import/extensions
import { Customer, Subscription } from '../types';

export interface StorageAdapter<S extends Subscription = Subscription> {
  getSubscription(filter: {
    user?: Buffer;
    customer?: string;
  }): Promise<S | null>;
  updateSubscription(
    customer: string,
    update: {
      product?: string;
      quantity?: number;
    },
  ): Promise<S>;
  deleteSubscription(customer: string): Promise<void>;
  findOneCustomer(filter: {
    user?: Buffer;
    customer?: string;
  }): Promise<Customer | null>;
  saveCustomer(doc: { user: Buffer; customer: string }): Promise<void>;
}
