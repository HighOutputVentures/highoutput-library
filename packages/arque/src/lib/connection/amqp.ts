import Amqp, { AmqpOptions } from '@highoutput/amqp';
import { Connection } from '../types';

export default class implements Connection {
  private amqp: Amqp;

  constructor(options?: AmqpOptions) {
    this.amqp = new Amqp(options);
  }

  async createClient(address: string, options?: { timeout?: string | number }) {
    const client = await this.amqp.createClient(address, {
      ...options,
      deserialize: true,
      serialize: true,
      noResponse: false,
    });

    return Object.assign(
      (...args: any[]) => client(...args),
      {
        stop: () => client.client.stop(),
      },
    );
  }

  async createWorker(address: string, handler: (...args: any[]) => Promise<any>, options?: { concurrency?: number }) {
    const worker = await this.amqp.createWorker(address, handler, {
      ...options,
      deserialize: true,
      serialize: true,
    });

    return {
      stop: () => worker.stop(),
    };
  }

  async stop() {
    await this.amqp.stop();
  }
}
