/* eslint-disable import/prefer-default-export */
export const AGGREGATE_TYPE_METADATA_KEY = 'AGGREGATE_TYPE';
export const EVENT_STORE_METADATA_KEY = 'EVENT_STORE';
export const SNAPSHOT_STORE_METADATA_KEY = 'SNAPSHOT_STORE';
export const EVENT_HANDLERS_METADATA_KEY = 'EVENT_HANDLERS';
export const PROJECTION_ID_METADATA_KEY = 'PROJECTION_ID';
export const PROJECTION_STORE_METADATA_KEY = 'PROJECTION_STORE';
export const PROJECTION_EVENT_HANDLERS_METADATA_KEY = 'PROJECTION_EVENT_HANDLERS';

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

export type ConnectionPublisher = {
  (...args: any[]): Promise<void>;
  stop(): Promise<void>;
};

export type ConnectionSubscriber = {
  stop(): Promise<void>;
};

export interface Connection {
  createClient(
    address: string,
    options?: { timeout?: string | number },
  ): Promise<ConnectionClient>;
  createWorker(
    address: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number },
  ): Promise<ConnectionWorker>;
  createPublisher(topic: string): Promise<ConnectionPublisher>;
  createSubscriber(
    topic: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number },
  ): Promise<ConnectionSubscriber>;
  stop(): Promise<void>;
}

export type EventFilter = {
  aggregate?: {
    id?: ID;
    type?: string;
  };
  type?: string;
  version?: number;
};

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
    filters: EventFilter[];
  }): Promise<Event[]>;
  subscribe(
    params: {
      aggregate?: {
        id: ID;
        type: string;
      };
      type?: string;
    },
    handler: (event: Event) => Promise<void>,
  ): Promise<void>;
}

export enum ProjectionStatus {
  INITIALIZING = 'INITIALIZING',
  LIVE = 'LIVE',
}

export type Projection = {
  id: string;
  status: ProjectionStatus;
  lastEvent: ID;
  lastUpdated: Date;
};

export interface ProjectionStore {
  findById(id: string): Promise<Projection | null>;
  save: (params: Pick<Projection, 'id' | 'lastEvent' | 'status'>) => Promise<boolean>;
}

export enum RequestType {
  Ping = 'Ping',
  SaveEvent = 'SaveEvent',
  SaveSnapshot = 'SaveSnapshot',
  RetrieveLatestSnapshot = 'RetrieveLatestSnapshot',
  RetrieveEvents = 'RetrieveEvents',
}
