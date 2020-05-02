import Amqp, { AmqpOptions } from '@highoutput/amqp';
import { ConnectionAdapter, ConnectionAdapterClient } from '../types';

export default class implements ConnectionAdapter {
  private amqp: Amqp;

  constructor(options?: AmqpOptions) {
    this.amqp = new Amqp(options);
  }

  async createClient(address: string, options?: { timeout?: string | number }) {
    const client: any = await this.amqp.createClient(address, {
      ...options,
      deserialize: true,
      serialize: true,
      noResponse: false,
    });

    client.stop = () => client.client.stop();

    return client as ConnectionAdapterClient;
  }

  async createWorker(address: string, handler: (...args: any[]) => Promise<any>, options?: { concurrency?: number }) {
    const worker = await this.amqp.createWorker(address, handler, {
      ...options,
      deserialize: true,
      serialize: true
    });

    return worker;
  }

  async stop() {
    await this.amqp.stop();
  }
}