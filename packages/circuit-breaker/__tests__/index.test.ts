import delay from '@highoutput/delay';
import R from 'ramda';
import sampleSize from 'lodash.samplesize';
import CircuitBreaker, { Status, TimeoutError } from '../index';
import { chance } from './helpers';

describe('CircuitBreaker', () => {
  test.concurrent('no failure', async () => {
    const NUM_REQUESTS = 100;

    const handler = jest.fn(async (message: string) => {
      await delay(100);
      return message;
    });

    const circuitBreaker = new CircuitBreaker({
      handler,
    });

    await Promise.all(R.map(async (interval: number) => {
      await delay(interval);

      await circuitBreaker.exec(chance.string());
    }, R.times(() => Math.random() * 3000, NUM_REQUESTS)));

    expect(handler.mock.results.length).toBe(NUM_REQUESTS);

    expect(circuitBreaker.status).toBe(Status.Closed);

    await circuitBreaker.shutdown();
  });

  test.concurrent('partial failure', async () => {
    const NUM_REQUESTS = 100;

    const selected = new Set(sampleSize(R.range(0, NUM_REQUESTS), 10));

    const handler = jest.fn(async (index: number, message: string) => {
      await delay(selected.has(index) ? 300 : 100);
      return message;
    });

    const circuitBreaker = new CircuitBreaker({
      threshold: 0.5,
      timeout: 200,
      rollingCountBuckets: 5,
      rollingCountInterval: 500,
      handler,
    });

    const results = await Promise.all(R.times(async (index: number) => {
      const interval = Math.random() * 3000;
      await delay(interval);

      try {
        await circuitBreaker.exec(index, chance.string());
      } catch (err) {
        return err;
      }

      return null;
    }, NUM_REQUESTS));

    const errors = R.filter(R.identity as never, results);

    expect(errors).toHaveLength(10);

    R.forEach((err) => {
      expect(err).toBeInstanceOf(TimeoutError);
    }, errors);

    expect(circuitBreaker.status).toBe(Status.Closed);

    await circuitBreaker.shutdown();
  });

  test.concurrent('total failure', async () => {
    const NUM_REQUESTS = 100;

    const selected = new Set(sampleSize(R.range(0, NUM_REQUESTS), 50));

    const handler = jest.fn(async (index: number, message: string) => {
      await delay(selected.has(index) ? 300 : 100);
      return message;
    });

    const circuitBreaker = new CircuitBreaker({
      threshold: 0.35,
      timeout: 200,
      rollingCountBuckets: 5,
      rollingCountInterval: 500,
      handler,
    });

    const results = await Promise.all(R.times(async (index: number) => {
      const interval = Math.random() * 3000;
      await delay(interval);

      try {
        await circuitBreaker.exec(index, chance.string());
      } catch (err) {
        return err;
      }

      return null;
    }, NUM_REQUESTS));

    const errors = R.filter(R.identity as never, results);

    expect(errors.length >= 35).toBeTruthy();

    expect(circuitBreaker.status).toBe(Status.Open);

    await circuitBreaker.shutdown();
  });

  test.concurrent('recovery', async () => {
    const NUM_REQUESTS = 100;

    const selected = new Set(sampleSize(R.range(0, NUM_REQUESTS), 50));

    const circuitBreaker = new CircuitBreaker({
      threshold: 0.35,
      timeout: 200,
      rollingCountBuckets: 5,
      rollingCountInterval: 500,
      recoveryCountThreshold: 3,
      resetTimeout: 2000,
      handler: async (index: number, message: string) => {
        await delay(selected.has(index) ? 300 : 100);
        return message;
      },
    });

    await Promise.all(R.times(async (index: number) => {
      const interval = Math.random() * 3000;
      await delay(interval);

      try {
        await circuitBreaker.exec(index, chance.string());
      } catch (err) {
        return err;
      }

      return null;
    }, NUM_REQUESTS));

    expect(circuitBreaker.status).toBe(Status.Open);

    await delay(2000);

    expect(circuitBreaker.status).toBe(Status.HalfOpen);

    await Promise.all(R.times(async () => {
      await delay(Math.random() * 500);

      await circuitBreaker.exec(-1, chance.string());
    }, 3));

    expect(circuitBreaker.status).toBe(Status.Closed);

    await circuitBreaker.shutdown();
  });
});
