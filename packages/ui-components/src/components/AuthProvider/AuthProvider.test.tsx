import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import AuthProvider from './AuthProvider';
import useAuthService from './useAuthService';

const otp = Math.random().toString();
const email = new Date().toISOString() + '@gmail.com';
const token = new Date().toISOString();

const generateOtp = jest.fn();
const validateOtp = jest.fn();

jest.mock('./useAuthService', () => {
  return jest.fn(() => ({
    generateOtp,
    validateOtp,
  }));
});

jest.mock('./useAuthState', () => {
  return jest.fn(() => ({
    token,
    status: 'authenticated',
  }));
});

describe('AuthProvider', () => {
  afterEach(cleanup);

  beforeEach(() => {
    render(
      <AuthProvider hostname="http://localhost:3000">
        <Component />
      </AuthProvider>
    );
  });

  it('Should be able to generate OTP', () => {
    fireEvent.click($('otp.generate'));
    expect(generateOtp).toHaveBeenCalledWith(email);
  });

  it('Should be able to validate OTP', () => {
    fireEvent.click($('otp.validate'));
    expect(validateOtp).toHaveBeenCalledWith(otp);
  });
});

const $ = screen.getByTestId;

const Component = () => {
  const { generateOtp, validateOtp } = useAuthService();

  return (
    <div>
      <div>
        <button data-testid="otp.generate" onClick={() => generateOtp(email)}>
          Generate OTP
        </button>
        <button data-testid="otp.validate" onClick={() => validateOtp(otp)}>
          Validate OTP
        </button>
      </div>
    </div>
  );
};
