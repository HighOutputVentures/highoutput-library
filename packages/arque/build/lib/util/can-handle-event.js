"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
function default_1(filter, event) {
    const partial = ramda_1.default.omit(['aggregate'], filter);
    if (!ramda_1.default.equals(partial, ramda_1.default.pick(ramda_1.default.keys(partial), event))) {
        return false;
    }
    if (filter.aggregate && !ramda_1.default.equals(filter.aggregate, ramda_1.default.pick(ramda_1.default.keys(filter.aggregate), event.aggregate))) {
        return false;
    }
    return true;
}
exports.default = default_1;
//# sourceMappingURL=can-handle-event.js.map