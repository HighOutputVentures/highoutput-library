import { faker } from '@faker-js/faker';

export function generateFakeStripePrice() {
  return {
    id: `price_${faker.random.alphaNumeric(12)}`,
    product: `prod_${faker.random.alphaNumeric(12)}`,
  };
}
