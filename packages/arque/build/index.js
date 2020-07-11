"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var memory_1 = require("./lib/event-store/database/memory");
Object.defineProperty(exports, "MemoryEventStoreDatabase", { enumerable: true, get: function () { return memory_1.default; } });
__exportStar(require("./lib/aggregate"), exports);
__exportStar(require("./lib/projection"), exports);
__exportStar(require("./lib/projection-store"), exports);
__exportStar(require("./lib/snapshot-store"), exports);
__exportStar(require("./lib/connection"), exports);
__exportStar(require("./lib/decorators"), exports);
__exportStar(require("./lib/types"), exports);
//# sourceMappingURL=index.js.map