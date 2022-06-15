export interface EmailableProviderAdapter<TMessage extends {} = {}, TResponse extends {} = {}> {
  setApiKey(key: string): void;
  sendEmail(message: TMessage): Promise<TResponse>;
  senderEmail: string;
  senderName: string;
}