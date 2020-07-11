"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("lru-cache"));
const generate_event_id_1 = __importDefault(require("../util/generate-event-id"));
const memory_1 = __importDefault(require("./database/memory"));
const get_connection_1 = __importDefault(require("../util/get-connection"));
class MemoryEventStore {
    constructor(connection) {
        this.database = new memory_1.default();
        this.subscribers = [];
        this.cache = new lru_cache_1.default({
            dispose: async (key, promise) => {
                const publisher = await promise;
                await publisher.stop();
            },
        });
        this.connection = connection || get_connection_1.default();
    }
    async publish(event) {
        const topic = `${event.aggregate.type}.${event.type}.${event.version}`;
        let promise = this.cache.get(topic);
        if (!promise) {
            promise = this.connection.createPublisher(topic);
            this.cache.set(topic, promise);
        }
        const publisher = await promise;
        await publisher(event);
    }
    createEvent(params) {
        if (params.aggregate.id.length !== 16) {
            throw new Error('Aggregate id must be 16 bytes long.');
        }
        const { id, timestamp } = generate_event_id_1.default();
        const event = Object.assign(Object.assign({}, params), { id,
            timestamp });
        return Object.assign(Object.assign({}, event), { save: async () => {
                await this.database.saveEvent(event);
                await this.publish(event);
                return event;
            } });
    }
    async retrieveAggregateEvents(params) {
        return this.database.retrieveAggregateEvents(params);
    }
    async retrieveEvents(params) {
        return this.database.retrieveEvents(params);
    }
    async subscribe(params, handler, options) {
        var _a;
        const topic = `${((_a = params.aggregate) === null || _a === void 0 ? void 0 : _a.type) || '*'}.${params.type || '*'}.${params.version || '*'}`;
        const subscriber = await this.connection.createSubscriber(topic, handler, options);
        this.subscribers.push(subscriber);
    }
}
exports.default = MemoryEventStore;
//# sourceMappingURL=memory.js.map