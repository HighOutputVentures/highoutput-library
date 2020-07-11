"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const get_event_store_1 = __importDefault(require("../util/get-event-store"));
const get_projection_store_1 = __importDefault(require("../util/get-projection-store"));
function default_1(params) {
    return function (target) {
        Reflect.defineMetadata(types_1.PROJECTION_ID_METADATA_KEY, params.id, target.prototype);
        Reflect.defineMetadata(types_1.EVENT_STORE_METADATA_KEY, params.eventStore || get_event_store_1.default(), target.prototype);
        Reflect.defineMetadata(types_1.PROJECTION_STORE_METADATA_KEY, params.eventStore || get_projection_store_1.default(), target.prototype);
    };
}
exports.default = default_1;
//# sourceMappingURL=projection.js.map