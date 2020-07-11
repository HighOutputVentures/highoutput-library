"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("lru-cache"));
const error_1 = __importDefault(require("@highoutput/error"));
const lib_1 = require("./lib");
const get_connection_1 = __importDefault(require("../../util/get-connection"));
const logger_1 = __importDefault(require("../../logger"));
const memory_1 = __importDefault(require("../database/memory"));
const logger = logger_1.default.tag(['EventStore', 'server']);
class default_1 {
    constructor(options) {
        this.worker = null;
        this.publishers = new lru_cache_1.default({
            max: 1024,
            maxAge: 86400000,
        });
        this.options = {
            connection: (options === null || options === void 0 ? void 0 : options.connection) || get_connection_1.default(),
            database: (options === null || options === void 0 ? void 0 : options.database) || new memory_1.default(),
            concurrency: (options === null || options === void 0 ? void 0 : options.concurrency) || 100,
            address: (options === null || options === void 0 ? void 0 : options.address) || 'EventStore',
        };
    }
    async getPublisher(topic) {
        let promise = this.publishers.get(topic);
        if (!promise) {
            promise = this.options.connection.createPublisher(topic);
            this.publishers.set(topic, promise);
        }
        return promise;
    }
    async start() {
        this.worker = await this.options.connection.createWorker(this.options.address, async ({ type, data }) => {
            logger.verbose({ type, data });
            if (type === lib_1.RequestType.Ping) {
                return 'Pong';
            }
            if (type === lib_1.RequestType.SaveEvent) {
                const event = data;
                await this.options.database.saveEvent(event);
                const topic = `${event.aggregate.type}.${event.type}.${event.version}`;
                const publisher = await this.getPublisher(topic);
                await publisher(event);
            }
            if (type === lib_1.RequestType.RetrieveAggregateEvents) {
                return this.options.database.retrieveAggregateEvents(data);
            }
            if (type === lib_1.RequestType.RetrieveEvents) {
                return this.options.database.retrieveEvents(data);
            }
            throw new error_1.default('INVALID_OPERATION', `${type} is not supported.`);
        }, {
            concurrency: this.options.concurrency,
        });
    }
    async stop() {
        if (this.worker) {
            await this.worker.stop();
        }
        await Promise.all(Array.from(this.publishers.values()).map(async (promise) => {
            const publisher = await promise;
            await publisher.stop();
        }));
    }
}
exports.default = default_1;
//# sourceMappingURL=server.js.map