export type ID = Buffer;

export type QueryOptions = {
  sort?: Record<string, 1 | -1> | undefined;
  skip?: number | undefined;
  limit?: number | undefined;
  projection?: Record<string, 1 | -1>;
};

export type Node = {
  email: string;
  otp: string;
};

export type InputData<TInput> = { data: TInput };

export type OTPOptions = {
  expiryDuration: number;
  payload: {
    id: ID;
    subject: Buffer;
  }
  secret: string;
};

export interface FrameworkAdapter {
  use(request: any, response: any, next: any): any;
}

export interface EmailableProviderAdapter {
  setApiKey(key: string): void;
  sendEmail<TMessage, TResponse>(message: TMessage): Promise<TResponse>;
  senderEmail: string;
  senderName?: string;
}

export interface PersistenceAdapter <
TEntity extends Node = Node,
TCreate extends Pick<TEntity, 'email'> = Pick<TEntity, 'email'>,
TFind extends Pick<TEntity, 'email' | 'otp'> = Pick<TEntity, 'email' | 'otp'>,
> {
  create(params: InputData<TCreate>): Promise<TEntity>;
  findOne(params: TFind): Promise<TEntity | null>;
}
