/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import nock from 'nock';
import { faker } from '@faker-js/faker';
import * as R from 'ramda';
import {
  generatePortalConfig,
  generateSubscriptionProduct,
} from '../../__tests__/helpers';
import setupCustomerPortal from './setup-customer-portal';

describe('setupCustomerPortal', () => {
  test('portal config is valid -> should return portal ID', async () => {
    const max = faker.random.numeric(1, { bannedDigits: '0' });
    const portalConfig = generatePortalConfig();
    const products = R.times(generateSubscriptionProduct, parseInt(max, 10));
    const expected = { id: `bpc_${faker.random.alphaNumeric(24)}` };
    const scope = nock(/stripe.com/)
      .post('/v1/billing_portal/configurations')
      .reply(200, expected);

    const response = await setupCustomerPortal(portalConfig, products);

    expect(response).not.toBeUndefined();
    expect(response).toStrictEqual(expected.id);
    scope.done();
  });
});
