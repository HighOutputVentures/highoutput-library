/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Stripe from 'stripe';
import * as R from 'ramda';
import { PortalConfig, ProductsConfig } from '../types';

let stripe: Stripe;

export function setupStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Secret key is required.');
  }

  stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-08-01',
  });
}

export async function createProducts(products: ProductsConfig) {
  const pricesConfig = R.map((product: ProductsConfig[number]) => {
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

  const pricesObject = await Promise.all(pricesConfig);

  return R.map((price) => {
    return {
      prices: [price.id],
      product: price.product,
    };
  }, pricesObject);
}

export async function setupCustomerPortal(config: PortalConfig) {
  // TODO: ADD PRODUCT CATALOG TO SUBSCRIPTION
  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: config.businessProfile.headline,
      privacy_policy_url: config.businessProfile.privacyPolicyUrl,
      terms_of_service_url: config.businessProfile.termsOfServiceUrl,
    },
    features: {
      customer_update: {
        allowed_updates: ['email'],
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
      },
    },
    default_return_url: config.returnUrl,
  });

  console.log(`Portal configuration created successfully: ${configuration.id}`);
}
