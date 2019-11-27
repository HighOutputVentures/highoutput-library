import crypto, { BinaryLike } from 'crypto';
import { TransformOptions } from 'stream';

const hash = (
  message: BinaryLike,
  opts: {
    key: BinaryLike;
    algorithm?: string;
    options?: TransformOptions;
  }
): Buffer => {
  const options = {
    algorithm: 'sha256',
    ...opts,
  };

  return crypto
    .createHmac(options.algorithm, options.key, options.options)
    .update(message)
    .digest();
};

export default hash;
