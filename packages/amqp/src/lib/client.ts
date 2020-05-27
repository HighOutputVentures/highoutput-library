/* eslint-disable @typescript-eslint/camelcase */
import {
  Connection, Sender, Receiver, EventContext,
} from 'rhea';
import R from 'ramda';
import uuid from 'uuid/v4';
import delay from '@highoutput/delay';
import ms from 'ms';
import AsyncGroup from '@highoutput/async-group';
import AppError from '@highoutput/error';
import { EventEmitter } from 'events';
import logger from './logger';
import {
  deserialize, serialize, closeSender, closeReceiver, openSender, openReceiver,
} from './util';

export type ClientOptions = {
  timeout: string;
  noResponse: boolean;
  deserialize: boolean;
  serialize: boolean;
}

export default class Client<TInput extends any[] = any[], TOutput = any> extends EventEmitter {
  private options: ClientOptions;

  private sender: Sender | null = null;

  private receiver: Receiver | null = null;

  public readonly id: string = uuid();

  private readonly callbacks = new Map<string, { resolve: Function; reject: Function }>();

  private asyncGroup: AsyncGroup = new AsyncGroup();

  private initialize: Promise<void> | null = null;

  private shutdown = false;

  private disconnected = false;

  private receiverQueueAddress: string;

  public constructor(
    private readonly connection: Connection,
    private readonly queue: string,
    options?: Partial<ClientOptions>,
  ) {
    super();

    this.options = R.mergeDeepLeft(options || {}, {
      timeout: '30s',
      noResponse: false,
      deserialize: true,
      serialize: true,
    });

    logger.tag('client').info(this.options);

    this.connection.on('disconnected', () => {
      logger.tag(['client', 'connection', 'disconnected']).tag('Connection is disconnected.');
      this.disconnected = true;
    });

    this.connection.on('connection_close', () => {
      logger.tag(['client', 'connection', 'connection_close']).tag('Connection is closed.');
      this.disconnected = true;
    });

    this.receiverQueueAddress = `temp-queue://${this.id}:${this.queue}`;
  }

  public async send(...args: TInput) {
    if (this.shutdown) {
      throw new AppError('CLIENT_ERROR', 'Client shutting down.');
    }

    if (this.disconnected) {
      await this.start();
    }

    const correlationId = uuid();
    const now = Date.now();

    const body = {
      correlationId,
      arguments: this.options.serialize ? serialize(args) : args,
      timestamp: now,
    };

    if (!this.sender || this.sender.is_closed()) {
      throw new AppError('CLIENT_ERROR',
        `Client sender is on invalid state. sender = ${!!this.sender}, closed = ${this.sender?.is_closed()}`);
    }

    if (!this.receiver || this.receiver.is_closed()) {
      throw new AppError('CLIENT_ERROR', 'Client receiver is on invalid state.');
    }

    try {
      this.sender.send({
        reply_to: this.receiverQueueAddress,
        correlation_id: correlationId,
        ttl: ms(this.options.timeout),
        absolute_expiry_time: now + ms(this.options.timeout),
        body,
      });
    } catch (err) {
      logger.tag('client').warn(err);
    }

    if (this.options.noResponse) {
      return null;
    }

    const promise = new Promise<TOutput>((resolve, reject) => {
      this.callbacks.set(correlationId, {
        resolve: (result: TOutput) => {
          this.callbacks.delete(correlationId);
          resolve(result);
        },
        reject: (error: Error) => {
          this.callbacks.delete(correlationId);
          reject(error);
        },
      });
    });

    const promiseRace = Promise.race([
      promise,
      (async () => {
        await delay(this.options.timeout);

        this.callbacks.delete(correlationId);

        throw new AppError('TIMEOUT', 'Request timeout.');
      })(),
    ]);

    this.asyncGroup.add((async () => promiseRace)().catch(R.identity));

    return promiseRace;
  }

  public async start() {
    if (this.initialize) {
      return this.initialize;
    }

    logger.tag(['client', 'start']).info('Initializing client...');
    this.initialize = (async () => {
      if (this.receiver) {
        this.receiver.close();
      }

      if (this.sender) {
        this.sender.close();
      }

      const [sender, receiver] = await Promise.all([
        openSender(this.connection, {
          target: {
            address: `queue://${this.queue}`,
            durable: 2,
            expiry_policy: 'never',
          },
        }),
        openReceiver(this.connection, this.receiverQueueAddress),
      ]);

      this.sender = sender;
      this.receiver = receiver;

      this.receiver.on('message', (context: EventContext) => {
        let body = context.message?.body;

        const callback = this.callbacks.get(context.message?.correlation_id as string);

        if (!callback) {
          return;
        }

        body = {
          ...body,
          result: this.options.deserialize ? deserialize(body.result) : body.result,
        };

        logger.tag(['client', 'response']).verbose(body);

        if (body.error) {
          let error: AppError;

          const deserialized = deserialize(body.error);

          const meta = {
            ...R.omit(['id', 'name', 'message', 'stack', 'service'])(deserialized),
            original: deserialized,
          };

          if (body.error.name === 'AppError') {
            error = new AppError(body.error.code, body.error.message, meta);
          } else {
            error = new AppError('WORKER_ERROR', body.error.message, meta);
          }

          callback.reject(error);
          return;
        }

        callback.resolve(body.result);
      });

      this.emit('start');
      this.initialize = null;
      this.disconnected = false;

      logger.tag(['client', 'start']).info('Client initialized.');
    })();

    return this.initialize;
  }

  public async stop() {
    this.shutdown = true;

    if (this.sender && this.sender.is_open()) {
      await closeSender(this.sender);
    }

    await this.asyncGroup.wait();

    if (this.receiver && this.receiver.is_open()) {
      await closeReceiver(this.receiver);
    }

    this.emit('stop');
  }
}
