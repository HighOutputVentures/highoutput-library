/* eslint-disable @typescript-eslint/camelcase */
import { Connection, Sender } from 'rhea';
import R from 'ramda';
import { EventEmitter } from 'events';
import AppError from '@highoutput/error';
import logger from './logger';
import { openSender, closeSender, serialize } from './util';

export type PublisherOptions = {
  serialize: boolean;
};

export default class Publisher<
  TInput extends any[] = any[]
> extends EventEmitter {
  private options: PublisherOptions;

  private sender: Sender | null = null;

  private initialize: Promise<void> | null = null;

  private disconnected = false;

  private shutdown = false;

  public constructor(
    private readonly connection: Connection,
    private readonly topic: string,
    options?: Partial<PublisherOptions>
  ) {
    super();

    this.options = R.mergeDeepLeft(options || {}, {
      serialize: true,
    });

    this.connection.on('disconnected', () => {
      logger
        .tag(['publisher', 'connection', 'disconnected'])
        .tag('Connection is disconnected.');
      this.disconnected = true;
    });

    this.connection.on('connection_close', () => {
      logger
        .tag(['publisher', 'connection', 'connection_close'])
        .tag('Connection is closed.');
      this.disconnected = true;
    });

    logger.tag('publisher').info(this.options);
  }

  public async send(...args: TInput) {
    if (this.shutdown) {
      throw new AppError('PUBLISHER_ERROR', 'Publisher shutting down.');
    }

    if (this.disconnected) {
      await this.start();
    }

    const stringifyArgs = JSON.stringify(
      this.options.serialize ? serialize(args) : args
    );

    const body = {
      arguments: stringifyArgs,
      timestamp: Date.now(),
    };

    logger.tag(['publisher', 'request']).verbose(body);

    if (!this.sender || this.sender.is_closed()) {
      throw new AppError(
        'PUBLISHER_ERROR',
        'Publisher sender is on invalid state.'
      );
    }

    try {
      this.sender.send({
        body,
      });
    } catch (err) {
      logger.tag('publisher').warn(err);
    }
  }

  public async start() {
    if (this.initialize) {
      return this.initialize;
    }

    logger.tag(['publisher', 'start']).info('Initializing publisher...');

    this.initialize = (async () => {
      this.sender = await openSender(this.connection, {
        target: {
          address: `topic://${this.topic}`,
        },
      });

      this.emit('start');
      this.disconnected = false;
      this.initialize = null;

      logger.tag(['publisher', 'start']).info('Publisher initialized.');
    })();

    return this.initialize;
  }

  public async stop() {
    this.shutdown = true;

    if (this.sender && this.sender.is_open()) {
      await closeSender(this.sender);
    }

    this.emit('stop');
  }
}
