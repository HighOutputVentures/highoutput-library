import Amqp, { Subscriber, Client } from '@highoutput/amqp';
import { EventEmitter } from 'events';
import Backoff from 'backoff';
import delay from '@highoutput/delay';
import { Event, Snapshot, ID } from '../types';
import { getAmqp } from '../util';

export type EventStoreClient = {
  createEvent(params: {
    type: string;
    body: any;
    aggregateId: ID;
    aggregateType: string;
    aggregateVersion: number;
    version: number;
  }): Promise<Event>;
  createSnapshot(params: {
    aggregateId: ID;
    aggregateType: string;
    aggregateVersion: number;
    state: any;
  }): Promise<Snapshot>;
  retrieveLatestSnapshot(params: {
    aggregateId: string;
    aggregateType: string;
    lastAggregateVersion?: number;
  }): Promise<Snapshot | null>;
  retrieveEvents(params: {
    first?: number;
    after?: Buffer;
  }): Promise<Event[]>;
  subscribe(params: {
    aggregateId?: string;
    aggregateType?: string;
    type?: string;
  }, handler: (ack: () => {}) => Promise<void>): Promise<void>;
}

export default class extends EventEmitter {
  private amqp: Amqp;

  private clientPromise: Promise<{
    (...args: any[]): Promise<any>;
    client: Client;
  }>;

  public readonly initialized: Promise<void>;

  constructor(
    options?: {
      amqp?: Amqp;
      address?: string;
    },
  ) {
    super();

    this.amqp = options?.amqp || getAmqp();

    this.clientPromise = this.amqp.createClient('EventStore', {
      deserialize: false,
      serialize: false,
    });

    this.initialized = this.start();
  }

  private async start() {
    const client = await this.clientPromise;

    const backoff = Backoff.fibonacci({
      initialDelay: 100,
      maxDelay: 10000,
      randomisationFactor: 0,
    });

    await new Promise(async (resolve) => {
      const checkServer = async () => {
        const available = await Promise.race([
          client({ type: 'Ping' }).then(() => true), // TODO: set message timeout time to 1 second
          delay('1s').then(() => false),
        ]);

        if (available) {
          return resolve();
        }

        backoff.backoff();
      }

      backoff.on('ready', checkServer);

      await checkServer();
    });
  }

  public async stop() {
    const { client } = await this.clientPromise;

    await client.stop();
  }
}