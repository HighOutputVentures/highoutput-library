import 'reflect-metadata';

export { default as AmqpConnection } from './lib/connection/amqp';
// export { default as EventStoreClient } from './lib/event-store/client';
// export { default as EventStoreServer } from './lib/event-store/server';
export { default as MemoryEventStoreDatabase } from './lib/event-store/database/memory';
export * from './lib/aggregate';
export * from './lib/types';
