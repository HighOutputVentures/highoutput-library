import cookies from 'js-cookie';
import constants from './constants';
import type { AuthState } from './types';

export default function getAuthState(): AuthState {
  const token = cookies.get(constants.accessTokenId);

  return {
    token,
    status: token ? 'authenticated' : 'unauthenticated',
  };
}