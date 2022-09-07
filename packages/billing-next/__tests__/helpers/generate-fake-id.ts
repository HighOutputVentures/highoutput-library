/* eslint-disable no-shadow */
import { faker } from '@faker-js/faker';

export enum IdType {
  'USER' = 0,
  'CUSTOMER',
  'SETUP_INTENT_SECRET',
  'SUBSCRIPTION',
}

export function generateFakeId(idType: IdType) {
  const idMapper = {
    0: faker.datatype.uuid(),
    1: `cus_${faker.random.alphaNumeric(12)}`,
    2: `seti_${faker.random.alphaNumeric(
      12,
    )}_secret_${faker.random.alphaNumeric(12)}`,
    3: `sub_${faker.random.alphaNumeric(24)}`,
  };

  return idMapper[idType];
}
