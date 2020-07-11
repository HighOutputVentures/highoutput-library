"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backoff_1 = __importDefault(require("backoff"));
const delay_1 = __importDefault(require("@highoutput/delay"));
const get_connection_1 = __importDefault(require("../../util/get-connection"));
const generate_event_id_1 = __importDefault(require("../../util/generate-event-id"));
const lib_1 = require("./lib");
class default_1 {
    constructor(options) {
        this.subscribers = [];
        this.options = {
            connection: (options === null || options === void 0 ? void 0 : options.connection) || get_connection_1.default(),
            address: (options === null || options === void 0 ? void 0 : options.address) || 'EventStore',
            timeout: (options === null || options === void 0 ? void 0 : options.timeout) || '60s',
        };
        this.client = this.options.connection.createClient(this.options.address, { timeout: this.options.timeout });
        this.initialized = this.start();
    }
    async start() {
        await this.client;
        const client = await this.options.connection.createClient(this.options.address, { timeout: '1s' });
        const backoff = backoff_1.default.fibonacci({
            initialDelay: 100,
            maxDelay: 10000,
            randomisationFactor: 0,
        });
        await new Promise((resolve) => {
            const checkServer = async () => {
                const available = await Promise.race([
                    client({ type: 'Ping' }).then(() => true),
                    delay_1.default('1s').then(() => false),
                ]).catch(() => false);
                if (available) {
                    resolve();
                }
                else {
                    backoff.backoff();
                }
            };
            backoff.on('ready', checkServer);
            checkServer();
        });
        await client.stop();
    }
    createEvent(params) {
        if (params.aggregate.id.length !== 16) {
            throw new Error('Aggregate id must be 16 bytes long.');
        }
        const { id, timestamp } = generate_event_id_1.default();
        const event = Object.assign(Object.assign({}, params), { id,
            timestamp });
        return Object.assign(Object.assign({}, event), { save: async () => {
                const client = await this.client;
                await client({
                    type: lib_1.RequestType.SaveEvent,
                    data: event,
                });
                return event;
            } });
    }
    async retrieveAggregateEvents(params) {
        const client = await this.client;
        return client({
            type: lib_1.RequestType.RetrieveAggregateEvents,
            data: params,
        });
    }
    async retrieveEvents(params) {
        const client = await this.client;
        return client({
            type: lib_1.RequestType.RetrieveEvents,
            data: params,
        });
    }
    async subscribe(params, handler, options) {
        var _a;
        const topic = `${((_a = params.aggregate) === null || _a === void 0 ? void 0 : _a.type) || '*'}.${params.type || '*'}.${params.version || '*'}`;
        const subscriber = await this.options.connection.createSubscriber(topic, handler, options);
        this.subscribers.push(subscriber);
    }
}
exports.default = default_1;
//# sourceMappingURL=client.js.map