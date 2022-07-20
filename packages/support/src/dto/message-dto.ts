export type MessageDto = {
  emailAddress: string;
  message: string;
  details?: Record<string, unknown>;
};
