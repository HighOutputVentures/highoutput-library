export type AuthConfig = {
  hostname: string;
};

export type AuthState = {
  token?: string;
  status: 'loading' | 'authenticated' | 'unauthenticated';
};

export type AuthService = {
  generateOtp(email: string): Promise<void>;
  validateOtp(otp: string): Promise<void>;
};
