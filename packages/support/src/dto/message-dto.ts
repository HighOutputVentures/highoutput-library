export type MessageDto = {
  customer: string;
  emailAddress: string;
  message: string;
  details?: Record<string, unknown>;
};
