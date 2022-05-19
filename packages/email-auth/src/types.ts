export type ID = Buffer;

export type Node = {
  email: string;
  otp: string;
};

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
