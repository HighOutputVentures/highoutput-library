import { Channel } from 'amqplib';
import * as R from 'ramda';
import AppError from '@highoutput/error';
import { serialize } from '@highoutput/serialize';
import { nanoid } from 'nanoid';
import baseLogger from './logger';
import { Sender, PublisherOptions } from './types';
import { createPublisher } from './util';

const logger = baseLogger.tag(['publisher']);

export default class Publisher<TInput extends any[] = any[]> {
  private options: PublisherOptions;

  private disconnected = false;

  private initialize: Promise<void> | null = null;

  private sender?: Sender;

  private shutdown = false;

  public readonly id: string = nanoid();

  public constructor(
    public channel: Channel,
    private readonly exchange: string,
    private readonly topic: string,
    options?: Partial<PublisherOptions>,
  ) {
    this.options = R.mergeDeepLeft(options || {}, {
      serialize: true,
    });

    logger.info(this.options);
  }

  public async send(...args: TInput): Promise<void> {
    if (this.shutdown) {
      throw new AppError('PUBLISHER_ERROR', 'Publisher shutting down.');
    }

    if (!this.sender) {
      throw new AppError('PUBLISHER_IS_OFFLINE', 'Publisher is offline');
    }

    if (this.disconnected) {
      await this.start();
    }

    const body = {
      arguments: this.options.serialize ? serialize(args) : args,
      timestamp: Date.now(),
    };

    logger.tag(['request']).verbose(body);

    try {
      this.sender({
        body,
      });
    } catch (err) {
      logger.warn(err);
    }
  }

  public async start(): Promise<void> {
    if (this.initialize) {
      return this.initialize;
    }

    logger.tag(['start']).info('initializing publisher...');

    this.initialize = (async () => {
      this.channel.on('close', () => {
        logger.tag(['channel', 'close']).info('connection is close');
        this.disconnected = true;
        this.initialize = null;
      });

      this.channel.on('error', (err) => {
        logger.tag(['channel', 'error']).error(err);
        this.disconnected = true;
        this.initialize = null;
      });

      this.sender = await createPublisher(this.channel, {
        topic: `topic://${this.topic}`,
        exchange: this.exchange,
      });

      this.disconnected = false;
      this.initialize = null;

      logger.tag(['start']).info('publisher initialized.');
    })();

    return this.initialize;
  }

  public async stop(): Promise<void> {
    this.shutdown = true;
    await this.channel.close();
  }
}
