# `amqp`

> A simplified abstraction of the AMQP 1.0 protocol

## Usage

### RPC

```typescript
import Amqp from '@highoutput/amqp';

const amqp = new Amqp();

async main() {
  await amqp.createWorker(
    'queue',
    async message => message
  );
  const client = await rabbit.createClient('queue');

  const result = await client('Hello World!');
  assert.equal(result, 'Hello World!');
}

main();
```

### PubSub

```typescript
import Amqp from '@highoutput/amqp';

const amqp = new Amqp();

async main() {
  await amqp.createSubscriber(
    'topic.*',
    async message => assert.equal('Hello World!')
  );
  const publish = await rabbit.createPublisher('topic.hello');

  publish('Hello World!');
}

main();
```
