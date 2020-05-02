import { EventEmitter } from 'events';
import Backoff from 'backoff';
import delay from '@highoutput/delay';
import { EventStore, ConnectionAdapter, ConnectionAdapterClient, ID, RequestType, Event, Snapshot } from '../types';
import { getConnection, generateId } from '../util';

export default class extends EventEmitter implements EventStore {
  private client: Promise<ConnectionAdapterClient>;

  public readonly initialized: Promise<void>;

  private options: {
    connection: ConnectionAdapter;
    address: string;
    timeout: string | number;
  }

  constructor(
    options?: {
      connection?: ConnectionAdapter;
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

  async createEvent(params: {
    type: string;
    body: any;
    aggregateId: ID;
    aggregateType: string;
    aggregateVersion: number;
    version: number;
  }): Promise<Event> {
    const client = await this.client;

    const timestamp = new Date();
    const id = generateId(timestamp);

    const data = {
      ...params,
      id,
      timestamp,
    };

    await client({
      type: RequestType.SaveEvent,
      data
    });

    return data;
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

    const data = {
      ...params,
      id,
      timestamp,
    };

    await client({
      type: RequestType.SaveSnapshot,
      data,
    });

    return data;
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

    await new Promise(async (resolve) => {
      const checkServer = async () => {
        const available = await Promise.race([
          client({ type: 'Ping' }).then(() => true),
          delay('1s').then(() => false),
        ]).catch(() => false);

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
    const client = await this.client;

    await client.stop();
  }
}
