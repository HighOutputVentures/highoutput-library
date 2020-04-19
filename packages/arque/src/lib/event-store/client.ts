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

  private client?: {
    (...args: any[]): Promise<any>;
    client: Client;
  };

  public readonly initialized: Promise<void>;

  constructor(
    options?: {
      amqp?: Amqp;
      address?: string;
    },
  ) {
    super();

    this.amqp = options?.amqp || getAmqp();

    this.initialized = this.start();
  }

  private async start() {
    const client = await this.amqp.createClient('EventStore', {
      deserialize: false,
      serialize: false,
    });

    this.client = client;

    const backoff = Backoff.fibonacci({
      initialDelay: 100,
      maxDelay: 10000,
      randomisationFactor: 0,
    });

    const checkServer = async () => {
      return Promise.race([
        client({ type: 'Ping' }).then(() => true),
        delay('1s').then(() => false),
      ]);
    };

    await new Promise(async (resolve) => {
      if (!(await checkServer())) {
        backoff.on('ready', async () => {
          if (await checkServer()) {
            return resolve();
          }

          backoff.backoff();

          return null;
        });

        backoff.backoff();
      } else {
        resolve();
      }
    });
  }
}