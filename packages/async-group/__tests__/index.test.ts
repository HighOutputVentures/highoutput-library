import delay from '@highoutput/delay';
import R from 'ramda';
import AsyncGroup from '../index';

describe('AsyncGroup', () => {
  test('wait for all promises', async () => {
    const group = new AsyncGroup();

    const spies = R.times(() => jest.fn(), 2);

    const promises = [
      (async () => {
        await delay(100);

        spies[0]();
      })(),
      (async () => {
        await delay(200);

        spies[1]();
      })(),
    ];

    group.add(promises[0]);
    group.add(promises[1]);
  
    await group.wait();

    for (const spy of spies) {
      expect(spy).toBeCalled();
    }
  })

  test('rejected promise', async () => {
    const group = new AsyncGroup();

    const spies = R.times(() => jest.fn(), 2);

    const promises = [
      (async () => {
        await delay(100);

        spies[0]();
      })(),
      (async () => {
        await delay(200);

        spies[1]();

        throw new Error();
      })(),
    ];

    group.add(promises[0]);
    const promise = group.add(promises[1]);
    
    await group.wait();

    for (const spy of spies) {
      expect(spy).toBeCalled();
    }

    await expect(promise).rejects.toEqual(new Error());
  })
});
