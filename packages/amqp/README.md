# `amqp`

> A simplified abstraction of the AMQP 1.0 protocol

## Usage

### RPC

```typescript
import Amqp from '@highoutput/amqp';
import assert from 'assert';

async function main() {
  const amqp = new Amqp();

  await amqp.createWorker(
    'queue',
    async message => message
  );
  const client = await amqp.createClient('queue');

  const result = await client('Hello World!');
  assert.equal(result, 'Hello World!');
}

main();
```

### PubSub

```typescript
import Amqp from '@highoutput/amqp';
import assert from 'assert';

async function main() {
  const amqp = new Amqp();

  await amqp.createSubscriber(
    'topic.*',
    async message => assert.equal(message, 'Hello World!')
  );

  const publish = await amqp.createPublisher('topic.hello');
  publish('Hello World!');
}

main();
```
