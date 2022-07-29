export type ID = Buffer;

export type User = {
  id: ID;
  emailAddress: string;
};

export type Otp = {
  id: ID;
  user: ID;
  otp: string;
};

export type SenderInfo = {
  name: string;
  email: string;
};