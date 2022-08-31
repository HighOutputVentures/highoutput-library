/* eslint-disable import/extensions */
import Stripe from 'stripe';
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
  const [item] = subscription.items.data;
  const product = item.price.product as Stripe.Product;
  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  if (paymentIntent.status === 'succeeded') {
    await opts.storageAdapter.updateSubscription(
      subscription.customer as string,
      {
        product: product.id,
        quantity: item.quantity,
      },
    );
  }

  return { received: true };
}

async function handleSubscriptionDeleted(opts: {
  object: Stripe.Event.Data.Object;
  storageAdapter: StorageAdapter;
}) {
  const subscription = opts.object as Stripe.Subscription;

  await opts.storageAdapter.deleteSubscription(subscription.customer as string);

  return { received: true };
}

const webhookHandlers: WebhookHandlers = {
  'customer.subscription.created': handleSubscriptionUpdatedOrCreated,
  'customer.subscription.deleted': handleSubscriptionDeleted,
  'customer.subscription.updated': handleSubscriptionUpdatedOrCreated,
};

export default webhookHandlers;
