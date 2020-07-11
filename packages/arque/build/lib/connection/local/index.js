"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_error_1 = require("serialize-error");
const uuid_1 = require("uuid");
const delay_1 = __importDefault(require("@highoutput/delay"));
const error_1 = __importDefault(require("@highoutput/error"));
const ramda_1 = __importDefault(require("ramda"));
const queue_1 = __importDefault(require("./queue"));
const consumer_1 = __importDefault(require("./consumer"));
class default_1 {
    constructor() {
        this.queues = new Map();
        this.clients = new Map();
        this.workers = new Map();
        this.publishers = new Map();
        this.subscribers = new Map();
        this.exchanges = new Map();
    }
    sendToQueue(name, message) {
        const queue = this.queues.get(name);
        if (queue) {
            queue.enqueue(message);
        }
    }
    assertQueue(name) {
        let queue = this.queues.get(name);
        if (!queue) {
            queue = new queue_1.default();
            this.queues.set(name, queue);
        }
        return queue;
    }
    assertExchange(name) {
        let exchange = this.exchanges.get(name);
        if (!exchange) {
            exchange = new Map();
            this.exchanges.set(name, exchange);
        }
        return exchange;
    }
    async createClient(address, options) {
        const id = uuid_1.v4();
        const queue = this.assertQueue(id);
        const callbacks = new Map();
        const consumer = new consumer_1.default(queue, async (message) => {
            const callback = callbacks.get(message.correlation);
            if (!callback) {
                return;
            }
            if (message.result) {
                callback.resolve(message.result);
            }
            if (message.error) {
                callback.reject(serialize_error_1.deserializeError(message.error));
            }
        }, { concurrency: Infinity });
        const client = async (...args) => {
            const correlation = uuid_1.v4();
            const promise = new Promise((resolve, reject) => {
                callbacks.set(correlation, { resolve, reject });
            });
            this.sendToQueue(address, {
                correlation,
                client: id,
                arguments: args,
            });
            return Promise.race([
                promise,
                (async () => {
                    await delay_1.default((options === null || options === void 0 ? void 0 : options.timeout) || '60s');
                    throw new error_1.default('TIMEOUT', 'Request timed out.');
                })(),
            ]);
        };
        client.stop = async () => {
            this.clients.delete(id);
            this.queues.delete(id);
            await consumer.stop();
        };
        this.clients.set(id, client);
        return client;
    }
    async createWorker(address, handler, options) {
        const id = uuid_1.v4();
        const queue = this.assertQueue(address);
        const consumer = new consumer_1.default(queue, async (message) => {
            const response = {
                correlation: message.correlation,
            };
            try {
                response.result = await handler(...message.arguments);
            }
            catch (err) {
                response.error = serialize_error_1.serializeError(err);
            }
            this.sendToQueue(message.client, response);
        }, options);
        const worker = {
            stop: async () => {
                this.workers.delete(id);
                await consumer.stop();
            },
        };
        this.workers.set(id, worker);
        return worker;
    }
    async createPublisher(topic) {
        const id = uuid_1.v4();
        const subject = topic.split('.');
        const publisher = async (...args) => {
            const correlation = uuid_1.v4();
            const matches = ramda_1.default.filter((key) => {
                const reference = key.split('.');
                if (subject.length !== reference.length) {
                    return false;
                }
                return ramda_1.default.all(([sub, ref]) => ref === '*' || ref === sub, ramda_1.default.zip(subject, reference));
            }, Array.from(this.exchanges.keys()));
            ramda_1.default.forEach((match) => {
                const exchange = this.exchanges.get(match);
                if (exchange) {
                    ramda_1.default.forEach((queue) => queue.enqueue({
                        correlation,
                        arguments: args,
                    }), Array.from(exchange.values()));
                }
            }, matches);
        };
        publisher.stop = async () => { };
        this.publishers.set(id, publisher);
        return publisher;
    }
    async createSubscriber(topic, handler, options) {
        const id = uuid_1.v4();
        const queue = this.assertQueue(id);
        const exchange = this.assertExchange(topic);
        exchange.set(id, queue);
        const consumer = new consumer_1.default(queue, async (message) => {
            await handler(...message.arguments);
        }, options);
        const subscriber = {
            stop: async () => {
                this.subscribers.delete(id);
                exchange.delete(id);
                this.queues.delete(id);
                await consumer.stop();
            },
        };
        this.subscribers.set(id, subscriber);
        return subscriber;
    }
    async stop() {
        await Promise.all([
            ...Array.from(this.clients.values()).map((client) => client.stop()),
            ...Array.from(this.workers.values()).map((worker) => worker.stop()),
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map