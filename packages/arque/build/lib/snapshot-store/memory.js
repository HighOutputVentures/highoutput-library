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
exports.deserializeSnapshot = exports.serializeSnapshot = void 0;
const lokijs_1 = __importStar(require("lokijs"));
const ramda_1 = __importDefault(require("ramda"));
const generate_snapshot_id_1 = __importDefault(require("../util/generate-snapshot-id"));
function serializeSnapshot(snapshot) {
    return Object.assign(Object.assign({}, ramda_1.default.pick(['state', 'timestamp'], snapshot)), { id: snapshot.id.toString('hex'), aggregate: Object.assign(Object.assign({}, snapshot.aggregate), { id: snapshot.aggregate.id.toString('hex') }) });
}
exports.serializeSnapshot = serializeSnapshot;
function deserializeSnapshot(snapshot) {
    return Object.assign(Object.assign({}, ramda_1.default.pick(['state', 'timestamp'], snapshot)), { id: Buffer.from(snapshot.id, 'hex'), aggregate: Object.assign(Object.assign({}, snapshot.aggregate), { id: Buffer.from(snapshot.aggregate.id, 'hex') }) });
}
exports.deserializeSnapshot = deserializeSnapshot;
class MemorySnapshotStore {
    constructor() {
        this.loki = new lokijs_1.default('SnapshotStore', { adapter: new lokijs_1.LokiMemoryAdapter() });
        this.collection = this
            .loki
            .addCollection('snapshots');
    }
    createSnapshot(params) {
        const id = generate_snapshot_id_1.default(params.aggregate);
        const snapshot = Object.assign(Object.assign({}, params), { id, timestamp: new Date() });
        return Object.assign(Object.assign({}, snapshot), { save: async () => {
                this.collection.findAndRemove({ id: id.toString('hex') });
                this.collection.insert(serializeSnapshot(snapshot));
                return snapshot;
            } });
    }
    async retrieveLatestSnapshot(aggregate) {
        const [result] = this.collection
            .chain()
            .find({
            'aggregate.id': aggregate.id.toString('hex'),
            'aggregate.version': {
                $lte: aggregate.version,
            },
        })
            .sort(ramda_1.default.descend(ramda_1.default.path(['aggregate', 'version'])))
            .limit(1)
            .data()
            .map(deserializeSnapshot);
        return result;
    }
}
exports.default = MemorySnapshotStore;
//# sourceMappingURL=memory.js.map