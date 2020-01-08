"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
const delay = (duration) => new Promise(resolve => {
    setTimeout(resolve, ms_1.default(duration));
});
exports.default = delay;
//# sourceMappingURL=index.js.map