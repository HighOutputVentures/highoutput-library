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
class default_1 {
    constructor(connection) {
        this.connection = connection || mongoose_1.default.createConnection('mongodb://localhost');
        const schema = new mongoose_1.Schema({
            _id: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                default: 'PENDING',
            },
            lastEvent: {
                type: Buffer,
                default: null,
            },
            lastUpdated: {
                type: Date,
                default: () => Date.now(),
            },
        }, { _id: false });
        this.model = this.connection.model('Projection', schema);
    }
    async find(id) {
        const projection = await this.model.findOne({ _id: id });
        if (!projection) {
            return null;
        }
        return Object.assign(Object.assign({}, ramda_1.default.omit(['_id', '__v'], projection.toObject())), { id: projection.id });
    }
    async save(params) {
        await this.model.updateOne({ _id: params.id }, ramda_1.default.pick(['status', 'lastEvent'], params), {
            upsert: true,
            setDefaultsOnInsert: true,
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=mongodb.js.map