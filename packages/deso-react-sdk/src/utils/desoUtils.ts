export const usernameOrPubKey = (input: string) => {
  if (input.length > 15) {
    return 'IS_PUBKEY';
  } else {
    return 'IS_USERNAME';
  }
};
