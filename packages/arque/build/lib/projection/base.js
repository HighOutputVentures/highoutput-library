"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = __importDefault(require("p-queue"));
const ramda_1 = __importDefault(require("ramda"));
const types_1 = require("../types");
const can_handle_event_1 = __importDefault(require("../util/can-handle-event"));
class default_1 {
    constructor(options = {}) {
        this.startPromise = null;
        this.queue = new p_queue_1.default({ concurrency: 1, autoStart: false });
        this.options = ramda_1.default.mergeDeepLeft({
            batchSize: 100,
        }, options);
        this.filters = ramda_1.default.compose(ramda_1.default.uniq, ramda_1.default.pluck('filter'))(Reflect.getMetadata(types_1.PROJECTION_EVENT_HANDLERS_METADATA_KEY, this));
    }
    async apply(event) {
        const projectionStore = Reflect.getMetadata(types_1.PROJECTION_STORE_METADATA_KEY, this);
        const id = Reflect.getMetadata(types_1.PROJECTION_ID_METADATA_KEY, this);
        for (const { filter, handler } of Reflect.getMetadata(types_1.PROJECTION_EVENT_HANDLERS_METADATA_KEY, this)) {
            if (can_handle_event_1.default(filter, event)) {
                await handler.apply(this, [event]);
            }
        }
        await projectionStore.save({
            id,
            lastEvent: event.id,
        });
        this.lastEvent = event.id;
    }
    async digest() {
        const eventStore = Reflect.getMetadata(types_1.EVENT_STORE_METADATA_KEY, this);
        const first = this.options.batchSize;
        while (true) {
            const events = await eventStore.retrieveEvents({
                filters: this.filters,
                after: this.lastEvent,
                first,
            });
            for (const event of events) {
                await this.apply(event);
            }
            if (events.length < first) {
                break;
            }
        }
    }
    async start() {
        if (!this.startPromise) {
            this.startPromise = (async () => {
                const projectionStore = Reflect.getMetadata(types_1.PROJECTION_STORE_METADATA_KEY, this);
                const eventStore = Reflect.getMetadata(types_1.EVENT_STORE_METADATA_KEY, this);
                const id = Reflect.getMetadata(types_1.PROJECTION_ID_METADATA_KEY, this);
                await projectionStore.save({
                    id,
                    status: types_1.ProjectionStatus.Initializing,
                });
                const state = await projectionStore.find(id);
                if (state) {
                    this.lastEvent = state.lastEvent || undefined;
                }
                await this.digest();
                await Promise.all(this.filters.map((filter) => eventStore.subscribe(filter, async (event) => {
                    this.queue.add(async () => {
                        if (!this.lastEvent || Buffer.compare(event.id, this.lastEvent) > 0) {
                            await this.apply(event);
                        }
                    });
                }, { concurrency: 100 })));
                await this.digest();
                this.queue.start();
                await projectionStore.save({
                    id,
                    status: types_1.ProjectionStatus.Live,
                });
            })();
        }
        await this.startPromise;
    }
}
exports.default = default_1;
//# sourceMappingURL=base.js.map