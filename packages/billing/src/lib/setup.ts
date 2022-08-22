/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Secret key is required.');
}

let stripeSecretKey: string | undefined;

export function setSecretKey(secretKey: string) {
  stripeSecretKey = secretKey;
}

const stripe = new Stripe(
  stripeSecretKey || (process.env.STRIPE_SECRET_KEY as string),
  {
    apiVersion: '2022-08-01',
  },
);

export default stripe;
