export type Tier = {
  id: string;
  stripePrices: string[];
  stripeProduct: string;
};

export interface IStripeProviderStorageAdapter {
  insertTier(tier: Tier): Promise<void>;
  updateTier(id: string, params: Partial<Omit<Tier, 'id'>>): Promise<void>;
  findTier(id: string): Promise<Tier | null>;
  listTiers(): Promise<Tier[] | null>;
}

export interface IStripeProvider {
  initializeTiers(): Promise<void>;
  initializeCustomerPortal(): Promise<void>;
}
