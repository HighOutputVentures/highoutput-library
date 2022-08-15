import Stripe from 'stripe';

let stripe: Stripe;

export function setupStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Secret key is required.');
  }

  stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-08-01',
  });
}

export function createProducts() {
  // TODO
}

export function setupCustomerPortal() {
  // TODO
}
