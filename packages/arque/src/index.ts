import 'reflect-metadata';

export { default as AmqpConnectionAdapter } from './lib/connection/amqp';
export { default as EventStoreClient } from './lib/event-store/client';
export { default as EventStoreServer } from './lib/event-store/server';
export { default as MemoryEventStoreDatabaseAdapter } from './lib/event-store/database-adapter/memory';
export { default as BaseAggregate } from './lib/aggregate';
export { default as Aggregate } from './lib/aggregate/aggregate';
export { default as AggregateEventHandler } from './lib/aggregate/event-handler';
export * from './lib/types';
