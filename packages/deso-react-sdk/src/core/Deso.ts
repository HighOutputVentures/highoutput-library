const DEFAULT_NODE_URL: string = 'https://bitclout.com/api';
import { getAxiosInstance } from '../utils/axiosUtils';
import { getSingleProfileReqDataProps, getSingleProfileProps } from './typings';
import { v4 as uuid } from 'uuid';
import { BitcloutDataProps } from '../types';

export class DeSo {
  baseURL: string;

  constructor(baseURL = DEFAULT_NODE_URL) {
    this.baseURL = baseURL;
  }

  // API call for getting details of a user
  async getSingleProfile({ publicKey, username }: getSingleProfileProps) {
    if (!publicKey && !username)
      throw new Error('publicKey or username is required');

    const reqPath = '/api/get-single-profile';
    const reqData: getSingleProfileReqDataProps = {};

    if (publicKey) {
      reqData.PublicKeyBase58Check = publicKey;
    } else if (username) {
      reqData.username = username;
    }

    const result = await getAxiosInstance(reqPath, reqData, 'post');

    return result?.data;
  }

  async getIdentity(
    cbFx: (data: BitcloutDataProps) => void,
    desoWindow: React.MutableRefObject<Window | null>
  ) {
    let desoPubKey: BitcloutDataProps['pubKey'] = '';

    const eventCallback = (event: MessageEvent) => {
      const { id, method, service, payload } = event.data;

      if (service !== 'identity' || !desoWindow.current) return;

      const METHODS: Record<string, () => void | Promise<void> | undefined> = {
        initialize: () =>
          desoWindow.current?.postMessage({ id, service: 'identity' }, '*'),
        login: () => {
          const bitcloutUser = payload.users[payload.publicKeyAdded];
          desoPubKey = payload.publicKeyAdded;

          const payloadData = {
            accessLevel: bitcloutUser.accessLevel,
            accessLevelHmac: bitcloutUser.accessLevelHmac,
            encryptedSeedHex: bitcloutUser.encryptedSeedHex,
          };

          desoWindow.current?.postMessage(
            {
              id: uuid(),
              service: 'identity',
              method: 'jwt',
              payload: payloadData,
            },
            '*'
          );

          localStorage.setItem(
            'tmpDeSoData',
            JSON.stringify({
              publicKeyAdded: payload.publicKeyAdded,
              bitcloutUser: payloadData,
            })
          );
        },
      };

      const finalEvent = () => {
        if (payload.jwt) {
          desoWindow.current?.close();
          desoWindow.current = null;

          cbFx?.({
            pubKey: desoPubKey || '',
            token: payload.jwt,
          });
        }
      };

      const bitCloutMethod = METHODS[method] || finalEvent;
      void bitCloutMethod();
    };

    window.addEventListener('message', eventCallback);

    if (typeof window !== 'undefined') {
      desoWindow.current = window.open(
        'https://identity.deso.org/log-in?accessLevelRequest=2',
        'DeSo Login',
        'toolbar=no, width=800, height=1000, top=0, left=0'
      );

      desoWindow.current?.focus();
    }
  }
}
