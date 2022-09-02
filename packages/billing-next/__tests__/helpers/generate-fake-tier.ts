import { faker } from '@faker-js/faker';
import R from 'ramda';

export function generateFakeTiers() {
  const length = parseInt(faker.random.numeric(1, { bannedDigits: '0' }), 10);
  return R.times(
    () => ({
      _id: faker.datatype.uuid(),
      stripePrices: [`price_${faker.random.alphaNumeric(12)}`],
      stripeProduct: `prod_${faker.random.alphaNumeric(12)}`,
    }),
    length,
  );
}
