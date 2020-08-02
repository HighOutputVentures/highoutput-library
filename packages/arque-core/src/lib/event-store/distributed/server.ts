import Cache from 'lru-cache';
import AppError from '@highoutput/error';
import {
  Event,
  EventStoreDatabase,
  Connection,
  ConnectionWorker,
  ConnectionPublisher,
} from '@arque/types';
import { RequestType } from './lib';
import getConnection from '../../util/get-connection';
import baseLogger from '../../logger';
import MemoryEventStoreDatabase from '../database/memory';

const logger = baseLogger.tag(['EventStore', 'server']);

export default class {
  private worker: ConnectionWorker | null = null;

  public readonly connection: Connection;

  public readonly database: EventStoreDatabase;

  private options: {
    concurrency: number;
    address: string;
  };

  private publishers = new Cache<string, Promise<ConnectionPublisher>>({
    max: 1024,
    maxAge: 86400000,
  });

  constructor(
    options?: {
      connection?: Connection;
      database?: EventStoreDatabase;
      concurrency?: number;
      address?: string;
    },
  ) {
    this.options = {
      concurrency: options?.concurrency || 100,
      address: options?.address || 'EventStore',
    };

    this.connection = options?.connection || getConnection();
    this.database = options?.database || new MemoryEventStoreDatabase();
  }

  private async getPublisher(topic: string) {
    let promise = this.publishers.get(topic);

    if (!promise) {
      promise = this.connection.createPublisher(topic);

      this.publishers.set(topic, promise);
    }

    return promise;
  }

  public async start() {
    this.worker = await this.connection.createWorker(
      this.options.address,
      async ({ type, data }: { type: RequestType; data?: any }) => {
        logger.verbose({ type, data });
        if (type === RequestType.Ping) {
          return 'Pong';
        }

        if (type === RequestType.SaveEvent) {
          const event = data as Event;

          await this.database.saveEvent(event);

          const topic = `${event.aggregate.type}.${event.type}.${event.version}`;
          const publisher = await this.getPublisher(topic);
          await publisher(event);

          return true;
        }

        if (type === RequestType.RetrieveAggregateEvents) {
          return this.database.retrieveAggregateEvents(data);
        }

        if (type === RequestType.RetrieveEvents) {
          return this.database.retrieveEvents(data);
        }

        throw new AppError('INVALID_OPERATION', `${type} is not supported.`);
      }, {
        concurrency: this.options.concurrency,
      },
    );
  }

  public async stop() {
    if (this.worker) {
      await this.worker.stop();
    }

    await Promise.all(
      Array.from(this.publishers.values()).map(async (promise) => {
        const publisher = await promise;
        await publisher.stop();
      }),
    );
  }
}
