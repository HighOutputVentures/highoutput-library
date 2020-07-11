"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const local_1 = __importDefault(require("../connection/local"));
let connection;
function default_1() {
    if (!connection) {
        connection = new local_1.default();
    }
    return connection;
}
exports.default = default_1;
//# sourceMappingURL=get-connection.js.map