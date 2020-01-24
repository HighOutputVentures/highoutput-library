/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Connection, Sender, Receiver, EventContext,
} from 'rhea';
import R from 'ramda';
import uuid from 'uuid/v4';
import delay from '@highoutput/delay';
import logger from './logger';

export type ClientOptions = {
  timeout: string;
  noResponse: boolean;
  deserialize: boolean;
  serialize: boolean;
}

export default class Client<TInput extends any[], TOutput> {
  private options: ClientOptions;

  private sender: Sender | null = null;

  private receiver: Receiver | null = null;

  private id: string = uuid();

  private readonly callbacks = new Map<string, { resolve: Function; reject: Function }>();

  public constructor(
    private readonly connection: Connection,
    private readonly scope: string,
    options?: Partial<ClientOptions>,
  ) {
    this.options = R.mergeDeepRight(options || {}, {
      timeout: '30s',
      noResponse: false,
      deserialize: true,
      serialize: true,
    });

    logger.tag('client').info(this.options);
  }

  public async start() {
    this.sender = this.connection.open_sender({
      name: this.scope,
      target: {
        address: '*',
      },
    });

    this.sender.on('sender_error', (context: EventContext) => {
      logger.tag('client').error(context.error?.message!);
    });

    this.receiver = this.connection.open_receiver({
      name: `${this.scope}:${this.id}`,
      source: {
        address: '*',
        dynamic: true,
      },
    });

    this.receiver.on('message', (context: EventContext) => {
      logger.tag('message').info(context.message?.body);
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

  public async send(...args: TInput): Promise<TOutput | null> {
    if (this.sender!.is_closed()) {
      throw new Error('Sender is closed.');
    }

    const correlationId = uuid();

    this.sender!.send({
      reply_to: `${this.scope}:${this.id}`,
      correlation_id: correlationId,
      body: {
        parameters: args,
      },
    });

    if (this.options.noResponse) {
      return null;
    }

    const promise = new Promise<TOutput>((resolve, reject) => {
      this.callbacks.set(correlationId, { resolve, reject });
    });

    return Promise.race([
      promise,
      (async () => {
        await delay('1m');

        this.callbacks.delete(correlationId);

        throw new Error('Request timeout.');
      })(),
    ]);
  }
}
