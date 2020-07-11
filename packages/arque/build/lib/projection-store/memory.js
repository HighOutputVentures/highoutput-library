"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
const lokijs_1 = __importStar(require("lokijs"));
const ramda_1 = __importDefault(require("ramda"));
const types_1 = require("../types");
function serialize(projection) {
    var _a;
    return Object.assign(Object.assign({}, ramda_1.default.pick(['id', 'status', 'lastUpdated'], projection)), { lastEvent: ((_a = projection.lastEvent) === null || _a === void 0 ? void 0 : _a.toString('hex')) || null });
}
exports.serialize = serialize;
function deserialize(projection) {
    return Object.assign(Object.assign({}, ramda_1.default.pick(['id', 'status', 'lastUpdated'], projection)), { lastEvent: projection.lastEvent ? Buffer.from(projection.lastEvent, 'hex') : null });
}
exports.deserialize = deserialize;
class default_1 {
    constructor() {
        this.loki = new lokijs_1.default('SnapshotStore', { adapter: new lokijs_1.LokiMemoryAdapter() });
        this.collection = this
            .loki
            .addCollection('projections');
    }
    async find(id) {
        const projection = this.collection.findOne({ id });
        if (!projection) {
            return null;
        }
        return deserialize(projection);
    }
    async save(params) {
        let projection = this.collection.findOne({ id: params.id });
        if (!projection) {
            this.collection.insert(serialize(Object.assign(Object.assign({}, ramda_1.default.mergeLeft({
                status: types_1.ProjectionStatus.Pending,
            }, params)), { lastUpdated: new Date() })));
            projection = this.collection.findOne({ id: params.id });
        }
        if (params.status) {
            projection.status = params.status;
        }
        if (params.lastEvent) {
            projection.lastEvent = params.lastEvent.toString('hex');
        }
        this.collection.update(projection);
    }
}
exports.default = default_1;
//# sourceMappingURL=memory.js.map