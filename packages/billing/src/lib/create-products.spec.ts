/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import nock from 'nock';
import {
  generatePriceObject,
  generateProductTiers,
} from '../../__tests__/helpers';
import createProducts from './create-products';

describe('createProducts', () => {
  test('product config is valid -> should return products[]', async () => {
    const tiers = generateProductTiers();
    const scope = nock(/stripe.com/)
      .persist()
      .post('/v1/prices')
      .reply(200, generatePriceObject);

    const products = await createProducts(tiers);
    expect(products).not.toBeUndefined();
    expect(products).toBeInstanceOf(Array);
    scope.done();
  });
});
