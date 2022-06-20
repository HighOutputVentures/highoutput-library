export interface EmailAdapter<T = any> {
  sendEmailOtp(params: {
    otp: string;
    user: T;
  }): Promise<void>;
}
