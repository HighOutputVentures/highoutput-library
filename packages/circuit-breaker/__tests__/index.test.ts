import delay from '@highoutput/delay';
import R from 'ramda';
import sampleSize from 'lodash.samplesize';
import CircuitBreaker from '..';
import { chance } from './helpers';

describe('CircuitBreaker', () => {
  test('no failure', async () => {
    const NUM_REQUESTS = 100;

    const handler = jest.fn(async (message: string) => {
      await delay(10);
      return message;
    });

    const circuitBreaker = new CircuitBreaker({
      handler,
    });

    await Promise.all(R.map(async (interval: number) => {
      await delay(interval);
      await circuitBreaker.exec(chance.string());
    }, R.times(() => Math.random() * 100, NUM_REQUESTS)));

    circuitBreaker.shutdown();

    expect(handler.mock.results.length).toBe(NUM_REQUESTS);
  });

  test.only('partial failure', async () => {
    const NUM_REQUESTS = 5;

    const selected = new Set(sampleSize(R.range(0, NUM_REQUESTS), 0));

    const handler = jest.fn(async (index: number, message: string) => {
      await delay(selected.has(index) ? 30 : 10);
      return message;
    });

    const circuitBreaker = new CircuitBreaker({
      threshold: 0.5,
      timeout: 20,
      rollingCountBuckets: 5,
      rollingCountInterval: 50,
      handler,
    });

    await Promise.all(R.times(async (index: number) => {
      const interval = Math.random() * 200;
      await delay(interval);

      try {
        await circuitBreaker.exec(index, chance.string());
      } catch (err) {
        console.log('timeout');
      }
    }, NUM_REQUESTS));

    circuitBreaker.shutdown();
  });

  test.todo('trip');

  test.todo('recovery');
});
