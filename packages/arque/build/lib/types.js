"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestType = exports.ProjectionStatus = exports.PROJECTION_EVENT_HANDLERS_METADATA_KEY = exports.PROJECTION_STORE_METADATA_KEY = exports.PROJECTION_ID_METADATA_KEY = exports.AGGREGATE_EVENT_HANDLERS_METADATA_KEY = exports.SNAPSHOT_STORE_METADATA_KEY = exports.EVENT_STORE_METADATA_KEY = exports.AGGREGATE_TYPE_METADATA_KEY = void 0;
exports.AGGREGATE_TYPE_METADATA_KEY = 'AGGREGATE_TYPE';
exports.EVENT_STORE_METADATA_KEY = 'EVENT_STORE';
exports.SNAPSHOT_STORE_METADATA_KEY = 'SNAPSHOT_STORE';
exports.AGGREGATE_EVENT_HANDLERS_METADATA_KEY = 'AGGREGATE_EVENT_HANDLERS';
exports.PROJECTION_ID_METADATA_KEY = 'PROJECTION_ID';
exports.PROJECTION_STORE_METADATA_KEY = 'PROJECTION_STORE';
exports.PROJECTION_EVENT_HANDLERS_METADATA_KEY = 'PROJECTION_EVENT_HANDLERS';
var ProjectionStatus;
(function (ProjectionStatus) {
    ProjectionStatus["Pending"] = "PENDING";
    ProjectionStatus["Initializing"] = "INITIALIZING";
    ProjectionStatus["Live"] = "LIVE";
})(ProjectionStatus = exports.ProjectionStatus || (exports.ProjectionStatus = {}));
var RequestType;
(function (RequestType) {
    RequestType["Ping"] = "Ping";
    RequestType["SaveEvent"] = "SaveEvent";
    RequestType["SaveSnapshot"] = "SaveSnapshot";
    RequestType["RetrieveLatestSnapshot"] = "RetrieveLatestSnapshot";
    RequestType["RetrieveEvents"] = "RetrieveEvents";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
//# sourceMappingURL=types.js.map