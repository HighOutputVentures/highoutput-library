"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const hash = (message, opts) => {
    const options = Object.assign({ algorithm: 'sha256', salt: '', options: undefined }, opts);
    return crypto_1.default
        .createHash(options.algorithm, options.options)
        .update(message)
        .update(options.salt)
        .digest();
};
exports.default = hash;
//# sourceMappingURL=index.js.map