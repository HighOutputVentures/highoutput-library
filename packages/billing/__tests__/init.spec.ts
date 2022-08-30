/* eslint-disable import/extensions */
import nock from 'nock';
import { faker } from '@faker-js/faker';
import { generatePriceObject } from './helpers';
import program from '../src/program';

describe('init command', () => {
  test('passed valid command and args -> should output success message', async () => {
    const spy = jest.spyOn(global.console, 'log');
    const expectedPortalId = { id: `bpc_${faker.random.alphaNumeric(24)}` };
    const expectedSecret = { secret: `whsec_${faker.random.alphaNumeric(32)}` };
    const args = [
      'node',
      './dist/index.js',
      'init',
      './__tests__/test-config.json',
    ];
    nock(/stripe.com/)
      .persist()
      .post('/v1/prices')
      .reply(200, generatePriceObject);

    nock(/stripe.com/)
      .persist()
      .post('/v1/billing_portal/configurations')
      .reply(200, expectedPortalId);

    nock(/stripe.com/)
      .persist()
      .post('/v1/webhook_endpoints')
      .reply(200, expectedSecret);

    await program.parseAsync(args);
    const [[portalMsg], [webhookMsg]] = spy.mock.calls;

    expect(portalMsg).toMatch(
      new RegExp(`configured successfully.*.${expectedPortalId}`),
    );
    expect(webhookMsg).toMatch(
      new RegExp(`signing secret.*.${expectedPortalId}`),
    );
  });
});
