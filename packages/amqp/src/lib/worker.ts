/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/camelcase */
import { Connection, EventContext, Receiver, Sender } from 'rhea';
import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import { serializeError } from 'serialize-error';
import { EventEmitter } from 'events';
import logger from './logger';
import {
  serialize,
  deserialize,
  closeReceiver,
  closeSender,
  openSender,
  openReceiver,
} from './util';

export type WorkerOptions = {
  concurrency: number;
  serialize: boolean;
  deserialize: boolean;
};

export default class Worker<
  TInput extends any[] = any[],
  TOutput = any
> extends EventEmitter {
  private options: WorkerOptions;

  private senders: Map<string, Promise<Sender>> = new Map();

  private receiver: Receiver | null = null;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  private initialize: Promise<void> | null = null;

  private disconnected = false;

  private shutdown = false;

  public constructor(
    private readonly connection: Connection,
    private readonly queue: string,
    private readonly handler: (...args: TInput) => Promise<TOutput>,
    options?: Partial<WorkerOptions>
  ) {
    super();

    this.options = R.mergeDeepLeft(options || {}, {
      concurrency: 1,
      deserialize: true,
      serialize: true,
    });

    this.connection.on('disconnected', () => {
      logger
        .tag(['worker', 'connection', 'disconnected'])
        .tag('Connection is disconnected.');
      this.disconnected = true;
    });

    this.connection.on('connection_close', () => {
      logger
        .tag(['worker', 'connection', 'connection_close'])
        .tag('Connection is closed.');
      this.disconnected = true;
    });

    logger.tag('worker').info(this.options);
  }

  private async getSender(address: string) {
    let promise = this.senders.get(address);

    if (promise && (await promise).is_closed()) {
      this.senders.delete(address);
      promise = undefined;
    }

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

    const parseArgs = JSON.parse(message.body.arguments);

    const request = {
      ...message.body,
      arguments: this.options.deserialize ? deserialize(parseArgs) : parseArgs,
    };

    logger.tag(['worker', 'request']).verbose(request);

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

      logger.tag(['worker', 'response']).verbose(response);

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
    if (this.initialize) {
      return this.initialize;
    }

    const connect = async () => {
      this.receiver = await openReceiver(this.connection, {
        source: {
          address: `queue://${this.queue}`,
          durable: 2,
          expiry_policy: 'never',
        },
        credit_window: 0,
        autoaccept: true,
      });

      this.receiver.on('message', async (context: EventContext) => {
        if (this.shutdown) {
          context.delivery?.release({ delivery_failed: false });
          return;
        }
        const { message } = context;
        if (!message) {
          return;
        }

        const now = Date.now();
        // message already expired, no need to process this
        if (
          message.absolute_expiry_time &&
          now > message.absolute_expiry_time
        ) {
          logger
            .tag(['worker', 'message'])
            .verbose('received an expired message.');
          if (!this.shutdown) {
            context.receiver!.add_credit(1);
          }
          return;
        }

        await this.asyncGroup.add(
          this.handleMessage(context).catch((err) =>
            logger.tag('worker').warn(err)
          )
        );

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

    await Promise.all(
      Array.from(this.senders.values()).map(async (promise) => {
        const sender = await promise;

        if (sender.is_open()) {
          await closeSender(sender);
        }
      })
    );

    this.senders.clear();

    this.emit('stop');
  }
}
