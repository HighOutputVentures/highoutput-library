/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
import container, { Connection, EventContext } from 'rhea';
import R from 'ramda';
import logger from './lib/logger';
import Client, { ClientOptions } from './lib/client';
import Worker, { WorkerOptions } from './lib/worker';

type AmqpOptions = {
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

  public constructor(options?: Partial<AmqpOptions>) {
    this.options = R.mergeDeepRight(options || {}, {
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
    scope: string,
    options?: ClientOptions,
  ) {
    const client = new Client<TInput, TOutput>(
      this.connection,
      `${this.options.prefix || ''}${scope}`,
      options,
    );
    await client.start();

    const func = (...args: TInput) => client.send(...args);
    func.client = client;

    return func;
  }

  public async createWorker<TInput extends any[] = any[], TOutput = any>(
    scope: string,
    handler: (...args: TInput) => Promise<TOutput>,
    options?: WorkerOptions,
  ) {
    const worker = new Worker(
      this.connection,
      `${this.options.prefix || ''}${scope}`,
      handler,
      options,
    );
    await worker.start();

    return worker;
  }
}
