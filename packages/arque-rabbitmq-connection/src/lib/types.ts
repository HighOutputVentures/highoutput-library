import { ConsumeMessage, Options } from 'amqplib';

export type Sender = {
  send: (message: any, options?: Options.Publish) => Promise<void>;
};

export type Receiver = {
  consume: (callback: (msg: ConsumeMessage | null) => Promise<void>) => void;
};

export type ClientOptions = {
  timeout: string | number;
  noResponse: boolean;
  deserialize: boolean;
  serialize: boolean;
};
