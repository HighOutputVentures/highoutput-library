/* eslint-disable import/extensions */
import nock from 'nock';
import { faker } from '@faker-js/faker';
import { generatePriceObject } from './helpers';
import program from '../src/program';

describe('init command', () => {
  test('passed valid command and args -> should output success message', async () => {
    const spy = jest.spyOn(global.console, 'log');
    const expectedPortalId = { id: `bpc_${faker.random.alphaNumeric(24)}` };
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

    await program.parseAsync(args);
    const [[output]] = spy.mock.calls;

    expect(output).toMatch(new RegExp(`successfully.*.${expectedPortalId}`));
  });
});
