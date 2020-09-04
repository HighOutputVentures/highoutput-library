import Amqp, { AmqpOptions } from '@highoutput/amqp';
import {
  Connection,
  ConnectionClient,
  ConnectionWorker,
  ConnectionPublisher,
  ConnectionSubscriber,
} from '@arque/types';

export default class implements Connection {
  private amqp: Amqp;

  constructor(options?: AmqpOptions) {
    this.amqp = new Amqp(options);
  }

  async createClient(
    address: string,
    options?: { timeout?: string | number },
  ): Promise<ConnectionClient> {
    const client = await this.amqp.createClient(address, {
      ...options,
      deserialize: true,
      serialize: true,
      noResponse: false,
    });

    return Object.assign((...args: any[]) => client(...args), {
      stop: () => client.client.stop(),
    });
  }

  async createWorker(
    address: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number },
  ): Promise<ConnectionWorker> {
    const worker = await this.amqp.createWorker(address, handler, {
      ...options,
      deserialize: true,
      serialize: true,
    });

    return {
      stop: () => worker.stop(),
    };
  }

  async createPublisher(topic: string): Promise<ConnectionPublisher> {
    const publisher = await this.amqp.createPublisher(topic, {
      serialize: true,
    });

    return Object.assign(async (...args: any[]) => publisher(...args), {
      stop: () => publisher.publisher.stop(),
    });
  }

  async createSubscriber(
    topic: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number },
  ): Promise<ConnectionSubscriber> {
    const subscriber = await this.amqp.createSubscriber(topic, handler, {
      ...options,
      deserialize: true,
    });

    return {
      stop: () => subscriber.stop(),
    };
  }

  async stop(): Promise<void> {
    await this.amqp.stop();
  }
}
