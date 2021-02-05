import { Channel } from 'amqplib';
import { nanoid } from 'nanoid';
import R from 'ramda';
import AppError from '@highoutput/error';
import { deserialize, serialize } from '@highoutput/serialize';
import AsyncGroup from '@highoutput/async-group';
import delay from '@highoutput/delay';
import { ClientOptions, Receiver, Sender } from './types';
import baseLogger from './logger';
import { createReceiver, createSender, msSerializer } from './util';

const logger = baseLogger.tag(['client']);

export default class Client<TInput extends any[] = any[], TOutput = any> {
  private options: ClientOptions;

  private shutdown = false;

  private disconnected = false;

  private sender: Sender | undefined;

  private receiver: Receiver | undefined;

  private asyncGroup: AsyncGroup = new AsyncGroup();

  private initialize: Promise<void> | null = null;

  private receiverQueue: string;

  private queue: string;

  public readonly id: string = nanoid();

  private readonly callbacks = new Map<
    string,
    { resolve: (result: TOutput) => void; reject: (err: Error) => void }
  >();

  constructor(
    public channel: Channel,
    queue: string,
    options?: Partial<ClientOptions>,
  ) {
    this.queue = `queue://${queue}`;

    this.options = R.mergeDeepLeft(options || {}, {
      timeout: '30s',
      noResponse: false,
      deserialize: true,
      serialize: true,
    });

    this.receiverQueue = `temp-queue://${this.id}:${this.queue}`;

    logger.info(this.options);
  }

  public async send(...args: TInput): Promise<TOutput | null> {
    if (this.shutdown) {
      throw new AppError('CLIENT_ERROR', 'Client shutting down.');
    }

    if (!this.sender) {
      throw new AppError('CLIENT_ERROR', 'Client is offline.');
    }

    if (this.disconnected) {
      await this.start();
    }

    const correlationId = nanoid();
    const now = Date.now();

    try {
      const timeout = msSerializer(this.options.timeout);

      const body = {
        arguments: this.options.serialize ? serialize(args) : args,
        timestamp: now,
      };

      logger.tag(['request']).verbose(body);

      this.sender(
        {
          absolute_expiry_time: now + timeout,
          body,
        },
        {
          correlationId,
          replyTo: this.receiverQueue,
          expiration: msSerializer(this.options.timeout),
        },
      );
    } catch (err) {
      logger.warn(err);
    }

    if (this.options.noResponse) {
      return null;
    }

    const promise = new Promise<TOutput>((resolve, reject) => {
      this.callbacks.set(correlationId, {
        resolve: (result: TOutput) => {
          this.callbacks.delete(correlationId);
          resolve(result);
        },
        reject: (err: Error) => {
          this.callbacks.delete(correlationId);
          reject(err);
        },
      });
    });

    const promiseRace = Promise.race([
      promise,
      (async () => {
        await delay(this.options.timeout);

        this.callbacks.delete(correlationId);
        throw new AppError('TIMEOUT', 'Request timeout.');
      })(),
    ]);

    this.asyncGroup.add((async () => promiseRace)().catch(R.identity));

    return promiseRace;
  }

  public async start(): Promise<void> {
    if (this.initialize) {
      return this.initialize;
    }

    logger.tag(['start']).info('Initializing client...');
    this.initialize = (async () => {
      this.channel.on('close', () => {
        logger.tag(['channel', 'close']).info('Connection is close');
        this.disconnected = true;
        this.initialize = null;
      });

      this.channel.on('error', (err) => {
        logger.tag(['channel', 'error']).error(err);
        this.disconnected = true;
        this.initialize = null;
      });

      const [sender, receiver] = await Promise.all([
        createSender(this.channel, {
          queue: this.queue,
          options: { durable: true },
        }),
        createReceiver(this.channel, { queue: this.receiverQueue }),
      ]);

      this.sender = sender;
      this.receiver = receiver;

      this.receiver(async (msg) => {
        if (!msg) {
          logger.warn('Null message received.');
          return;
        }
        const message = JSON.parse(msg.content.toString());

        const callback = this.callbacks.get(msg.properties.correlationId);
        if (!callback) {
          return;
        }

        let { body } = message;

        body = {
          ...body,
          result: this.options.deserialize
            ? deserialize(body.result)
            : body.result,
        };

        logger.tag(['response']).verbose(body);

        if (body.error) {
          let error: AppError;
          const deserialized = deserialize(body.error);
          const meta = {
            ...R.omit(['id', 'name', 'message', 'stack', 'service'])(
              deserialized,
            ),
            original: deserialized,
          };
          if (body.error.name === 'AppError') {
            error = new AppError(body.error.code, body.error.message, meta);
          } else {
            error = new AppError('WORKER_ERROR', body.error.message, meta);
          }
          callback.reject(error);
          return;
        }
        callback.resolve(body.result);
      });

      this.initialize = null;
      this.disconnected = false;

      logger.tag(['start']).info('client initialized.');
    })();

    return this.initialize;
  }

  public async stop(): Promise<void> {
    this.shutdown = true;

    await this.asyncGroup.wait();

    await this.channel.close();
  }
}
