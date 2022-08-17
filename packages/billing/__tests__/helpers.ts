/* eslint-disable import/extensions */
import * as R from 'ramda';
import { faker } from '@faker-js/faker';
import Stripe from 'stripe';
import { PortalConfig, ProductsConfig } from '../src/types';

export function generateProductTiers() {
  const max = faker.random.numeric(1, { bannedDigits: '0' });

  return R.compose(
    R.map((index) => {
      return {
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        ...(index === 0
          ? { free: true }
          : { pricePerUnit: faker.random.numeric(3) }),
        metadata: {
          project: faker.company.name(),
        },
      };
    }),
    R.range(1),
  )(parseInt(max, 10)) as ProductsConfig;
}

export function generatePriceObject() {
  return {
    id: `price_${faker.random.alphaNumeric(14)}`,
    product: `prod_${faker.random.alphaNumeric(14)}`,
  } as Stripe.Price;
}

export function generateSubscriptionProduct() {
  return {
    prices: [`price_${faker.random.alphaNumeric(14)}`],
    product: `prod_${faker.random.alphaNumeric(14)}`,
  } as Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product;
}

export function generatePortalConfig() {
  return {
    returnUrl: faker.internet.url(),
    businessProfile: {
      headline: faker.company.catchPhrase(),
      privacyPolicyUrl: faker.internet.url(),
      termsOfServiceUrl: faker.internet.url(),
    },
  } as PortalConfig;
}
