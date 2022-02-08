/* eslint-disable import/prefer-default-export */
import { TimeoutError } from './error';

export async function timeout<T>(promise: Promise<T>, delay: number) {
  let timer: null | NodeJS.Timeout = null;

  return Promise.race([
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new TimeoutError());
      }, delay);
    }),
    promise.finally(() => {
      if (timer) {
        clearTimeout(timer);
      }
    }),
  ]);
}
