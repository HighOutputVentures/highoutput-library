# `circuit-breaker`

> Executes and monitors the status of async functions. When the async function starts failing, `@highoutput/circuit-breaker` triggers an internal switch and prevents further executions. The internal switch is triggered when the failure rate (number of failures divided by the number of executions measured over a period) goes beyond the threshold.

## Usage

```
import CircuitBreaker from '@highoutput/circuit-breaker';

const circuitBreaker = new CircuitBreaker({
  threshold: 0.35,
  timeout: 60000,
  rollingCountBuckets: 6,
  rollingCountInterval: 30000,
  resetTimeout: 300000,
  recoveryCountThreshold: 3,
  handler: async (params: { message: string }) => {
    return params.message;
  },
});

console.log(await circuitBreaker.exec({ message: 'Hello World' }));
// Hello World
```
