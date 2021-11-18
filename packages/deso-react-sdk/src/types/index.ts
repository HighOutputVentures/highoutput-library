export interface BitcloutIdentityPayloadUser {
  accessLevel: number;
  accessLevelHmac: string;
  btcDepositAddress: string;
  encryptedSeedHex: string;
  hasExtraText: boolean;
  network: string;
}

export interface BitcloutIdentityPayload {
  jwt?: string;
  signedTransactionHex?: string;
  publicKeyAdded: string;
  users: {
    [key: string]: BitcloutIdentityPayloadUser;
  };
}

export interface BitcloutIdentity {
  id: string;
  method: string;
  service: string;
  payload: BitcloutIdentityPayload;
}

export interface BitcloutDataProps {
  pubKey: BitcloutIdentityPayload['publicKeyAdded'];
  token: string;
}
