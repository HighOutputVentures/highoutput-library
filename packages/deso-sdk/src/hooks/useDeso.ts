import { DeSo } from '../core';
import { BitcloutDataProps } from '../types';
import { usernameOrPubKey } from '../utils/desoUtils';

export default () => {
  const DeSoInstance = new DeSo();

  const getSingleProfile = async (input: string) => {
    if (!input) throw new Error('publicKey or username is required');

    const desoProfile = await DeSoInstance.getSingleProfile({
      ...(usernameOrPubKey(input) === 'IS_PUBKEY' && { publicKey: `${input}` }),
      ...(usernameOrPubKey(input) === 'IS_USERNAME' && {
        username: `${input}`,
      }),
    });

    return desoProfile;
  };

  const getIdentity = async (
    cbFx: (data: BitcloutDataProps) => void,
    desoWindow: React.MutableRefObject<Window | null>
  ) => {
    await DeSoInstance.getIdentity(cbFx, desoWindow);
  };

  return {
    getSingleProfile,
    getIdentity,
  };
};
