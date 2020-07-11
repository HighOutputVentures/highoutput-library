"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const async_group_1 = __importDefault(require("@highoutput/async-group"));
class default_1 {
    constructor(queue, handler, options = {}) {
        this.queue = queue;
        this.handler = handler;
        this.group = new async_group_1.default();
        this.stopping = false;
        this.listener = () => {
            this.fetch();
        };
        this.options = ramda_1.default.mergeDeepLeft({
            concurrency: 1,
        }, options);
        this.credits = this.options.concurrency;
        this.queue.on('enqueue', this.listener);
    }
    fetch() {
        if (this.credits === 0 || this.stopping) {
            return;
        }
        const messages = this.queue.dequeue(this.credits);
        this.credits -= messages.length;
        messages.forEach((message) => {
            this.group.add((async () => {
                try {
                    await this.handler(message);
                }
                finally {
                    this.credits += 1;
                    this.fetch();
                }
            })());
        });
    }
    async stop() {
        this.stopping = true;
        this.queue.removeListener('enqueue', this.listener);
        await this.group.wait();
    }
}
exports.default = default_1;
//# sourceMappingURL=consumer.js.map