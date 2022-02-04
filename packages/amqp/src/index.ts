/* trigger build x1 */

/* eslint-disable no-underscore-dangle, @typescript-eslint/no-non-null-assertion, @typescript-eslint/camelcase */
import {
  Connection, EventContext, Container, create_container,
} from 'rhea';
import R from 'ramda';
import uuid from 'uuid';
import { serialize, deserialize } from '@highoutput/serialize';
import logger from './lib/logger';
import Client, { ClientOptions } from './lib/client';
import Worker, { WorkerOptions } from './lib/worker';
import Publisher, { PublisherOptions } from './lib/publisher';
import Subscriber, { SubscriberOptions } from './lib/subscriber';

export {
  Client,
  Worker,
  Publisher,
  Subscriber,
  ClientOptions,
  WorkerOptions,
  PublisherOptions,
  SubscriberOptions,
  serialize,
  deserialize,
};

export type AmqpOptions = {
  host?: string;
  port?: number;
  hosts?: string[];
  ports?: number[];
  username: string;
  password?: string;
  transport?: 'ssl' | 'tcp' | 'tls';
  ca?: string;
  servername?: string;
  key?: string;
  cert?: string;
  initialReconnectDelay: number;
  maxReconnectDelay: number;
  prefix?: string;
  bufferSize?: number;
}

export default class Amqp {
  private options: AmqpOptions;

  private container: Container = create_container();

  private workers: Map<string, Worker> = new Map();

  private clients: Map<string, Client> = new Map();

  private publishers: Map<string, Publisher> = new Map();

  private subscribers: Map<string, Subscriber> = new Map();

  private _connection?: Connection;

  private attempts = 0;

  public constructor(options?: Partial<AmqpOptions>) {
    this.options = R.mergeDeepLeft(R.reject(R.isNil)(options || {}) as any, {
      username: 'ANONYMOUS',
      initialReconnectDelay: 100,
      maxReconnectDelay: 10000,
      connection_details: () => {
        const hostsPath = R.path<string[]>(['hosts'])(options);
        const portsPath = R.path<number[]>(['ports'])(options);

        const hosts = (hostsPath && hostsPath.length)
          ? hostsPath
          : [R.path<string>(['host'])(options) || 'localhost'];
        const ports = (portsPath && portsPath.length)
          ? portsPath
          : [R.path<number>(['port'])(options) || 5672];

        const details = {
          host: hosts[this.attempts % hosts.length],
          port: ports[this.attempts % ports.length],
          transport: this.options.transport,
        };

        this.attempts++;

        return details;
      },
    });

    logger.tag(['amqp', 'options']).info(R.omit(['password'], this.options));
  }

  private get connection() {
    if (!this._connection) {
      this._connection = this.container.connect({
        ...this.options,
        reconnect: true,
        initial_reconnect_delay: this.options.initialReconnectDelay,
        max_reconnect_delay: this.options.maxReconnectDelay,
      });

      this.connection.setMaxListeners(100);

      this.connection.on('connection_open', () => {
        logger.info('connection established');
      });
      this.connection.on('connection_close', () => {
        logger.info('connection closed');
      });
      this.connection.on('connection_error', (context: EventContext) => {
        logger.error(context.error?.message!);
      });
      this.connection.on('disconnected', () => {
        logger.info('disconnected');
      });
    }

    return this._connection;
  }

  public async createClient<TInput extends any[] = any[], TOutput = any>(
    queue: string,
    options?: Partial<ClientOptions>,
  ) {
    const client = new Client<TInput, TOutput>(
      this.connection,
      `${this.options.prefix || ''}${queue}`,
      options,
    );

    await client.start();

    const func = (...args: TInput) => client.send(...args);
    func.client = client;

    this.clients.set(client.id, client);
    client.once('stop', () => this.clients.delete(client.id));

    return func;
  }

  public async createWorker<TInput extends any[] = any[], TOutput = any>(
    queue: string,
    handler: (...args: TInput) => Promise<TOutput>,
    options?: Partial<WorkerOptions>,
  ) {
    const worker = new Worker<TInput, TOutput>(
      this.connection,
      `${this.options.prefix || ''}${queue}`,
      handler,
      options,
    );

    await worker.start();

    const id = uuid();
    this.workers.set(id, worker as Worker);
    worker.once('stop', () => this.workers.delete(id));

    return worker;
  }

  public async createPublisher<TInput extends any[] = any[]>(
    topic: string,
    options?: Partial<PublisherOptions>,
  ) {
    const publisher = new Publisher<TInput>(
      this.connection,
      `${this.options.prefix || ''}${topic}`,
      options,
    );

    await publisher.start();

    const func = async (...args: TInput) => publisher.send(...args);
    func.publisher = publisher;

    const id = uuid();
    this.publishers.set(id, publisher);
    publisher.once('stop', () => this.publishers.delete(id));

    return func;
  }

  public async createSubscriber<TInput extends any[] = any[]>(
    topic: string,
    handler: (...args: TInput) => Promise<void>,
    options?: Partial<SubscriberOptions>,
  ) {
    const subscriber = new Subscriber<TInput>(
      this.connection,
      `${this.options.prefix || ''}${topic}`,
      handler,
      options,
    );

    await subscriber.start();

    const id = uuid();
    this.subscribers.set(id, subscriber as Subscriber);
    subscriber.once('stop', () => this.subscribers.delete(id));

    return subscriber;
  }

  public async stop() {
    await Promise.all([
      Promise.all(Array.from(this.workers.values()).map((worker) => worker.stop())),
      Promise.all(Array.from(this.clients.values()).map((client) => client.stop())),
      Promise.all(Array.from(this.publishers.values()).map((publisher) => publisher.stop())),
      Promise.all(Array.from(this.subscribers.values()).map((subscriber) => subscriber.stop())),
    ]);

    const promise = new Promise((resolve) => {
      this.connection.once('connection_close', resolve);
    });

    this.connection.close();

    await promise;
  }
}
