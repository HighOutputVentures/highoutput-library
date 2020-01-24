/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
import {
  Connection, EventContext, Receiver, Sender,
} from 'rhea';
import R from 'ramda';
import logger from './logger';

export type WorkerOptions = {
  concurrency: number;
  serialize: boolean;
  deserialize: boolean;
}

export default class Worker<TInput extends any[], TOutput> {
  private options: WorkerOptions;

  private senders: Record<string, Promise<Sender>> = {};

  private receiver: Receiver | null = null;

  public constructor(
    private readonly connection: Connection,
    private readonly scope: string,
    private readonly handler: (...args: TInput) => Promise<TOutput>,
    options?: Partial<WorkerOptions>,
  ) {
    this.options = R.mergeDeepRight(options || {}, {
      concurrency: 1,
      deserialize: true,
      serialize: true,
    });

    logger.tag('worker').info(this.options);
  }

  private async getSender(name: string) {
    let promise = this.senders[name];

    if (!promise) {
      promise = (async () => {
        const sender = this.connection.open_sender({
          name: this.scope,
          target: {
            address: '*',
          },
        });

        await new Promise((resolve) => {
          sender.once('sender_open', () => {
            resolve();
          });
        });

        return sender;
      })();

      this.senders[name] = promise;
    }

    return promise;
  }

  public async start() {
    this.receiver = this.connection.open_receiver({
      name: this.scope,
      source: {
        address: '*',
        durable: 2,
        expiry_policy: 'never',
      },
    });

    this.receiver.on('message', async (context: EventContext) => {
      logger.tag('message').info(context.message?.body);

      const sender = await this.getSender(context.message?.reply_to!);

      let result: TOutput | null = null;
      let error: Error | null = null;

      try {
        result = await this.handler(...context.message?.body.parameters);
      } catch (err) {
        error = err;
      }

      await sender.send({
        body: {
          result,
          error,
        },
      });
    });
  }
}
