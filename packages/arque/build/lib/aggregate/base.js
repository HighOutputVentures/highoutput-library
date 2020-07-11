"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = __importDefault(require("p-queue"));
const ramda_1 = __importDefault(require("ramda"));
const types_1 = require("../types");
class BaseAggregate {
    constructor(id, state) {
        this.queue = new p_queue_1.default({ concurrency: 1 });
        this._version = 0;
        this.options = {
            batchSize: 100,
        };
        this._id = id;
        this._state = Object.freeze(state);
    }
    get type() {
        return Reflect.getMetadata(types_1.AGGREGATE_TYPE_METADATA_KEY, this);
    }
    get eventStore() {
        return Reflect.getMetadata(types_1.EVENT_STORE_METADATA_KEY, this);
    }
    get snapshotStore() {
        return Reflect.getMetadata(types_1.SNAPSHOT_STORE_METADATA_KEY, this);
    }
    get shouldTakeSnapshot() {
        return false;
    }
    get state() {
        return this._state;
    }
    get id() {
        return this._id;
    }
    get version() {
        return this._version;
    }
    apply(state, event) {
        let next = ramda_1.default.clone(state);
        for (const { filter, handler } of Reflect.getMetadata(types_1.AGGREGATE_EVENT_HANDLERS_METADATA_KEY, this)) {
            if (ramda_1.default.equals(filter, ramda_1.default.pick(ramda_1.default.keys(filter), event))) {
                next = handler(state, event);
            }
        }
        return next;
    }
    async fold() {
        let { state } = this;
        let { version } = this;
        let events;
        do {
            events = (await this.eventStore.retrieveAggregateEvents({
                aggregate: this.id,
                first: this.options.batchSize,
                after: version,
            }));
            for (const event of events) {
                state = this.apply(state, event);
                version = event.aggregate.version;
            }
        } while (events.length === this.options.batchSize);
        this._version = version;
        this._state = Object.freeze(state);
    }
    async createEvent(params) {
        return this.queue.add(async () => {
            await this.fold();
            const event = await this.eventStore.createEvent(Object.assign(Object.assign({}, params), { version: params.version || 1, aggregate: {
                    id: this.id,
                    version: this.version + 1,
                    type: this.type,
                } }));
            const state = this.apply(this.state, event);
            await event.save();
            this._version = event.aggregate.version;
            this._state = Object.freeze(state);
            if (this.shouldTakeSnapshot) {
                this.snapshotStore.createSnapshot({
                    aggregate: {
                        id: this.id,
                        type: this.type,
                        version: this.version,
                    },
                    state,
                }).save();
            }
        });
    }
}
exports.default = BaseAggregate;
//# sourceMappingURL=base.js.map