/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/camelcase */
import {
  Connection, EventContext, Receiver, Sender,
} from 'rhea';
import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import { serializeError } from 'serialize-error';
import { EventEmitter } from 'events';
import logger from './logger';
import {
  serialize, deserialize, closeReceiver, closeSender, openSender, openReceiver,
} from './util';

export type WorkerOptions = {
  concurrency: number;
  serialize: boolean;
  deserialize: boolean;
}

export default class Worker<TInput extends any[] = any[], TOutput = any> extends EventEmitter {
  private options: WorkerOptions;

  private senders: Map<string, Promise<Sender>> = new Map();

  private receiver: Receiver | null = null;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  public constructor(
    private readonly connection: Connection,
    private readonly queue: string,
    private readonly handler: (...args: TInput) => Promise<TOutput>,
    options?: Partial<WorkerOptions>,
  ) {
    super();

    this.options = R.mergeDeepLeft(options || {}, {
      concurrency: 1,
      deserialize: true,
      serialize: true,
    });

    logger.tag('worker').info(this.options);
  }

  private async getSender(address: string) {
    let promise = this.senders.get(address);

    if (!promise) {
      promise = openSender(this.connection, {
        target: {
          address,
        },
      });

      this.senders.set(address, promise);
    }

    return promise;
  }

  private async handleMessage(context: EventContext) {
    const { message } = context;

    if (!message) {
      return;
    }

    const request = {
      ...message.body,
      arguments: this.options.deserialize ? deserialize(message.body.arguments) : message.body.arguments,
    };

    logger.tag(['worker', 'request']).info(request);

    let result: TOutput | null = null;
    let error: Record<string, any> | null = null;

    try {
      result = await this.handler(...request.arguments);
    } catch (err) {
      error = serialize(serializeError(err));
    }

    if (message.reply_to) {
      const response = {
        correlationId: message.correlation_id,
        result: this.options.serialize ? serialize(result) : result,
        error,
        timestamp: Date.now(),
      };

      logger.tag(['worker', 'response']).info(response);

      const sender = await this.getSender(message.reply_to!);

      try {
        sender.send({
          correlation_id: message.correlation_id,
          body: response,
        });
      } catch (err) {
        logger.tag('worker').warn(err);
      }
    }
  }

  public async start() {
    this.receiver = await openReceiver(this.connection, {
      source: {
        address: `queue://${this.queue}`,
        durable: 2,
        expiry_policy: 'never',
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

    await Promise.all(Array.from(this.senders.values()).map(async (promise) => {
      const sender = await promise;

      if (sender.is_open()) {
        await closeSender(sender);
      }
    }));

    this.senders.clear();

    this.emit('stop');
  }
}
