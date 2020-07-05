# `arque`

> TODO: description

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
}
```

### Modular

### Projection

### Distributed
