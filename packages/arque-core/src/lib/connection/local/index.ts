import { serializeError, deserializeError } from 'serialize-error';
import { v4 as uuid } from 'uuid';
import delay from '@highoutput/delay';
import AppError from '@highoutput/error';
import R from 'ramda';
import {
  ConnectionClient, ConnectionWorker, ConnectionSubscriber, ConnectionPublisher,
} from '@arque/types';
import Queue from './queue';
import Consumer from './consumer';

type Request = {
  correlation: string;
  client?: string;
  arguments: any[];
}

type Response = {
  correlation: string;
  result?: any;
  error?: any;
}

export default class {
  private queues = new Map<string, Queue>();

  private clients = new Map<string, ConnectionClient>();

  private workers = new Map<string, ConnectionWorker>();

  private publishers = new Map<string, ConnectionPublisher>();

  private subscribers = new Map<string, ConnectionSubscriber>();

  private exchanges = new Map<string, Map<string, Queue>>();

  private sendToQueue(name, message) {
    const queue = this.queues.get(name);

    if (queue) {
      queue.enqueue(message);
    }
  }

  private assertQueue(name) {
    let queue = this.queues.get(name);

    if (!queue) {
      queue = new Queue();
      this.queues.set(name, queue);
    }

    return queue;
  }

  private assertExchange(name) {
    let exchange = this.exchanges.get(name);

    if (!exchange) {
      exchange = new Map();
      this.exchanges.set(name, exchange);
    }

    return exchange;
  }

  async createClient(
    address: string,
    options?: { timeout?: string | number },
  ) {
    const id = uuid();

    const queue = this.assertQueue(id);

    const callbacks = new Map();

    const consumer = new Consumer(
      queue,
      async (message: Response) => {
        const callback = callbacks.get(message.correlation);

        if (!callback) {
          return;
        }

        if (message.result) {
          callback.resolve(message.result);
        }

        if (message.error) {
          callback.reject(deserializeError(message.error));
        }
      },
      { concurrency: Infinity },
    );

    const client = async (...args: any[]) => {
      const correlation = uuid();

      const promise = new Promise((resolve, reject) => {
        callbacks.set(correlation, { resolve, reject });
      });

      this.sendToQueue(
        address,
        {
          correlation,
          client: id,
          arguments: args,
        },
      );

      return Promise.race([
        promise,
        (async () => {
          await delay(options?.timeout || '60s');

          throw new AppError('TIMEOUT', 'Request timed out.');
        })(),
      ]);
    };
    client.stop = async () => {
      this.clients.delete(id);
      this.queues.delete(id);

      await consumer.stop();
    };

    this.clients.set(id, client);

    return client;
  }

  async createWorker(
    address: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number },
  ) {
    const id = uuid();

    const queue = this.assertQueue(address);

    const consumer = new Consumer(
      queue,
      async (message: Request) => {
        const response: Response = {
          correlation: message.correlation,
        };

        try {
          response.result = await handler(...message.arguments);
        } catch (err) {
          response.error = serializeError(err);
        }

        this.sendToQueue(
          message.client,
          response,
        );
      },
      options,
    );

    const worker = {
      stop: async () => {
        this.workers.delete(id);

        await consumer.stop();
      },
    };

    this.workers.set(id, worker);

    return worker;
  }

  async createPublisher(
    topic: string,
  ) {
    const id = uuid();

    const subject = topic.split('.');

    const publisher = async (...args: any[]) => {
      const correlation = uuid();

      const matches = R.filter(
        (key) => {
          const reference = key.split('.');

          if (subject.length !== reference.length) {
            return false;
          }

          return R.all(([sub, ref]) => ref === '*' || ref === sub, R.zip(subject, reference));
        },
        Array.from(this.exchanges.keys()),
      );

      R.forEach((match) => {
        const exchange = this.exchanges.get(match);

        if (exchange) {
          R.forEach((queue) => queue.enqueue({
            correlation,
            arguments: args,
          }), Array.from(exchange.values()));
        }
      }, matches);
    };
    publisher.stop = async () => {};

    this.publishers.set(id, publisher);

    return publisher;
  }

  async createSubscriber(
    topic: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number },
  ) {
    const id = uuid();

    const queue = this.assertQueue(id);

    const exchange = this.assertExchange(topic);

    exchange.set(id, queue);

    const consumer = new Consumer(
      queue,
      async (message: Request) => {
        await handler(...message.arguments);
      },
      options,
    );

    const subscriber = {
      stop: async () => {
        this.subscribers.delete(id);
        exchange.delete(id);
        this.queues.delete(id);

        await consumer.stop();
      },
    };

    this.subscribers.set(id, subscriber);

    return subscriber;
  }

  async stop() {
    await Promise.all([
      ...Array.from(this.clients.values()).map((client) => client.stop()),
      ...Array.from(this.workers.values()).map((worker) => worker.stop()),
    ]);
  }
}
