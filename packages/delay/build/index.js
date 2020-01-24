"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
async function default_1(param) {
    const duration = typeof param === 'string' ? ms_1.default(param) : param;
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map