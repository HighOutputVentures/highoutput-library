import {
  Connection, Sender,
} from 'rhea';
import R from 'ramda';
import logger from './logger';
import { openSender, closeSender, serialize } from './util';

export type PublisherOptions = {
  serialize: boolean;
}

export default class Publisher<TInput extends any[]> {
  private options: PublisherOptions;

  private sender: Sender | null = null;

  public constructor(
    private readonly connection: Connection,
    private readonly topic: string,
    options?: Partial<PublisherOptions>,
  ) {
    this.options = R.mergeDeepLeft(options || {}, {
      serialize: true,
    });

    logger.tag('publisher').info(this.options);
  }

  public send(...args: TInput) {
    if (!this.sender || this.sender.is_closed()) {
      throw new Error('Sender is closed.');
    }

    const body = {
      arguments: this.options.serialize ? serialize(args) : args,
      timestamp: Date.now(),
    };

    logger.tag(['publisher', 'request']).verbose(body);

    this.sender.send({
      body,
    });
  }

  public async start() {
    this.sender = await openSender(this.connection, {
      target: {
        address: `topic://${this.topic}`,
      },
    });
  }

  public async stop() {
    if (this.sender && this.sender.is_open()) {
      await closeSender(this.sender);
    }
  }
}
