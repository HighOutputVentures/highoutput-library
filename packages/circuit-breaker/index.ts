/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
import R from 'ramda';
import assert from 'assert';
import AsyncGroup from '@highoutput/async-group';
import { OpenCircuitError } from './error';
import { timeout } from './lib';

export * from './error';

export enum Status {
  Open,
  Closed,
  HalfOpen,
}

type Handler<T extends any[], U> = (...args: T) => Promise<U>;

export default class <T extends any[], U> {
  private _status: Status = Status.Closed;

  private _timer: NodeJS.Timer | null = null;

  private _timeout: NodeJS.Timeout | null = null;

  private _buckets: { fires: number; fails: number; }[] = [];

  private _asyncGroup = new AsyncGroup();

  private _recoveryCount: { fires: number; successes: number; } = { fires: 0, successes: 0 };

  constructor(private opts: {
    timeout?: number;
    resetTimeout?: number;
    recoveryCountThreshold?: number;
    rollingCountInterval?: number;
    rollingCountBuckets?: number;
    threshold?: number;
    handler: Handler<T, U>;
    fallback?: Handler<T, U>;
  }) {
    this.reset();
  }

  private get initialized() {
    return this._buckets.length >= (this.opts.rollingCountBuckets || 10);
  }

  public get status() {
    return this._status;
  }

  public get threshold() {
    return this.opts.threshold || 0.5;
  }

  public get resetTimeout() {
    return this.opts.resetTimeout || 60000;
  }

  public get recoveryCountThreshold() {
    return this.opts.recoveryCountThreshold || 3;
  }

  private async failFast(...args: T): Promise<U> {
    if (this.opts.fallback) {
      return this.opts.fallback(...args);
    }

    throw new OpenCircuitError();
  }

  public async exec(...args: T): Promise<U> {
    if (this._status === Status.Open) {
      return this.failFast(...args);
    }

    if (this._status === Status.HalfOpen) {
      if (this._recoveryCount.fires >= this.recoveryCountThreshold) {
        return this.failFast(...args);
      }

      this._recoveryCount.fires += 1;

      let result;

      try {
        result = await this._asyncGroup.add(timeout(this.opts.handler(...args), this.opts.timeout || 1000));
      } catch (err) {
        if (this._status === Status.HalfOpen) {
          this.open();
        }

        throw err;
      }

      this._recoveryCount.successes += 1;

      if (this._recoveryCount.successes >= this.recoveryCountThreshold) {
        this.reset();
      }

      return result;
    }

    const bucket = R.last(this._buckets);

    assert(bucket, 'bucket cannot be undefined');

    bucket.fires += 1;

    let result;

    try {
      result = await this._asyncGroup.add(timeout(this.opts.handler(...args), this.opts.timeout || 1000));
    } catch (err) {
      bucket.fails += 1;
      throw err;
    }

    return result;
  }

  public open() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    this._timeout = setTimeout(() => {
      this._status = Status.HalfOpen;
      this._recoveryCount = { fires: 0, successes: 0 };
    }, this.resetTimeout);

    this._status = Status.Open;
  }

  public reset() {
    this._buckets = [{ fires: 0, fails: 0 }];
    this._status = Status.Closed;

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    this._timer = setInterval(() => {
      if (this.initialized) {
        const fires = R.sum(R.map(R.prop('fires'), this._buckets));
        const fails = R.sum(R.map(R.prop('fails'), this._buckets));

        if (fires > 0 && fails / fires > this.threshold) {
          this.open();
        }

        this._buckets.shift();
      }

      this._buckets.push({ fires: 0, fails: 0 });
    }, this.opts.rollingCountInterval || 1000);
  }

  public async shutdown() {
    this.open();

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    await this._asyncGroup.wait();
  }
}
