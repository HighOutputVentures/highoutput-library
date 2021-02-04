import { nanoid } from 'nanoid';
import AsyncGroup from '@highoutput/async-group';
import { deserialize, serialize } from '@highoutput/serialize';
import { serializeError } from 'serialize-error';
import { Channel, ConsumeMessage } from 'amqplib';
import R from 'ramda';
import baseLogger from './logger';
import { Receiver, Sender, WorkerOptions } from './types';
import { createReceiver, createSender } from './util';

const logger = baseLogger.tag(['worker']);

export default class Worker<TInput extends any[] = any[], TOutput = any> {
  private options: WorkerOptions;

  private receiver: Receiver | undefined;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  private initialize: Promise<void> | null = null;

  public readonly id: string = nanoid();

  private shutdown = false;

  private senders: Map<string, Sender> = new Map();

  public constructor(
    public channel: Channel,
    private readonly queue: string,
    private readonly handler: (...args: TInput) => Promise<TOutput>,
    options?: Partial<WorkerOptions>,
  ) {
    this.options = R.mergeDeepLeft(options || {}, {
      concurrency: 1,
      deserialize: true,
      serialize: true,
    });

    logger.info(this.options);
  }

  private async getSender(address: string): Promise<Sender> {
    if (!this.senders.get(address)) {
      const sender = await createSender(this.channel, {
        queue: address,
        options: { durable: true },
      });
      this.senders.set(address, sender);
    }

    return this.senders.get(address) as Sender;
  }

  private async handleMessage(msg: ConsumeMessage): Promise<void> {
    const message = JSON.parse(msg.content.toString());

    const { body } = message;
    const request = {
      ...body,
      arguments: this.options.deserialize
        ? deserialize(body.arguments)
        : body.arguments,
    };

    logger.tag(['request']).verbose(request);

    let result: TOutput | null = null;
    let error: Record<string, any> | null = null;

    try {
      result = await this.handler(...request.arguments);
    } catch (err) {
      error = serialize(serializeError(err));
    }

    if (msg.properties.replyTo) {
      const response = {
        correlationId: message.correlation_id,
        result: this.options.serialize ? serialize(result) : result,
        error,
        timestamp: Date.now(),
      };

      const sender = await this.getSender(msg.properties.replyTo);

      try {
        sender(
          {
            body: response,
          },
          {
            correlationId: msg.properties.correlationId,
          },
        );
      } catch (err) {
        logger.tag('worker').warn(err);
      }
    }
  }

  public async start(): Promise<void> {
    if (this.initialize) {
      return this.initialize;
    }

    this.initialize = (async () => {
      this.channel.on('close', () => {
        logger.tag(['channel', 'close']).info('Connection is close');
        this.initialize = null;
        this.senders.clear();
      });

      this.channel.on('error', (err) => {
        logger.tag(['channel', 'error']).error(err);
        this.initialize = null;
        this.senders.clear();
      });

      this.receiver = await createReceiver(this.channel, {
        queue: `queue://${this.queue}`,
        concurrency: this.options.concurrency,
      });

      this.receiver(async (msg) => {
        if (!msg) {
          logger.warn('No message received.');
          return;
        }
        if (this.shutdown) {
          logger.warn('worker shutdown');
          return;
        }

        const message = JSON.parse(msg.content.toString());

        if (!message) {
          logger.warn('no message');
          return;
        }
        const now = Date.now();

        if (
          message.absolute_expiry_time &&
          now > message.absolute_expiry_time
        ) {
          logger.tag(['message']).verbose('received an expired message.');
        }

        await this.asyncGroup.add(
          this.handleMessage(msg).catch((err) => logger.warn(err)),
        );

        this.initialize = null;
      });
    })();

    return this.initialize;
  }

  public async stop(): Promise<void> {
    this.shutdown = true;

    await this.asyncGroup.wait();

    this.senders.clear();

    await this.channel.close();
  }
}
