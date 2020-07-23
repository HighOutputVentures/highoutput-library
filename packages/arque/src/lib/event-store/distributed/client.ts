/* eslint-disable no-underscore-dangle */
import Backoff from 'backoff';
import delay from '@highoutput/delay';
import {
  EventStore, Connection, ConnectionClient, Event, ID, EventFilter, ConnectionSubscriber,
} from '../../types';
import getConnection from '../../util/get-connection';
import generateEventId from '../../util/generate-event-id';
import { RequestType } from './lib';

export default class implements EventStore {
  private _client?: ConnectionClient;

  private options: {
    connection: Connection;
    address: string;
    timeout: string | number;
  }

  private initializePromise?: Promise<void>;

  private subscribers: ConnectionSubscriber[] = [];

  constructor(
    options?: {
      connection?: Connection;
      address?: string;
      timeout?: string | number;
    },
  ) {
    this.options = {
      connection: options?.connection || getConnection(),
      address: options?.address || 'EventStore',
      timeout: options?.timeout || '60s',
    };
  }

  private get client() {
    if (!this._client) {
      throw new Error('Client connection not established.');
    }

    return this._client;
  }

  private async initialize() {
    if (!this.initializePromise) {
      this.initializePromise = (async () => {
        this._client = await this.options.connection.createClient(
          this.options.address,
          { timeout: this.options.timeout },
        );

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
              client({ type: RequestType.Ping }).then(() => true),
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

        await client.stop();
      })();
    }

    return this.initializePromise;
  }

  public createEvent(params: Omit<Event, 'id' | 'timestamp'>) {
    if (params.aggregate.id.length !== 16) {
      throw new Error('Aggregate id must be 16 bytes long.');
    }

    const { id, timestamp } = generateEventId();

    const event = {
      ...params,
      id,
      timestamp,
    };

    return {
      ...event,
      save: async () => {
        await this.initialize();

        await this.client({
          type: RequestType.SaveEvent,
          data: event,
        });

        return event;
      },
    };
  }

  public async retrieveAggregateEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]> {
    await this.initialize();

    return this.client({
      type: RequestType.RetrieveAggregateEvents,
      data: params,
    });
  }

  public async retrieveEvents(params: {
    first?: number;
    after?: ID;
    filters: EventFilter[];
  }): Promise<Event[]> {
    await this.initialize();

    return this.client({
      type: RequestType.RetrieveEvents,
      data: params,
    });
  }

  public async subscribe(
    params: {
      aggregate?: {
        type?: string;
      };
      type?: string;
      version?: number;
    },
    handler: (event: Event) => Promise<void>,
    options?: { queue?: string; concurrency?: number },
  ) {
    const topic = `${params.aggregate?.type || '*'}.${params.type || '*'}.${params.version || '*'}`;

    const subscriber = await this.options.connection.createSubscriber(
      topic,
      handler,
      options,
    );

    this.subscribers.push(subscriber);
  }
}
