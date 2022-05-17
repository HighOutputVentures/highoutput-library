export type ID = Buffer;
export type Email = `${string}@${string}.${string}`;

export type QueryOptions = {
  sort?: Record<string, 1 | -1> | undefined;
  skip?: number | undefined;
  limit?: number | undefined;
  projection?: Record<string, 1 | -1>;
};

export type Node = {
  email: Email;
  otp: string;
};

export type InputData<TInput> = { data: TInput };

export type FrameworkType = 'koa' | 'express';

export type OtpType = {
  expiryDuration: string;
  payload: {
    id: ID;
    subject: Buffer;
  }
  secret: string;
};

export interface EmailableProvider {
  setApiKey(key: string): void;
  sendEmail<TMessage, TResponse>(message: TMessage): Promise<TResponse>;
}

export interface StorageProvider <
TEntity extends Node = Node,
TCreate extends Pick<TEntity, 'email'> = Pick<TEntity, 'email'>,
TFind extends Pick<TEntity, 'email' | 'otp'> = Pick<TEntity, 'email' | 'otp'>,
> {
  create (params: InputData<TCreate>): Promise<TEntity>;
  find (params: { filter: TFind, options?: QueryOptions } & Partial<QueryOptions>): Promise<TEntity[]>;
}
