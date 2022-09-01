import { CustomerPortalConfig } from '../typings';

export type Tier = {
  id: string;
  stripePrices: string[];
  stripeProduct: string;
};

export interface IStripeProviderStorageAdapter {
  insertTier(tier: Tier): Promise<void>;
  // listTiers(): Promise<Tier[]>;
}

export interface IStripeProvider {
  initializeTiers(): Promise<void>;
  initializeCustomerPortal(config: CustomerPortalConfig): Promise<void>;
}
