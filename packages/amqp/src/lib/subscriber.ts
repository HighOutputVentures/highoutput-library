/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-non-null-assertion  */
import { Receiver, Connection, EventContext } from 'rhea';
import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import { EventEmitter } from 'events';
import logger from './logger';
import { openReceiver, closeReceiver, deserialize } from './util';

export type SubscriberOptions = {
  concurrency: number;
  deserialize: boolean;
}

export default class Subscriber<TInput extends any[] = any[]> extends EventEmitter {
  private options: SubscriberOptions;

  private receiver: Receiver | null = null;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  private initialize: Promise<void> | null = null;

  private disconnected = false;

  private shutdown = false;

  public constructor(
    private readonly connection: Connection,
    private readonly topic: string,
    private readonly handler: (...args: TInput) => Promise<void>,
    options?: Partial<SubscriberOptions>,
  ) {
    super();

    this.options = R.mergeDeepLeft(options || {}, {
      concurrency: 1,
      deserialize: true,
    });

    this.connection.on('disconnected', () => {
      logger.tag(['subscriber', 'connection', 'disconnected']).tag('Connection is disconnected.');
      this.disconnected = true;
    });

    this.connection.on('connection_close', () => {
      logger.tag(['subscriber', 'connection', 'connection_close']).tag('Connection is closed.');
      this.disconnected = true;
    });

    logger.tag('subscriber').info(this.options);
  }

  private async handleMessage(context: EventContext) {
    const { message } = context;

    if (!message) {
      return;
    }

    const body = {
      ...message.body,
      arguments: this.options.deserialize ? deserialize(message.body.arguments) : message.body.arguments,
    };

    logger.tag(['subscriber', 'request']).info(body);

    try {
      await this.handler(...body.arguments);
    } catch (err) {
      logger.tag('subscriber').warn(err);
    }
  }

  public async start() {
    if (this.initialize) {
      return this.initialize;
    }

    logger.tag(['subscriber', 'start']).info('Initializing subscriber...');

    const connect = async () => {
      this.receiver = await openReceiver(this.connection, {
        source: {
          address: `topic://${this.topic}`,
        },
        credit_window: 0,
        autoaccept: true,
      });

      this.receiver.on('message', async (context: EventContext) => {
        if (this.shutdown) {
          context.delivery?.release({ delivery_failed: false });
          return;
        }

        await this.asyncGroup.add(this.handleMessage(context).catch((err) => logger.tag('subscriber').warn(err)));

        if (!this.shutdown) {
          context.receiver!.add_credit(1);
        }
      });

      this.receiver.add_credit(this.options.concurrency);
      this.emit('start');
    };

    this.initialize = (async () => {
      await connect();

      this.connection.on('connection_open', async () => {
        if (!this.disconnected || this.shutdown) {
          return;
        }

        await connect();
        this.disconnected = false;
        logger.tag(['subscriber', 'start']).info('Subscriber initialized.');
      });
    })();

    return this.initialize;
  }

  public async stop() {
    this.shutdown = true;

    await this.asyncGroup.wait();

    if (this.receiver && this.receiver.is_open()) {
      await closeReceiver(this.receiver);
    }

    this.emit('stop');
  }
}
