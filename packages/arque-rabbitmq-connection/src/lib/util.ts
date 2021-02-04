import { Channel, Options } from 'amqplib';
import ms from 'ms';
import { Receiver, Sender } from './types';

export const createSender = async (
  channel: Channel,
  params: {
    queue: string;
    options?: Options.AssertQueue;
  },
): Promise<Sender> => {
  await channel.assertQueue(params.queue, params.options);
  return async (message, options) => {
    channel.sendToQueue(
      params.queue,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  };
};

export const createPublisher = async (
  channel: Channel,
  params: {
    topic: string;
    exchange: string;
  },
): Promise<Sender> => {
  await channel.assertExchange(params.exchange, 'topic', { durable: false });
  return async (message, options) => {
    channel.publish(
      params.exchange,
      params.topic,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  };
};

export const createSubscriber = async (
  channel: Channel,
  params: {
    topic: string;
    exchange: string;
    concurrency: number;
  },
): Promise<Receiver> => {
  await channel.prefetch(params.concurrency);

  await channel.assertExchange(params.exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(q.queue, params.exchange, params.topic);

  return (callback) => {
    channel.consume(q.queue, callback, { noAck: true });
  };
};

export const createReceiver = async (
  channel: Channel,
  options: { queue: string; concurrency?: number },
): Promise<Receiver> => {
  if (options.concurrency) {
    await channel.prefetch(options.concurrency);
  }

  await channel.assertQueue(options.queue, { durable: true });

  return (callback) => {
    channel.consume(options.queue, callback, { noAck: true });
  };
};

export const msSerializer = (param: string | number): number => {
  return typeof param === 'string' ? ms(param) : param;
};
