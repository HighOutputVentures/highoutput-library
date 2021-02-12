export type ID = Buffer;

export type Event<
  TBody extends any = any,
  TType extends string = string,
  TAggregateType extends string = string,
> = Readonly<{
  id: ID;
  type: TType;
  body: TBody;
  aggregate: {
    id: ID;
    type: TAggregateType;
    version: number;
  };
  version: number;
  timestamp: Date;
}>;

export type Snapshot<TState = any, TAggregateType extends string = string> = Readonly<{
  id: ID;
  aggregate: {
    id: ID;
    type: TAggregateType;
    version: number;
  };
  state: TState;
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
  }): Snapshot & { save: () => Promise<Snapshot> };
  retrieveLatestSnapshot(aggregate: {
    id: ID;
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
    options?: { timeout?: string | number }
  ): Promise<ConnectionClient>;
  createWorker(
    address: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number }
  ): Promise<ConnectionWorker>;
  createPublisher(topic: string): Promise<ConnectionPublisher>;
  createSubscriber(
    topic: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number }
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
  createEvent(
    params: Omit<Event, 'id' | 'timestamp'>
  ): Event & { save: () => Promise<Event> };
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
        type?: string;
      };
      type?: string;
      version?: number;
    },
    handler: (event: Event) => Promise<void>,
    options?: { queue?: string; concurrency?: number }
  ): Promise<ConnectionSubscriber>;
}

export enum ProjectionStatus {
  Pending = 'PENDING',
  Initializing = 'INITIALIZING',
  Live = 'LIVE',
}

export type ProjectionState = {
  id: string;
  status: ProjectionStatus;
  lastEvent?: ID | null;
  lastUpdated: Date;
};

export interface ProjectionStore {
  find(id: string): Promise<ProjectionState | null>;
  save: (
    params: Pick<ProjectionState, 'id'> &
      Partial<Pick<ProjectionState, 'status' | 'lastEvent'>>
  ) => Promise<void>;
}
