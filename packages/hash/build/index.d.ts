/// <reference types="node" />
import crypto from 'crypto';
declare const hash: (message: crypto.BinaryLike, opts?: {
    algorithm?: string | undefined;
    salt?: string | DataView | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | undefined;
    options?: crypto.HashOptions | undefined;
} | undefined) => Buffer;
export default hash;
//# sourceMappingURL=index.d.ts.map