/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable no-useless-constructor */
import R from 'ramda';
import delay from '@highoutput/delay';
import assert from 'assert';
import { OpenCircuitError, TimeoutError } from './error';

export * from './error';

export enum Status {
  Open,
  Closed,
  HalfOpen,
}

type Handler<T extends any[], U> = (...args: T) => Promise<U>;

export default class <T extends any[], U> {
  private status: Status = Status.Closed;

  private timer: NodeJS.Timer | null = null;

  private buckets: { fires: number; fails: number; }[] = [];

  constructor(private opts: {
    timeout?: number;
    rollingCountInterval?: number;
    rollingCountBuckets?: number;
    threshold?: number;
    handler: Handler<T, U>;
    fallback?: Handler<T, U>;
  }) {
    this.reset();
  }

  public async exec(...args: T): Promise<U> {
    if (this.status === Status.Open) {
      if (this.opts.fallback) {
        return this.opts.fallback(...args);
      }

      throw new OpenCircuitError();
    }

    const bucket = R.last(this.buckets);

    assert(bucket, 'bucket cannot be undefined');

    bucket.fires += 1;

    const timestamp = Date.now();

    await this.opts.handler(...args);

    console.log(Date.now() - timestamp);

    return Promise.race([
      this.opts.handler(...args),
      (async () => {
        await delay(this.opts.timeout || 10000);

        bucket.fails += 1;

        throw new TimeoutError();
      })(),
    ]);
  }

  public open() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.status = Status.Open;
  }

  public reset() {
    this.buckets = [{ fires: 0, fails: 0 }];
    this.status = Status.Closed;

    this.timer = setInterval(() => {
      const fires = R.sum(R.map(R.prop('fires'), this.buckets));
      const fails = R.sum(R.map(R.prop('fails'), this.buckets));

      if (fires > 0 && fails / fires > (this.opts.threshold || 0.5)) {
        this.status = Status.Open;
      }

      if (this.buckets.length >= (this.opts.rollingCountBuckets || 10)) {
        this.buckets.shift();
      }

      this.buckets.push({ fires: 0, fails: 0 });
    }, this.opts.rollingCountInterval || 1000);
  }

  public shutdown() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
