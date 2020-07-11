"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memory_1 = __importDefault(require("../snapshot-store/memory"));
let store;
function default_1() {
    if (!store) {
        store = new memory_1.default();
    }
    return store;
}
exports.default = default_1;
//# sourceMappingURL=get-snapshot-store.js.map