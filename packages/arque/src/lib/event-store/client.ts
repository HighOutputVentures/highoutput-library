import { Event, Snapshot, ID } from '../types';

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
