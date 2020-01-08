/// <reference types="node" />
import crypto from 'crypto';
import { TransformOptions } from 'stream';
declare const hash: (message: crypto.BinaryLike, opts: {
    key: crypto.BinaryLike;
    algorithm?: string | undefined;
    options?: TransformOptions | undefined;
}) => Buffer;
export default hash;
//# sourceMappingURL=index.d.ts.map