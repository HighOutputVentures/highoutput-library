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
    this.receiver = await openReceiver(this.connection, {
      source: {
        address: `topic://${this.topic}`,
      },
      credit_window: 0,
      autoaccept: false,
    });

    this.receiver.on('message', async (context: EventContext) => {
      await this.asyncGroup.add(this.handleMessage(context));
      context.delivery!.accept();
      context.receiver!.add_credit(1);
    });

    this.receiver.add_credit(this.options.concurrency);

    this.emit('start');
  }

  public async stop() {
    if (this.receiver && this.receiver.is_open()) {
      await closeReceiver(this.receiver);
    }

    await this.asyncGroup.wait();

    this.emit('stop');
  }
}
