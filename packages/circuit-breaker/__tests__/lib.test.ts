import delay from '@highoutput/delay';
import { TimeoutError } from '..';
import { timeout } from '../lib';
import { chance } from './helpers';

describe('timeout', () => {
  test.concurrent('no timeout', async () => {
    const handler = jest.fn(async (message) => {
      await delay(100);
      return message;
    });

    const message = chance.sentence();

    await expect(timeout(handler(message), 200)).resolves.toBe(message);
  });

  test.concurrent('timeout', async () => {
    const handler = jest.fn(async (message) => {
      await delay(200);
      return message;
    });

    const message = chance.sentence();

    await expect(timeout(handler(message), 100)).rejects.toEqual(new TimeoutError());
  });

  test('handler throws error', async () => {
    const handler = jest.fn(async () => {
      await delay(100);
      throw new Error();
    });

    await expect(timeout(handler(), 200)).rejects.toEqual(new Error());
  });
});
