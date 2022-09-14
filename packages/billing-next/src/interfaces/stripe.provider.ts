import Stripe from 'stripe';

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

export type User = {
  id: string;
  stripeCustomer: string;
};

export type Subscription = {
  id: string;
  user: string;
  tier: string;
  quantity: number;
  status: Stripe.Subscription.Status;
};

export enum ValueType {
  'BILLING_PORTAL_CONFIGURATION' = 'stripeBillingPortalConfiguration',
  'WEBHOOK_SIGNING_SECRET' = 'stripeWebhookSigningSecret',
  'WEBHOOK_ENDPOINT_CONFIGURATION' = 'stripeWebhookEndpointConfiguration',
}

export type EventLog = {
  id: string;
  type: string;
  idempotencyKey: string;
  requestId: string | null;
};

export interface IStripeProviderStorageAdapter {
  insertTier(tier: Tier): Promise<void>;
  updateTier(id: string, params: Partial<Omit<Tier, 'id'>>): Promise<void>;
  findTier(id: string): Promise<Tier | null>;
  listTiers(): Promise<Tier[] | null>;
  insertValue(value: Value): Promise<void>;
  findValue(id: ValueType): Promise<Value | null>;
  updateValue(id: ValueType, value: string): Promise<void>;
  findUser(id: string): Promise<User | null>;
  insertUser(user: User): Promise<void>;
  insertSubscription(subscription: Subscription): Promise<void>;
  findSubscriptionByUser(user: string): Promise<Subscription | null>;
  updateSubscription(
    id: string,
    params: Partial<Omit<Subscription, 'id'>>,
  ): Promise<void>;
  insertEvent(event: EventLog): Promise<void>;
  findEvent(key: string): Promise<EventLog | null>;
}

export interface IStripeProvider {
  initializeTiers(): Promise<void>;
  initializeCustomerPortal(): Promise<void>;
  initializeWebhookEndpoint(): Promise<void>;
}
