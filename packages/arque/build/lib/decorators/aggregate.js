"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const get_event_store_1 = __importDefault(require("../util/get-event-store"));
const get_snapshot_store_1 = __importDefault(require("../util/get-snapshot-store"));
function default_1(params) {
    return function (target) {
        Reflect.defineMetadata(types_1.AGGREGATE_TYPE_METADATA_KEY, params.type, target.prototype);
        Reflect.defineMetadata(types_1.EVENT_STORE_METADATA_KEY, params.eventStore || get_event_store_1.default(), target.prototype);
        Reflect.defineMetadata(types_1.SNAPSHOT_STORE_METADATA_KEY, params.snapshotStore || get_snapshot_store_1.default(), target.prototype);
        Reflect.defineMetadata(types_1.AGGREGATE_EVENT_HANDLERS_METADATA_KEY, [
            ...(Reflect.getMetadata(types_1.AGGREGATE_EVENT_HANDLERS_METADATA_KEY, target.prototype) || []),
            ...params.eventHandlers || [],
        ], target.prototype);
    };
}
exports.default = default_1;
//# sourceMappingURL=aggregate.js.map