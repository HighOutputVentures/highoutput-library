export type ID = string;

export type Event<TAggregateType extends string = string, TEventType extends string = string, TBody = any> = Readonly<{
  id: Buffer;
  type: TEventType;
  body: TBody;
  aggregateId: Buffer;
  aggregateType: TAggregateType;
  aggregateVersion: number;
  version: number;
  timestamp: Date;
}>;

export type Snapshot<TState = any> = Readonly<{
  id: Buffer;
  aggregateId: Buffer;
  aggregateType: string;
  aggregateVersion: number;
  state: TState;
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

export enum RequestType {
  Ping = 'Ping',
  SaveEvent = 'SaveEvent',
  RetrieveLatestSnapshot = 'RetrieveLatestSnapshot',
  RetrieveEvents = 'RetrieveEvents',
};
