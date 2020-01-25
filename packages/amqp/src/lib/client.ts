/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-non-null-assertion */
import {
  Connection, Sender, Receiver, EventContext,
} from 'rhea';
import R from 'ramda';
import uuid from 'uuid/v4';
import delay from '@highoutput/delay';
import AsyncGroup from '@highoutput/async-group';
import AppError from '@highoutput/error';
import logger from './logger';

export type ClientOptions = {
  timeout: string;
  noResponse: boolean;
  deserialize: boolean;
  serialize: boolean;
}

export default class Client<TInput extends any[] = any[], TOutput = any> {
  private options: ClientOptions;

  private sender: Sender | null = null;

  private receiver: Receiver | null = null;

  private id: string = uuid();

  private readonly callbacks = new Map<string, { resolve: Function; reject: Function }>();

  private asyncGroup: AsyncGroup = new AsyncGroup();

  public constructor(
    private readonly connection: Connection,
    private readonly scope: string,
    options?: Partial<ClientOptions>,
  ) {
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

    this.sender.send({
      reply_to: this.receiver?.source.address,
      correlation_id: correlationId,
      body: {
        parameters: args,
      },
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
    this.sender = this.connection.open_sender({
      target: {
        address: this.scope,
      },
    });

    this.sender.on('sender_error', (context: EventContext) => {
      logger.tag('client').error(context.error?.message!);
    });

    this.receiver = this.connection.open_receiver({
      source: {
        address: `${this.scope}:${this.id}`,
        dynamic: true,
      },
    });

    this.receiver.on('message', (context: EventContext) => {
      const body = context.message?.body;
      logger.tag(['client', 'message']).info(body);

      const callback = this.callbacks.get(context.message?.correlation_id as string);

      if (!callback) {
        return;
      }

      if (body.error) {
        let error: AppError;

        if (body.error.name === 'AppError') {
          error = new AppError(body.error.code, body.error.message, {
            original: body.error,
          });
        } else {
          error = new AppError('WORKER_ERROR', body.error.message, {
            original: body.error,
          });
        }

        callback.reject(error);
        return;
      }

      callback.resolve(body.result);
    });

    await Promise.all([
      new Promise((resolve) => {
        this.sender!.once('sender_open', () => {
          resolve();
        });
      }),
      new Promise((resolve) => {
        this.receiver!.once('receiver_open', () => {
          resolve();
        });
      }),
    ]);
  }

  public async stop() {
    if (this.sender && this.sender.is_open()) {
      this.sender.close();

      await new Promise((resolve) => {
        this.connection.once('sender_close', resolve);
      });
    }

    await this.asyncGroup.wait();

    if (this.receiver && this.receiver.is_open()) {
      this.receiver.close();

      await new Promise((resolve) => {
        this.connection.once('receiver_close', resolve);
      });
    }
  }
}
