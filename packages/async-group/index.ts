/* eslint-disable no-await-in-loop */
import uuid from 'uuid/v4';

export default class AsyncGroup {
  private promises: Map<string, Promise<any>> = new Map();

  private static instance: AsyncGroup | null = null;

  public async add<T = any>(promise: Promise<T>): Promise<T> {
    const id = uuid();

    this.promises.set(
      id,
      promise
        .catch(() => {})
        .finally(() => {
          this.promises.delete(id);
        })
    );
  
    return promise;
  }

  public async wait(): Promise<void> {
    while (this.promises.size > 0) {

      const promises = Array.from(this.promises.values());
      this.promises.clear();

      await Promise.all(promises.map(promise => promise.catch(() => {})));
    }
  }

  public get size(): number {
    return this.promises.size;
  }

  public static async add<T = any>(promise: Promise<T>): Promise<T> {
    if (!this.instance) {
      this.instance = new AsyncGroup();
    }

    return this.instance.add(promise);
  }

  public static async wait(): Promise<void> {
    if (!this.instance) {
      return;
    }

    await this.instance.wait();
  }
}
