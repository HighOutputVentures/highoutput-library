import crypto, { BinaryLike, HashOptions } from 'crypto';

const hash = (
  message: BinaryLike,
  opts?: {
    algorithm?: string,
    salt?: BinaryLike
    options?: HashOptions
  },
): Buffer => {
  const options = Object.assign({
    algorithm: 'sha256',
    salt: ''
  }, opts);

  return crypto
    .createHash(options.algorithm, options.options)
    .update(message)
    .update(options.salt)
    .digest();
};



export default hash;
