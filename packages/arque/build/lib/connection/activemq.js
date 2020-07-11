"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp_1 = __importDefault(require("@highoutput/amqp"));
class default_1 {
    constructor(options) {
        this.amqp = new amqp_1.default(options);
    }
    async createClient(address, options) {
        const client = await this.amqp.createClient(address, Object.assign(Object.assign({}, options), { deserialize: true, serialize: true, noResponse: false }));
        return Object.assign((...args) => client(...args), {
            stop: () => client.client.stop(),
        });
    }
    async createWorker(address, handler, options) {
        const worker = await this.amqp.createWorker(address, handler, Object.assign(Object.assign({}, options), { deserialize: true, serialize: true }));
        return {
            stop: () => worker.stop(),
        };
    }
    async createPublisher(topic) {
        const publisher = await this.amqp.createPublisher(topic, {
            serialize: true,
        });
        return Object.assign(async (...args) => publisher(...args), {
            stop: () => publisher.publisher.stop(),
        });
    }
    async createSubscriber(topic, handler, options) {
        const subscriber = await this.amqp.createSubscriber(topic, handler, Object.assign(Object.assign({}, options), { deserialize: true }));
        return {
            stop: () => subscriber.stop(),
        };
    }
    async stop() {
        await this.amqp.stop();
    }
}
exports.default = default_1;
//# sourceMappingURL=activemq.js.map