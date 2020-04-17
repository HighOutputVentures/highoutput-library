import Amqp, { Worker, Publisher } from '@highoutput/amqp';
import R from 'ramda';
import Cache from 'lru-cache';
import { EventStoreDatabaseAdapter, RequestType, Event } from '../types';
import { getAmqp, getDatabase } from '../util';
import baseLogger from '../logger';

const logger = baseLogger.tag(['event-store', 'server']);

export default class {
  private worker: Worker | null = null;

  private options: {
    concurrency: number;
    queue: string;
  };

  private amqp: Amqp;

  private database: EventStoreDatabaseAdapter;

  private publishers = new Cache<string, Promise<{
    (...args: any[]): void;
    publisher: Publisher;
  }>>({
    max: 1024,
    maxAge: 86400000
  })

  constructor(
    options?: {
      amqp?: Amqp;
      database?: EventStoreDatabaseAdapter;
      concurrency?: number;
      queue?: string;
    },
  ) {
    this.options = R.mergeDeepRight({
      concurrency: 10,
      queue: 'EventStore',
    }, R.omit(['amqp', 'database'], options || {}));

    this.amqp = options?.amqp || getAmqp();

    this.database = options?.database || getDatabase();
  }

  private async getPublisher(topic: string) {
    let promise = this.publishers.get(topic);

    if (!promise) {
      promise = this.amqp.createPublisher(topic);

      this.publishers.set(topic, promise);
    }

    return promise;
  }

  public async start() {
    this.worker = await this.amqp.createWorker(this.options.queue, async ({ type, data }: { type: RequestType; data?: any }) => {
      logger.verbose({ type, data });

      if (type === RequestType.Ping) {
        return 'Pong';
      }

      if (type === RequestType.SaveEvent) {
        const event = data as Event;
        
        await this.database.saveEvent(event);

        const publish = await this.getPublisher(`${data.aggregateType}.${data.type}`);
        publish(event);
      }

      if (type === RequestType.RetrieveLatestSnapshot) {
        return this.database.retrieveLatestSnapshot(data);
      }

      if (type === RequestType.RetrieveEvents) {
        return this.database.retrieveEvents(data);
      }
    }, {
      concurrency: this.options.concurrency
    });
  }

  public async stop() {
    if (this.worker) {
      await this.worker.stop();
    }

    await Promise.all(
      Array.from(this.publishers.values()).map(async (promise) => {
        const { publisher } = await promise;
        await publisher.stop();
      }),
    );
  }
}