"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class default_1 extends events_1.EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.setMaxListeners(Infinity);
    }
    enqueue(message) {
        this.queue.push(message);
        this.emit('enqueue');
    }
    dequeue(count = 1) {
        return this.queue.splice(0, Math.min(count, this.queue.length));
    }
    get size() {
        return this.queue.length;
    }
}
exports.default = default_1;
//# sourceMappingURL=queue.js.map