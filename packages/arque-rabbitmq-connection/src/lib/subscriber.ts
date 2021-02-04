import { Channel, ConsumeMessage } from 'amqplib';
import * as R from 'ramda';
import { deserialize } from '@highoutput/serialize';
import AsyncGroup from '@highoutput/async-group';

import { nanoid } from 'nanoid';
import baseLogger from './logger';
import { Receiver } from './types';
import { createSubscriber } from './util';

const logger = baseLogger.tag(['publisher']);

export type SubscriberOptions = {
  concurrency: number;
  deserialize: boolean;
};

export default class Subscriber<TInput extends any[] = any[]> {
  private options: SubscriberOptions;

  private receiver?: Receiver;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  private initialize: Promise<void> | null = null;

  private shutdown = false;

  public readonly id: string = nanoid();

  public constructor(
    private channel: Channel,
    private readonly exchange: string,
    private readonly topic: string,
    private readonly handler: (...args: TInput) => Promise<void>,
    options?: Partial<SubscriberOptions>,
  ) {
    this.options = R.mergeDeepLeft(options || {}, {
      concurrency: 1,
      deserialize: true,
    });

    logger.info(this.options);
  }

  private async handleMessage(msg: ConsumeMessage) {
    const message = JSON.parse(msg.content.toString());

    let { body } = message;

    body = {
      ...body,
      arguments: this.options.deserialize
        ? deserialize(body.arguments)
        : body.arguments,
    };

    logger.tag(['subscriber', 'request']).verbose(body);

    try {
      await this.handler(...body.arguments);
    } catch (err) {
      logger.tag('subscriber').warn(err);
    }
  }

  public async start(): Promise<void> {
    if (this.initialize) {
      return this.initialize;
    }

    logger.tag(['start']).info('Initializing subscriber...');

    this.initialize = (async () => {
      this.channel.on('close', () => {
        logger.tag(['channel', 'close']).info('Connection is close');
        this.initialize = null;
      });

      this.channel.on('error', (err) => {
        logger.tag(['channel', 'error']).error(err);
        this.initialize = null;
      });

      this.receiver = await createSubscriber(this.channel, {
        topic: `topic://${this.topic}`,
        exchange: this.exchange,
        concurrency: this.options.concurrency,
      });

      this.receiver(async (msg) => {
        if (!msg) {
          logger.warn('no message received.');
          return;
        }

        if (this.shutdown) {
          logger.warn('subscriber shutdown');
          return;
        }

        await this.asyncGroup.add(
          this.handleMessage(msg).catch((err) => logger.warn(err)),
        );
      });

      this.initialize = null;

      logger.tag(['start']).info('subscriber initialized.');
    })();

    return this.initialize;
  }

  public async stop(): Promise<void> {
    this.shutdown = true;

    await this.asyncGroup.wait();

    await this.channel.close();
  }
}
