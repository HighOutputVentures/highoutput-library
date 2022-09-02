/* eslint-disable no-shadow */
export type Tier = {
  id: string;
  stripePrices: string[];
  stripeProduct: string;
};

export type Value = {
  id: string;
  value: string;
};

export enum ValueType {
  'BILLING_PORTAL_CONFIGURATION' = 'stripeBillingPortalConfiguration',
  'WEBHOOK_SIGNING_SECRET' = 'stripeWebhookSigningSecret',
  'WEBHOOK_ENDPOINT_CONFIGURATION' = 'stripeWebhookEndpointConfiguration',
}

export interface IStripeProviderStorageAdapter {
  insertTier(tier: Tier): Promise<void>;
  updateTier(id: string, params: Partial<Omit<Tier, 'id'>>): Promise<void>;
  findTier(id: string): Promise<Tier | null>;
  listTiers(): Promise<Tier[] | null>;
  insertValue(value: Value): Promise<void>;
  findValue(id: ValueType): Promise<Value | null>;
  updateValue(id: ValueType, value: string): Promise<void>;
}

export interface IStripeProvider {
  initializeTiers(): Promise<void>;
  initializeCustomerPortal(): Promise<void>;
  initializeWebhookEndpoint(): Promise<void>;
}
