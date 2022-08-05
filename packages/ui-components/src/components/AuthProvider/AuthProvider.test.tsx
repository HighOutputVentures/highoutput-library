import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import AuthProvider from './AuthProvider';
import constants from './constants';
import logout from './logout';
import useAuthService from './useAuthService';
import useAuthState from './useAuthState';

const otp = Math.random().toString();
const email = new Date().toISOString() + '@gmail.com';
const token = new Date().toISOString();

const generateOtp = jest.fn();
const validateOtp = jest.fn();
const removeCookie = jest.fn();

jest.mock('js-cookie', () => {
  const originalModule = jest.requireActual('js-cookie');

  return jest.fn({
    ...originalModule,
    __esModule: true,
    remove: removeCookie,
  });
});

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
    fireEvent.click(screen.getByTestId('service.generate'));
    expect(generateOtp).toHaveBeenCalledWith(email);
  });

  it('Should be able to validate OTP', () => {
    fireEvent.click(screen.getByTestId('service.validate'));
    expect(validateOtp).toHaveBeenCalledWith(otp);
  });

  it('Should be able to logout', () => {
    fireEvent.click(screen.getByTestId('utils.logout'));
    expect(removeCookie).toHaveBeenCalledWith(constants.accessTokenId);
  });

  it('Should be able get token', () => {
    expect(screen.getByTestId('state.token')).toHaveTextContent(token);
  });

  it('Should be able get status', () => {
    expect(screen.getByTestId('state.status')).toHaveTextContent(
      'authenticated'
    );
  });
});

const Component = () => {
  const { generateOtp, validateOtp } = useAuthService();
  const { status, token } = useAuthState();

  return (
    <div>
      <div>
        <div data-testid="state.status">{status}</div>
        <div data-testid="state.token">{token}</div>
      </div>

      <div>
        <button
          data-testid="service.generate"
          onClick={() => generateOtp(email)}
        >
          Generate OTP
        </button>
        <button data-testid="service.validate" onClick={() => validateOtp(otp)}>
          Validate OTP
        </button>
      </div>

      <div>
        <button data-testid="utils.logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};
