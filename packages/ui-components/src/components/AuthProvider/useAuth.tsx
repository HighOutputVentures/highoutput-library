import * as React from 'react';
import AuthContext from './AuthContext';
import { postJson } from './utils';

export type UseAuthReturn = {
  generateOtp(email: string): Promise<{ ok: boolean }>;
  validateOtp(otp: string): Promise<{ token: string }>;
};

const useAuth = (): UseAuthReturn => {
  const config = React.useContext(AuthContext);
  const prefix = config.hostname;

  const generateOtp: UseAuthReturn['generateOtp'] = React.useCallback(
    async emailAddress => {
      const url = prefix + '/otp/generate';

      return await postJson<{ ok: true }>(url, { emailAddress });
    },
    []
  );

  const validateOtp: UseAuthReturn['validateOtp'] = React.useCallback(
    async otp => {
      const url = prefix + '/otp/validate';

      return await postJson<{ token: string }>(url, { otp });
    },
    []
  );

  return {
    generateOtp,
    validateOtp,
  };
};

export default useAuth;
