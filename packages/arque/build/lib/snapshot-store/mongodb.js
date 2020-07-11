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
const mongoose_1 = __importStar(require("mongoose"));
const ramda_1 = __importDefault(require("ramda"));
const generate_snapshot_id_1 = __importDefault(require("../util/generate-snapshot-id"));
class default_1 {
    constructor(connection) {
        this.connection = connection || mongoose_1.default.createConnection('mongodb://localhost');
        const schema = new mongoose_1.Schema({
            _id: {
                type: Buffer,
                required: true,
            },
            aggregate: {
                id: {
                    type: Buffer,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                },
                version: {
                    type: Number,
                    required: true,
                },
            },
            state: {
                type: mongoose_1.Schema.Types.Mixed,
                required: true,
            },
            timestamp: {
                type: Date,
                required: true,
            },
        }, { _id: false });
        schema.index({ 'aggregate.id': 1, 'aggregate.version': -1 }, { unique: true });
        this.model = this.connection.model('Snapshot', schema);
    }
    createSnapshot(params) {
        const id = generate_snapshot_id_1.default(params.aggregate);
        const snapshot = Object.assign(Object.assign({}, params), { id, timestamp: new Date() });
        return Object.assign(Object.assign({}, snapshot), { save: async () => {
                await this.model.remove({
                    'aggregate.id': params.aggregate.id,
                    'aggregate.version': params.aggregate.version,
                });
                await this.model.create(Object.assign(Object.assign({}, snapshot), { _id: snapshot.id }));
                return snapshot;
            } });
    }
    async retrieveLatestSnapshot(aggregate) {
        const [snapshot] = await this.model.find({
            'aggregate.id': aggregate.id,
            'aggregate.version': {
                $lte: aggregate.version,
            },
        })
            .sort({ 'aggregate.version': -1 })
            .limit(1);
        if (!snapshot) {
            return null;
        }
        return Object.assign(Object.assign({}, ramda_1.default.omit(['_id', '__v'], snapshot.toObject())), { id: snapshot._id });
    }
}
exports.default = default_1;
//# sourceMappingURL=mongodb.js.map