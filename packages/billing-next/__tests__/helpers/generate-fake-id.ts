/* eslint-disable no-shadow */
import { faker } from '@faker-js/faker';

export enum IdType {
  'USER' = 0,
  'CUSTOMER',
  'SETUP_INTENT_SECRET',
  'SUBSCRIPTION',
  'PRODUCT',
  'PRICE',
  'EVENT',
  'SETUP_INTENT',
  'PAYMENT_METHOD',
  'INVOICE',
}

export function generateFakeId(idType: IdType) {
  const idMapper = {
    0: faker.datatype.uuid(),
    1: `cus_${faker.random.alphaNumeric(12)}`,
    2: `seti_${faker.random.alphaNumeric(
      12,
    )}_secret_${faker.random.alphaNumeric(12)}`,
    3: `sub_${faker.random.alphaNumeric(24)}`,
    4: `prod_${faker.random.alphaNumeric(24)}`,
    5: `price_${faker.random.alphaNumeric(24)}`,
    6: `evt_${faker.random.alphaNumeric(24)}`,
    7: `seti_${faker.random.alphaNumeric(24)}`,
    8: `pm_${faker.random.alphaNumeric(24)}`,
    9: `in_${faker.random.alphaNumeric(24)}`,
  };

  return idMapper[idType];
}
