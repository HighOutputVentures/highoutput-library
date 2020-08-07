/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Connection } from '@arque/types';
import { Kafka, logLevel, Producer, CompressionTypes, Consumer } from 'kafkajs';
import { v4 as uuid } from 'uuid';
import R from 'ramda';

export default class implements Connection {
  private kafka: Kafka;

  private producers: { [key: string]: Producer } = {};

  private consumers: { [key: string]: Consumer } = {};

  constructor(private options: { brokers: string[] }) {
    this.kafka = new Kafka({
      brokers: this.options.brokers,
      logLevel: logLevel.DEBUG,
    });
  }

  async createWorker() {
    return {} as any;
  }

  async createClient() {
    return {} as any;
  }

  async createSubscriber(
    topic: string,
    handler: (...args: any[]) => Promise<any>,
    options?: { concurrency?: number }
  ) {
    const id = uuid();

    const consumer = this.kafka.consumer({
      groupId: id,
    });

    this.consumers[id] = consumer;

    try {
      await consumer.connect();
    } catch (err) {
      delete this.consumers[id];

      throw err;
    }

    await consumer.subscribe({
      topic,
      fromBeginning: true,
    });

    await consumer.run({
      autoCommit: true,
      partitionsConsumedConcurrently: options?.concurrency || 1,
      eachMessage: async ({ message }) => {
        const body: { arguments: any[] } = JSON.parse(
          message.value.toString('utf8')
        );

        await handler(...body.arguments);
      },
    });

    return {
      stop: async () => {
        await consumer.disconnect();
        delete this.consumers[id];
      },
    };
  }

  async createPublisher(topic: string) {
    const id = uuid();

    const producer = this.kafka.producer();

    this.producers[id] = producer;

    try {
      await producer.connect();
    } catch (err) {
      delete this.producers[id];

      throw err;
    }

    return Object.assign(
      async (...args: any[]) => {
        await producer.send({
          topic,
          compression: CompressionTypes.GZIP,
          messages: [
            {
              value: JSON.stringify({
                arguments: args,
              }),
              headers: {
                'correlation-id': uuid(),
              },
            },
          ],
        });
      },
      {
        stop: async () => {
          await producer.disconnect();
          delete this.producers[id];
        },
      }
    );
  }

  async stop() {
    const producers = R.values(this.producers);
    const consumers = R.values(this.consumers);

    await Promise.all([
      ...producers.map((producer) => producer.disconnect()),
      ...consumers.map((consumer) => consumer.disconnect()),
    ]);

    this.consumers = {};
    this.producers = {};
  }
}
