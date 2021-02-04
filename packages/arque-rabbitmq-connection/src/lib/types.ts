import { ConsumeMessage, Options } from 'amqplib';

export type Sender = (message: any, options?: Options.Publish) => Promise<void>;

export type Receiver = (
  callback: (msg: ConsumeMessage | null) => Promise<void>,
) => void;

export type ClientOptions = {
  timeout: string | number;
  noResponse: boolean;
  deserialize: boolean;
  serialize: boolean;
};

export type WorkerOptions = {
  concurrency: number;
  serialize: boolean;
  deserialize: boolean;
};
