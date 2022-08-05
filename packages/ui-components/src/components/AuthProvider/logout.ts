import cookies from 'js-cookie';
import constants from './constants';

export default function logout() {
  cookies.remove(constants.accessTokenId);
}
