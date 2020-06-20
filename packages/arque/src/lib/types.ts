/* eslint-disable import/prefer-default-export */
export const AGGREGATE_TYPE_METADATA_KEY = 'aggregateType';
export const EVENT_STORE_METADATA_KEY = 'eventStore';
export const SNAPSHOT_STORE_METADATA_KEY = 'snapshotStore';
export const EVENT_HANDLERS_METADATA_KEY = 'eventHandlers';

export type ID = Buffer;

export type Event<TEventType extends string = string, TBody = any> = Readonly<{
  id: ID;
  type: TEventType;
  body: TBody;
  aggregate: {
    id: ID;
    type: string;
    version: number;
  };
  version: number;
  timestamp: Date;
}>;

export type Snapshot = Readonly<{
  id: ID;
  aggregate: {
    id: ID;
    type: string;
    version: number;
  };
  state: any;
  timestamp: Date;
}>;

export interface EventStoreDatabase {
  saveEvent(event: Event): Promise<void>;
  retrieveAggregateEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]>;
  retrieveEvents(params: {
    first?: number;
    after?: ID;
    filters: {
      aggregate?: {
        id?: ID;
        type?: string;
      };
      version?: number;
      type?: string;
    }[];
  }): Promise<Event[]>;
}

export interface SnapshotStore {
  createSnapshot(params: {
    aggregate: {
      id: ID;
      type: string;
      version: number;
    };
    state: any;
  }): Snapshot & { save: () => Promise<void> };
  retrieveLatestSnapshot(aggregate: {
    id: ID;
    type: string;
    version: number;
  }): Promise<Snapshot | null>;
}

export type ConnectionClient = {
  (...args: any[]): Promise<any>;
  stop(): Promise<void>;
};

export type ConnectionWorker = {
  stop(): Promise<void>;
};

export type ConnectionSubscriber = {};

export type ConnectionPublisher = {};

export interface Connection {
  createClient(
    address: string,
    options?: { timeout?: string | number },
  ): Promise<ConnectionClient>;
  createWorker(
    address: string,
    handler: (...args: any[]) => Promise<any>, options?: { concurrency?: number },
  ): Promise<ConnectionWorker>;
  // createSubscriber(address: string): Promise<ConnectionAdapterSubscriber>;
  // createPublisher(address: string): Promise<ConnectionAdapterSubscriber>;
  stop(): Promise<void>;
}

export interface EventStore {
  createEvent(params: Omit<Event, 'id' | 'timestamp'>): Event & { save: () => Promise<void> };
  retrieveAggregateEvents(params: {
    aggregate: ID;
    first?: number;
    after?: number;
  }): Promise<Event[]>;
  retrieveEvents(params: {
    first?: number;
    after?: ID;
    filters: {
      aggregate?: {
        id?: ID;
        type?: string;
      };
      version?: number;
      type?: string;
    }[];
  }): Promise<Event[]>;
  // subscribe(params: {
  //   aggregateId?: string;
  //   aggregateType?: string;
  //   type?: string;
  // }, handler: (ack: () => {}) => Promise<void>): Promise<void>;
}

export enum RequestType {
  Ping = 'Ping',
  SaveEvent = 'SaveEvent',
  SaveSnapshot = 'SaveSnapshot',
  RetrieveLatestSnapshot = 'RetrieveLatestSnapshot',
  RetrieveEvents = 'RetrieveEvents',
}
