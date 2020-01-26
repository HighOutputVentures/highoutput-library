/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-non-null-assertion */
import {
  Connection, Sender, Receiver, EventContext,
} from 'rhea';
import R from 'ramda';
import uuid from 'uuid/v4';
import delay from '@highoutput/delay';
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
  }

  public async send(...args: TInput) {
    if (!this.sender || this.sender.is_closed()) {
      throw new Error('Sender is closed.');
    }

    const correlationId = uuid();

    const body = {
      correlationId,
      arguments: this.options.serialize ? serialize(args) : args,
      timestamp: Date.now(),
    };

    logger.tag(['client', 'request']).verbose(body);

    this.sender.send({
      reply_to: this.receiver?.source.address,
      correlation_id: correlationId,
      body,
    });

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

    this.asyncGroup.add(promise);

    return Promise.race([
      promise,
      (async () => {
        await delay(this.options.timeout);

        this.callbacks.delete(correlationId);

        throw new Error('Request timeout.');
      })(),
    ]);
  }

  public async start() {
    const [sender, receiver] = await Promise.all([
      openSender(this.connection, {
        target: {
          address: `queue://${this.queue}`,
          durable: 2,
          expiry_policy: 'never',
        },
      }),
      openReceiver(this.connection, {
        source: {
          address: `temp-queue://${this.queue}/${this.id}`,
          dynamic: true,
        },
      }),
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
  }

  public async stop() {
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
