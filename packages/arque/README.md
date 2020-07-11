# `arque`

A NodeJS library for building event-sourced systems.

## Usage

### Basic

```typescript
import {
  Aggregate,
  AggregateEventHandler,
  BaseAggregate,
} from 'arque';

@Aggregate({ type: 'Balance' })
class BalanceAggregate extends BaseAggregate {
  constructor(id: ID) {
    super(id, 0);
  }

  @AggregateEventHandler({ type: 'Credited' })
  onCredited(state: number, event: Event<{ amount: number }>) {
    return state + event.body.amount;
  }

  @AggregateEventHandler({ type: 'Debited' })
  onDebited(state: number, event: Event<{ amount: number }>) {
    const result = state - event.body.amount;

    if (result < 0) {
      throw new Error('Cannot be negative.');
    }

    return result;
  }
}
```

### Modular

### Projection

### Distributed

## TODO
- MongoDBEventStoreDatabase
- RedisEventStoreDatabase
- KafkaConnection
