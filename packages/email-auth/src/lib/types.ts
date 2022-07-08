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
