import { ConsumeMessage, Options } from 'amqplib';

export type Sender = (message: any, options?: Options.Publish) => Promise<void>;

export type Options = {
  uri?: string;
  protocol: string;
  hostname: string;
  port: number;
  username: string;
  password: string;
  prefix: string;
  vhost: string;
  exchange?: string;
};

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

export type PublisherOptions = {
  serialize: boolean;
};
