/* eslint-disable import/extensions */
import Stripe from 'stripe';
import stripe from './setup';
import { StorageAdapter } from '../interfaces/storage-adapter';

export type WebhookEvents =
  | 'customer.subscription.created'
  | 'customer.subscription.deleted'
  | 'customer.subscription.updated';

type WebhookHandlers = {
  [event in WebhookEvents]: (opts: {
    object: Stripe.Event.Data.Object;
    storageAdapter: StorageAdapter;
  }) => Promise<unknown>;
};

async function handleSubscriptionUpdatedOrCreated(opts: {
  object: Stripe.Event.Data.Object;
  storageAdapter: StorageAdapter;
}) {
  const subscription = opts.object as Stripe.Subscription;
  const customer = (await stripe.customers.retrieve(
    subscription.customer as string,
  )) as Stripe.Customer;

  await opts.storageAdapter.updateSubscription({
    id: Buffer.from(customer.metadata.id, 'base64url'),
    tier: subscription.id as string,
  });

  return { received: true };
}

async function handleSubscriptionDeleted(opts: {
  object: Stripe.Event.Data.Object;
  storageAdapter: StorageAdapter;
}) {
  const subscription = opts.object as Stripe.Subscription;
  const customer = (await stripe.customers.retrieve(
    subscription.customer as string,
  )) as Stripe.Customer;

  await opts.storageAdapter.deleteSubscription({
    id: Buffer.from(customer.metadata.id, 'base64url'),
  });

  return { received: true };
}

const webhookHandlers: WebhookHandlers = {
  'customer.subscription.created': handleSubscriptionUpdatedOrCreated,
  'customer.subscription.deleted': handleSubscriptionDeleted,
  'customer.subscription.updated': handleSubscriptionUpdatedOrCreated,
};

export default webhookHandlers;
