import cookies from 'js-cookie';
import constants from './constants';

export default function logout(callback?: () => void) {
  cookies.remove(constants.accessTokenId);
  callback?.();
}
