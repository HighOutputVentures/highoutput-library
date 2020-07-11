"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const domain = crypto_1.default.randomBytes(8);
let counter = 0;
let lastTimestamp = Date.now();
function generateEventId() {
    const timestamp = Date.now();
    if (timestamp !== lastTimestamp) {
        counter = 0;
        lastTimestamp = timestamp;
    }
    else {
        counter += 1;
    }
    const id = Buffer.allocUnsafe(16);
    id.writeUIntBE(timestamp, 0, 6);
    domain.copy(id, 6);
    id.writeUIntBE(counter, 14, 2);
    return {
        id,
        timestamp: new Date(timestamp),
    };
}
exports.default = generateEventId;
//# sourceMappingURL=generate-event-id.js.map