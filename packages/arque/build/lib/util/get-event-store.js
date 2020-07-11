"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_store_1 = require("../event-store");
let store;
function default_1() {
    if (!store) {
        store = new event_store_1.MemoryEventStore();
    }
    return store;
}
exports.default = default_1;
//# sourceMappingURL=get-event-store.js.map