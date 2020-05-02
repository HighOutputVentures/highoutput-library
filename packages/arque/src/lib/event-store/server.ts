// import { Publisher } from '@highoutput/amqp';
// import Cache from 'lru-cache';
import {
  Event,
  EventStoreDatabaseAdapter,
  RequestType,
  ConnectionAdapter,
  ConnectionAdapterWorker,
  Snapshot,
} from '../types';
import { getDatabase, getConnection } from '../util';
import baseLogger from '../logger';

const logger = baseLogger.tag(['event-store', 'server']);

export default class {
  private worker: ConnectionAdapterWorker | null = null;

  private options: {
    connection: ConnectionAdapter;
    concurrency: number;
    database: EventStoreDatabaseAdapter;
    address: string;
  };

  // private publishers = new Cache<string, Promise<{
  //   (...args: any[]): void;
  //   publisher: Publisher;
  // }>>({
  //   max: 1024,
  //   maxAge: 86400000
  // });

  constructor(
    options?: {
      connection?: ConnectionAdapter;
      concurrency?: number;
      database?: EventStoreDatabaseAdapter;
      address?: string;
    },
  ) {
    this.options = {
      connection: options?.connection || getConnection(),
      concurrency: options?.concurrency || 100,
      database: options?.database || getDatabase(),
      address: options?.address || 'EventStore',
    }
  }

  // private async getPublisher(topic: string) {
  //   let promise = this.publishers.get(topic);

  //   if (!promise) {
  //     promise = this.amqp.createPublisher(topic);

  //     this.publishers.set(topic, promise);
  //   }

  //   return promise;
  // }

  public async start() {
    this.worker = await this.options.connection.createWorker(this.options.address, async ({ type, data }: { type: RequestType; data?: any }) => {
      logger.verbose({ type, data });

      if (type === RequestType.Ping) {
        return 'Pong';
      }

      if (type === RequestType.SaveEvent) {
        const event = data as Event;
        
        await this.options.database.saveEvent(event);

        // const publish = await this.getPublisher(`${data.aggregateType}.${data.type}`);
        // publish(event);
      }

      if (type === RequestType.SaveSnapshot) {
        const snapshot = data as Snapshot;
        
        await this.options.database.saveSnapshot(snapshot);

        // const publish = await this.getPublisher(`${data.aggregateType}.${data.type}`);
        // publish(event);
      }

      // if (type === RequestType.RetrieveLatestSnapshot) {
      //   return this.database.retrieveLatestSnapshot(data);
      // }

      // if (type === RequestType.RetrieveEvents) {
      //   return this.database.retrieveEvents(data);
      // }
    }, {
      concurrency: this.options.concurrency
    });
  }

  public async stop() {
    if (this.worker) {
      await this.worker.stop();
    }

    // await Promise.all(
    //   Array.from(this.publishers.values()).map(async (promise) => {
    //     const { publisher } = await promise;
    //     await publisher.stop();
    //   }),
    // );
  }
}