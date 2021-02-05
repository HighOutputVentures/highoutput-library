/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import {
  Connection,
  ConnectionClient,
  ConnectionPublisher,
  ConnectionSubscriber,
  ConnectionWorker,
} from '@arque/types';
import * as amqp from 'amqplib';
import R from 'ramda';
import retry from 'async-retry';
import { ClientOptions, Options, WorkerOptions } from './lib/types';
import logger from './lib/logger';
import Client from './lib/client';
import Worker from './lib/worker';
import Publisher from './lib/publisher';
import Subscriber, { SubscriberOptions } from './lib/subscriber';

export { Client, Worker, Publisher, Subscriber };

export default class implements Connection {
  private options: Options;

  private _connection: Promise<amqp.Connection> | null = null;

  private channels = new Map<
    string,
    Client | Worker | Publisher | Subscriber
  >();

  public constructor(options?: Partial<Options>) {
    this.options = R.mergeDeepLeft(R.reject(R.isNil)(options || {}) as any, {
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
      exchange: '/',
    });

    if (typeof this.options.port === 'string') {
      this.options.port = parseInt(this.options.port, 10);
    }

    logger.info(R.omit(['password', 'uri'])(this.options));
  }

  private async getConnection() {
    if (!this._connection) {
      this._connection = retry(
        async () => {
          const connection = await amqp.connect(
            this.options.uri ||
              R.omit(['prefix', 'uri', 'exchange'])(this.options),
          );

          logger.info('connected');

          connection.on('close', async (err) => {
            this._connection = null;
            if (err && err.code === 320) {
              logger.error(err);
              await this.getConnection();
            }
          });

          if (!R.isEmpty(this.channels)) {
            await Promise.all(
              Array.from(this.channels.values()).map(async (channel) => {
                channel.channel = await connection.createChannel();
                return channel.start();
              }),
            );
          }

          return connection;
        },
        {
          forever: true,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 10000,
          randomize: true,
        },
      );
    }

    return this._connection;
  }

  public async createClient<TInput extends any[] = any[], TOutput = any>(
    queue: string,
    options?: Partial<ClientOptions>,
  ): Promise<ConnectionClient> {
    const channel = await (await this.getConnection()).createChannel();

    const client = new Client<TInput, TOutput>(
      channel,
      `${this.options.prefix || ''}${queue}`,
      options,
    );

    await client.start();

    this.channels.set(client.id, client);

    return Object.assign((...args: any[]) => client.send(...(args as TInput)), {
      stop: () => {
        this.channels.delete(client.id);
        return client.stop();
      },
    });
  }

  public async createWorker<TInput extends any[] = any[], TOutput = any>(
    queue: string,
    handler: (...args: TInput) => Promise<TOutput>,
    options?: Partial<WorkerOptions>,
  ): Promise<ConnectionWorker> {
    const channel = await (await this.getConnection()).createChannel();

    const worker = new Worker<TInput, TOutput>(
      channel,
      `${this.options.prefix || ''}${queue}`,
      handler,
      options,
    );

    await worker.start();

    this.channels.set(worker.id, worker as Worker);

    return {
      stop: () => {
        this.channels.delete(worker.id);
        return worker.stop();
      },
    };
  }

  public async createPublisher<TInput extends any[] = any[]>(
    topic: string,
  ): Promise<ConnectionPublisher> {
    const channel = await (await this.getConnection()).createChannel();

    const publisher = new Publisher<TInput>(
      channel,
      this.options.exchange || '/',
      `${this.options.prefix || ''}${topic}`,
    );

    await publisher.start();

    this.channels.set(publisher.id, publisher);

    return Object.assign(
      async (...args: any[]) => publisher.send(...(args as TInput)),
      {
        stop: () => {
          this.channels.delete(publisher.id);
          return publisher.stop();
        },
      },
    );
  }

  public async createSubscriber<TInput extends any[] = any[]>(
    topic: string,
    handler: (...args: TInput) => Promise<void>,
    options?: Partial<SubscriberOptions>,
  ): Promise<ConnectionSubscriber> {
    const channel = await (await this.getConnection()).createChannel();

    const subscriber = new Subscriber<TInput>(
      channel,
      this.options.exchange || '/',
      `${this.options.prefix || ''}${topic}`,
      handler,
      options,
    );

    await subscriber.start();

    this.channels.set(subscriber.id, subscriber as Subscriber);

    return {
      stop: () => {
        this.channels.delete(subscriber.id);
        return subscriber.stop();
      },
    };
  }

  public async stop(): Promise<void> {
    await Promise.all(
      Array.from(this.channels.values()).map((channel) => channel.stop()),
    );

    if (this._connection) {
      await (await this._connection).close();
    }
  }
}
