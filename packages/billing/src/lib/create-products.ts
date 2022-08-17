/* eslint-disable import/extensions */
import * as R from 'ramda';
import Stripe from 'stripe';
import pMap from 'p-map';
import stripe from './setup';
import { ProductsConfig } from '../types';

async function priceMapper(price: Stripe.Price) {
  return {
    prices: [price.id],
    product: price.product,
  } as Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product;
}

export default async function createProducts(products: ProductsConfig) {
  const prices = R.map((product: ProductsConfig[number]) => {
    return stripe.prices.create({
      unit_amount: product.free ? 0 : product.pricePerUnit,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      product_data: {
        name: product.name,
      },
    });
  }, products);

  return pMap(prices, priceMapper, { concurrency: 5 });
}
