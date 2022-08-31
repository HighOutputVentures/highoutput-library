/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import * as R from 'ramda';
import { Request } from 'express';
import parse from 'co-body';
import Stripe from 'stripe';
import stripe from './setup';
import readConfig from './read-config';
import { StorageAdapter } from '../interfaces/storage-adapter';
import webhookHandlers, { WebhookEvents } from './webhook-handler';
import { RouteHandlerMapper } from '../types';

async function getOrCreateCustomer(
  stringId: string | undefined,
  storageAdapter: StorageAdapter,
) {
  if (R.isNil(stringId)) {
    throw new Error('Cannot find property: id');
  }

  const id = Buffer.from(stringId, 'base64url');
  const customer = await storageAdapter.findOneCustomerById({ id });

  if (R.isNil(customer)) {
    const newCustomer = await stripe.customers.create({
      metadata: {
        id: id.toString('base64url'),
      },
    });
    await storageAdapter.saveUserAsCustomer({
      id,
      customerId: newCustomer.id,
    });
    return newCustomer.id;
  }

  return customer.customerId;
}

export async function tryCatch(
  fn:
    | undefined
    | ((req: Request, storageAdapter: StorageAdapter) => Promise<unknown>),
  args: [Request, StorageAdapter],
): Promise<[null, Awaited<Promise<unknown>>] | [Error]> {
  try {
    if (R.isNil(fn)) {
      throw new Error('Handler not found.');
    }

    const data = await fn(...args);
    return [null, data];
  } catch (error) {
    return [error as Error];
  }
}

async function getTiersHandler(req: Request) {
  const { configPath } = req.context;

  if (R.isNil(configPath)) {
    throw new Error('Cannot read undefined path.');
  }

  const config = await readConfig(configPath);

  return config.tiers;
}

async function getClientSecret(req: Request, storageAdapter: StorageAdapter) {
  const stringId = req.query.id as string;
  const customer = await getOrCreateCustomer(stringId, storageAdapter);

  const intentList = await stripe.setupIntents.list({ customer });

  if (!R.isEmpty(intentList.data)) {
    const [intent] = intentList.data;
    return R.pick(['client_secret'], intent);
  }

  const intent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  });

  return R.pick(['client_secret'], intent);
}

async function updateSubscription(
  req: Request,
  storageAdapter: StorageAdapter,
) {
  const body = await parse(req);
  const { id: stringId, price, quantity } = body;

  if (R.isNil(price)) {
    throw new Error('Lacking property in request payload: price');
  }

  const customer = await getOrCreateCustomer(stringId, storageAdapter);

  const subscription = await stripe.subscriptions.create({
    customer,
    items: [
      {
        price,
        quantity: quantity ?? 1,
      },
    ],
    expand: ['items.data.price.product', 'latest_invoice.payment_intent'],
  });

  const [item] = subscription.items.data;
  const product = item.price.product as Stripe.Product;
  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  if (paymentIntent.status === 'succeeded') {
    await storageAdapter.updateSubscription({
      id: Buffer.from(stringId, 'base64url'),
      tier: product.id,
      quantity: item.quantity,
    });
  }

  return {
    user: stringId,
    tier: product.id,
    quantity: item.quantity,
  };
}

async function getSubscription(req: Request, storageAdapter: StorageAdapter) {
  const { id } = req.query;

  if (R.isNil(id)) {
    throw new Error('Cannot find ID in request parameters.');
  }

  return storageAdapter.getSubscription({
    id: Buffer.from(id as string, 'base64url'),
  });
}

async function getPortal(req: Request, storageAdapter: StorageAdapter) {
  const stringId = req.query.id as string;
  const customer = await getOrCreateCustomer(stringId, storageAdapter);

  const session = await stripe.billingPortal.sessions.create({
    customer,
  });

  return R.pick(['url'], session);
}

async function handleWebhook(req: Request, storageAdapter: StorageAdapter) {
  const { endpointSecret } = req.context;
  const { raw: rawBody } = await parse(req, { returnRawBody: true });

  if (R.isNil(endpointSecret)) {
    throw new Error('Cannot verify payload without signing secret.');
  }

  const signature = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature as string,
    endpointSecret,
  );

  const eventHandler = R.prop(event.type as WebhookEvents, webhookHandlers);

  return eventHandler({
    object: event.data.object,
    storageAdapter,
  });
}

export const handlerMapper: RouteHandlerMapper<Request, StorageAdapter> = {
  get: {
    tiers: getTiersHandler,
    secret: getClientSecret,
    subscription: getSubscription,
    portal: getPortal,
  },
  put: {
    subscription: updateSubscription,
  },
  post: {
    webhook: handleWebhook,
  },
};
