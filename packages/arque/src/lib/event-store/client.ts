import { EventEmitter } from 'events';
import Backoff from 'backoff';
import delay from '@highoutput/delay';
import {
  Connection, ConnectionClient, ID, RequestType, Event, Snapshot,
} from '../types';
import getConnection from '../util/get-connection';
import generateId from '../util/generate-id';

export default class extends EventEmitter {
  private client: Promise<ConnectionClient>;

  public readonly initialized: Promise<void>;

  private options: {
    connection: Connection;
    address: string;
    timeout: string | number;
  }

  constructor(
    options?: {
      connection?: Connection;
      address?: string;
      timeout?: string | number;
    },
  ) {
    super();

    this.options = {
      connection: options?.connection || getConnection(),
      address: options?.address || 'EventStore',
      timeout: options?.timeout || '60s',
    };

    this.client = this.options.connection.createClient(
      this.options.address,
      { timeout: this.options.timeout },
    );

    this.initialized = this.start();
  }

  generateEvent(params: Omit<Event, 'id' | 'timestamp'>): Event {
    const timestamp = new Date();

    return {
      ...params,
      id: generateId(timestamp),
      timestamp,
    };
  }

  async saveEvent(event: Event): Promise<void> {
    const client = await this.client;

    await client({
      type: RequestType.SaveEvent,
      data: event,
    });
  }

  async createEvent(params: Omit<Event, 'id' | 'timestamp'>): Promise<Event> {
    const event = this.generateEvent(params);

    await this.saveEvent(event);

    return event;
  }

  async createSnapshot(params: {
    aggregateId: ID;
    aggregateType: string;
    aggregateVersion: number;
    state: any;
  }): Promise<Snapshot> {
    const client = await this.client;

    const timestamp = new Date();
    const id = generateId(timestamp);

    const snapshot = {
      ...params,
      id,
      timestamp,
    };

    await client({
      type: RequestType.SaveSnapshot,
      data: snapshot,
    });

    return snapshot;
  }

  public async retrieveEvents(params: {
    first?: number;
    after?: number;
    filters: {
      aggregateType: string;
      type?: string;
    }[];
  }): Promise<Event[]> {
    const client = await this.client;

    return client({
      type: RequestType.RetrieveEvents,
      data: params,
    });
  }

  private async start() {
    await this.client;

    const client = await this.options.connection.createClient(
      this.options.address,
      { timeout: '1s' },
    );

    const backoff = Backoff.fibonacci({
      initialDelay: 100,
      maxDelay: 10000,
      randomisationFactor: 0,
    });

    await new Promise((resolve) => {
      const checkServer = async () => {
        const available = await Promise.race([
          client({ type: 'Ping' }).then(() => true),
          delay('1s').then(() => false),
        ]).catch(() => false);

        if (available) {
          resolve();
        } else {
          backoff.backoff();
        }
      };

      backoff.on('ready', checkServer);

      checkServer();
    });
  }

  public async stop() {
    const client = await this.client;

    await client.stop();
  }
}
