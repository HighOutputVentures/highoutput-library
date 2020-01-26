/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Receiver, Connection, EventContext } from 'rhea';
import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import logger from './logger';
import { openReceiver, closeReceiver, deserialize } from './util';

export type SubscriberOptions = {
  concurrency: number;
  deserialize: boolean;
}

export default class Publisher<TInput extends any[]> {
  private options: SubscriberOptions;

  private receiver: Receiver | null = null;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  public constructor(
    private readonly connection: Connection,
    private readonly topic: string,
    private readonly handler: (...args: TInput) => Promise<void>,
    options?: Partial<SubscriberOptions>,
  ) {
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
        dynamic: true,
      },
    });

    this.receiver.on('message', async (context: EventContext) => {
      await this.asyncGroup.add(this.handleMessage(context));
      context.delivery!.accept();
      context.receiver!.add_credit(1);
    });

    this.receiver.add_credit(this.options.concurrency);
  }

  public async stop() {
    if (this.receiver && this.receiver.is_open()) {
      await closeReceiver(this.receiver);
    }

    await this.asyncGroup.wait();
  }
}
