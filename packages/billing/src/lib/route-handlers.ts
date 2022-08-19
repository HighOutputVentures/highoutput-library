/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
// import { Response } from 'express';
import * as R from 'ramda';
import Stripe from 'stripe';
import stripe from './setup';

export async function tryCatch(
  fn: () => Promise<unknown>,
  ...args: Parameters<typeof fn>
): Promise<[null, ReturnType<typeof fn>] | [Error]> {
  try {
    const data = await fn(...args);
    return [null, data as ReturnType<typeof fn>];
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
