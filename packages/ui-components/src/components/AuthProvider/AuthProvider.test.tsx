import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import AuthProvider from './AuthProvider';
import useAuth from './useAuth';

const ead = new Date().toISOString();
const otp = Math.random().toString();

const generateOtp = jest.fn();
const validateOtp = jest.fn();

jest.mock('./useAuth', () => {
  return () => ({
    generateOtp,
    validateOtp,
  });
});

const hostname = 'http://localhost:3000';

describe('AuthProvider', () => {
  beforeEach(() => {
    render(
      <AuthProvider hostname={hostname}>
        <Component />
      </AuthProvider>
    );
  });

  it('Should be able to generate OTP', () => {
    const button = screen.getByTestId('otp.generate');
    fireEvent.click(button);
    expect(generateOtp).toHaveBeenCalledWith(ead);
  });

  it('Should be able to validate OTP', () => {
    const button = screen.getByTestId('otp.validate');
    fireEvent.click(button);
    expect(validateOtp).toHaveBeenCalledWith(otp);
  });
});

const Component = () => {
  const { generateOtp, validateOtp } = useAuth();

  return (
    <div>
      <button data-testid="otp.generate" onClick={() => generateOtp(ead)}>
        Generate OTP
      </button>
      <button data-testid="otp.validate" onClick={() => validateOtp(otp)}>
        Validate OTP
      </button>
    </div>
  );
};
