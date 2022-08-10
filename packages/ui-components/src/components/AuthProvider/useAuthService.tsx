import cookies from 'js-cookie';
import * as React from 'react';
import AuthContext from './AuthContext';
import constants from './constants';
import type { AuthService } from './types';
import { postJson } from './utils';

export default function useAuthService() {
  const {hostname} = React.useContext(AuthContext);

  const generateOtp: AuthService['generateOtp'] = React.useCallback(
    async (emailAddress) => {
      await postJson(`${hostname}/otp/generate`, {emailAddress});
    },
    [hostname],
  );

  const validateOtp: AuthService['validateOtp'] = React.useCallback(
    async (otp) => {
      const {token} = await postJson<{token: string}>(`${hostname}/otp/validate`, {otp});

      cookies.set(constants.accessTokenId, token, {
        secure: process.env.NODE_ENV === 'production',
        expires: 29,
        sameSite: 'strict',
      });
    },
    [hostname],
  );

  return {
    generateOtp,
    validateOtp,
  };
}