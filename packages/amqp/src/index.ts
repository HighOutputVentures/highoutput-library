/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/camelcase */
import container, { Connection, EventContext } from 'rhea';
import R from 'ramda';
import logger from './lib/logger';
import Client, { ClientOptions } from './lib/client';
import Worker, { WorkerOptions } from './lib/worker';

export { Client, Worker };

export type AmqpOptions = {
  host: string;
  port: number;
  username?: string;
  password?: string;
  initialReconnectDelay: number;
  maxReconnectDelay: number;
  prefix?: string;
}

export default class Amqp {
  private options: AmqpOptions;

  private connection: Connection;

  private workers: Worker[] = [];

  private clients: Client[] = [];

  public constructor(options?: Partial<AmqpOptions>) {
    this.options = R.mergeDeepLeft(options || {}, {
      host: 'localhost',
      port: 5672,
      initialReconnectDelay: 100,
      maxReconnectDelay: 10000,
    });

    this.connection = container.connect({
      ...this.options,
      reconnect: true,
      initial_reconnect_delay: this.options.initialReconnectDelay,
      max_reconnect_delay: this.options.maxReconnectDelay,

    });

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

  public async createClient<TInput extends any[] = any[], TOutput = any>(
    queue: string,
    options?: ClientOptions,
  ) {
    const client = new Client<TInput, TOutput>(
      this.connection,
      `${this.options.prefix || ''}${queue}`,
      options,
    );

    await client.start();

    const func = (...args: TInput) => client.send(...args);
    func.client = client;

    this.clients.push(client);

    return func;
  }

  public async createWorker<TInput extends any[] = any[], TOutput = any>(
    queue: string,
    handler: (...args: TInput) => Promise<TOutput>,
    options?: WorkerOptions,
  ) {
    const worker = new Worker(
      this.connection,
      `${this.options.prefix || ''}${queue}`,
      handler,
      options,
    );

    await worker.start();

    this.workers.push(worker as Worker);

    return worker;
  }

  public async stop() {
    await Promise.all([
      Promise.all(this.workers.map((worker) => worker.stop())),
      Promise.all(this.clients.map((client) => client.stop())),
    ]);

    this.connection.close();

    await new Promise((resolve) => {
      this.connection.once('connection_close', resolve);
    });
  }
}
