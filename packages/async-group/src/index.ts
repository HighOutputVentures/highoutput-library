/* eslint-disable no-await-in-loop */
import uuid from 'uuid/v4';

export default class AsyncGroup {
  private funcs: Map<string, Promise<any>> = new Map();

  private static instance: AsyncGroup = new AsyncGroup();

  public async add<T = any>(promise: Promise<T>): Promise<T> {
    const id = uuid();

    this.funcs.set(
      id,
      promise.finally(() => {
        this.funcs.delete(id);
      })
    );

    return promise;
  }

  public async wait(): Promise<void> {
    while (this.funcs.size > 0) {
      const promises = Array.from(this.funcs.values());
      this.funcs.clear();
      await Promise.all(promises);
    }
  }

  public static async add<T = any>(promise: Promise<T>): Promise<T> {
    return this.instance.add(promise);
  }

  public static async wait(): Promise<void> {
    await this.instance.wait();
  }
}
