export type ID = Buffer;

export type Event<TAggregateType extends string = string, TEventType extends string = string, TBody = any> = Readonly<{
  id: ID;
  type: TEventType;
  body: TBody;
  aggregateId: ID;
  aggregateType: TAggregateType;
  aggregateVersion: number;
  version: number;
  timestamp: Date;
}>;

export type Snapshot<TState = any> = Readonly<{
  id: ID;
  aggregateId: ID;
  aggregateType: string;
  aggregateVersion: number;
  state: TState;
  timestamp: Date;
}>;

export interface EventStoreDatabaseAdapter {
  saveEvent(event: Event): Promise<void>;
  saveSnapshot(snapshot: Snapshot): Promise<void>;
  retrieveLatestSnapshot(params: {
    aggregateId: string;
    aggregateType: string;
  }): Promise<Snapshot | null>;
  retrieveEvents(params: {
    first?: number;
    after?: Buffer;
    filters?: {
      aggregateId?: string;
      aggregateType?: string;
      type?: string;
    }[];
  }): Promise<Event[]>;
}

export type ConnectionAdapterClient = {
  (...args: any[]): Promise<any>;
  stop(): Promise<void>;
};

export type ConnectionAdapterWorker = {
  stop(): Promise<void>;
};

export type ConnectionAdapterSubscriber = {};

export type ConnectionAdapterPublisher = {};

export type ConnectionAdapter = {
  createClient(address: string, options?: { timeout?: string | number }): Promise<ConnectionAdapterClient>;
  createWorker(address: string, handler: (...args: any[]) => Promise<any>, options?: { concurrency?: number }): Promise<ConnectionAdapterWorker>;
  // createSubscriber(address: string): Promise<ConnectionAdapterSubscriber>;
  // createPublisher(address: string): Promise<ConnectionAdapterSubscriber>;
  stop(): Promise<void>;
}

export type EventStore = {
  // retrieveEvents(params: {
  //   first?: number;
  //   after?: Buffer;
  // }): Promise<Event[]>;
  // retrieveLatestSnapshot(params: {
  //   aggregateId: string;
  //   aggregateType: string;
  //   lastAggregateVersion?: number;
  // }): Promise<Snapshot | null>;
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
};
