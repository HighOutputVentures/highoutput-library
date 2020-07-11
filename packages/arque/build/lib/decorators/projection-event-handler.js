"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
function default_1(filter) {
    return function (target, _, descriptor) {
        Reflect.defineMetadata(types_1.PROJECTION_EVENT_HANDLERS_METADATA_KEY, [
            ...(Reflect.getMetadata(types_1.PROJECTION_EVENT_HANDLERS_METADATA_KEY, target) || []),
            {
                filter,
                handler: descriptor.value,
            },
        ], target);
    };
}
exports.default = default_1;
//# sourceMappingURL=projection-event-handler.js.map