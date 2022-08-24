/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
// import { Response } from 'express';
import * as R from 'ramda';
import { Request } from 'express';
import parse from 'co-body';
import Stripe from 'stripe';
import stripe from './setup';
import readConfig from './read-config';
import { StorageAdapter } from '../interfaces/storage-adapter';

async function createCustomer(id: Buffer) {
  const customer = await stripe.customers.create({
    metadata: {
      id: id.toString('base64url'),
    },
  });

  return customer.id;
}

export async function tryCatch(
  fn:
    | undefined
    | ((req: Request, storageAdapter: StorageAdapter) => Promise<unknown>),
  // param: Request,
  args: [Request, StorageAdapter],
): Promise<[null, Awaited<Promise<unknown>>] | [Error]> {
  try {
    if (R.isNil(fn)) {
      throw new Error('Handler not found.');
    }

    // const data = await fn(param);
    const data = await fn(...args);
    return [null, data];
  } catch (error) {
    return [error as Error];
  }
}

async function getTiersHandler(req: Request) {
  const { configPath } = req.params;
  const config = await readConfig(configPath);

  return config.tiers;
}

async function getClientSecret(req: Request) {
  const { userId } = req.params;

  const intentList = await stripe.setupIntents.list({
    customer: userId,
  });

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
  const { id, price, quantity } = body;
  const customer = await storageAdapter.findOneCustomerById({
    id: Buffer.from(id),
  });
  let customerId = customer?.customerId as string;

  if (R.isNil(price)) {
    throw new Error('Lacking property in request payload: price');
  }

  if (R.isNil(customer)) {
    customerId = await createCustomer(id);
    await storageAdapter.saveUserAsCustomer({
      id: Buffer.from(id),
      customerId,
    });
  }

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price,
        quantity: quantity ?? 1,
      },
    ],
    expand: ['items.data.price.product', 'latest_invoice.payment_intent'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  if (paymentIntent.status === 'succeeded') {
    await storageAdapter.updateSubscription({
      id: Buffer.from(id),
      subscription: subscription.id,
    });
  }

  return {
    user: id,
    tier: subscription.id,
    quantity: subscription.items.data[0].quantity,
  };
}

export type Methods = 'get' | 'put';
export type Endpoints = 'tiers' | 'secret' | 'subscription';

export type Mapper = {
  [method in Methods]: {
    [endpoint in Endpoints]+?: (
      req: Request,
      storageAdapter: StorageAdapter,
    ) => Promise<unknown>;
  };
};

export const handlerMapper: Mapper = {
  get: {
    tiers: getTiersHandler,
    secret: getClientSecret,
  },
  put: {
    subscription: updateSubscription,
  },
};
