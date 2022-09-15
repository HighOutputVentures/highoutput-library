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
  stripePaymentMethod?: string;
};

export type Subscription = {
  id: string;
  stripeSubscription: string;
  user: string;
  tier: string;
  quantity: number;
  stripeStatus: Stripe.Subscription.Status;
};

export enum ValueType {
  'BILLING_PORTAL_CONFIGURATION' = 'stripeBillingPortalConfiguration',
  'WEBHOOK_SIGNING_SECRET' = 'stripeWebhookSigningSecret',
  'WEBHOOK_ENDPOINT_CONFIGURATION' = 'stripeWebhookEndpointConfiguration',
}

export type EventLog = {
  id: string;
  stripeEvent: string;
  stripeEventType: string;
  stripeIdempotencyKey: string;
  // requestId: string | null;
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
  updateUser(id: string, user: Partial<Omit<User, 'id'>>): Promise<void>;
  insertSubscription(subscription: Omit<Subscription, 'id'>): Promise<void>;
  findSubscriptionByUser(user: string): Promise<Subscription | null>;
  updateSubscription(
    id: string,
    params: Partial<Omit<Subscription, 'id'>>,
  ): Promise<void>;
  insertEvent(event: Omit<EventLog, 'id'>): Promise<void>;
  findEvent(key: string): Promise<EventLog | null>;
}

export interface IStripeProvider {
  initializeTiers(): Promise<void>;
  initializeCustomerPortal(): Promise<void>;
  initializeWebhookEndpoint(): Promise<void>;
}
