/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
// import { Response } from 'express';
import * as R from 'ramda';
import Stripe from 'stripe';
import stripe from './setup';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function tryCatch<T extends any[], U>(
  fn: (...args: T) => U,
  ...params: T
): Promise<[null, Awaited<U>] | [Error]> {
  try {
    const data = await fn(...params);
    return [null, data];
  } catch (error) {
    return [error as Error];
  }
}

async function getTiersHandler() {
  const prices = await stripe.prices.list({ expand: ['product'] });
  const tiers = R.map((price) => {
    return {
      ...R.pick(
        ['id', 'name', 'description', 'metadata'],
        price.product as Stripe.Product,
      ),
      price: {
        ...R.pick(['id', 'currency', 'unit_amount'], price),
      },
    };
  }, prices.data);

  return tiers;
}

export const handlerMapper = {
  get: {
    tiers: getTiersHandler,
  },
};
