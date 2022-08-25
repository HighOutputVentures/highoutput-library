/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import nock from 'nock';
import { faker } from '@faker-js/faker';
import setupWebhookEndpoint from './setup-webhook';

describe('setupWebhookEndpoint', () => {
  test('config is valid -> should return portal ID', async () => {
    const expected = { secret: `whsec_${faker.random.alphaNumeric(32)}` };
    const scope = nock(/stripe.com/)
      .post('/v1/webhook_endpoints')
      .reply(200, expected);

    const response = await setupWebhookEndpoint(faker.internet.url());

    expect(response).not.toBeUndefined();
    expect(response).toStrictEqual(expected.secret);
    scope.done();
  });
});
