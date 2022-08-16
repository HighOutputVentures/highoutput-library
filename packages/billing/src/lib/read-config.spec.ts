/* eslint-disable import/extensions */
import readConfig from './read-config';

describe('readConfig', () => {
  test('config file is valid', async () => {
    const config = await readConfig('./__tests__/lib/test-config.json');

    expect(config).toMatchObject({
      customerPortal: {
        returnUrl: 'https://example.com',
      },
    });
    expect(config.tiers).toEqual(
      expect.arrayContaining([
        {
          id: 'free_pricing',
          name: 'Starter',
          free: true,
        },
      ]),
    );
  });
});