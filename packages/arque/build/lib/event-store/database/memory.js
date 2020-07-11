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
exports.deserializeEvent = exports.serializeEvent = void 0;
const ramda_1 = __importDefault(require("ramda"));
const lokijs_1 = __importStar(require("lokijs"));
const error_1 = __importDefault(require("@highoutput/error"));
const clean_deep_1 = __importDefault(require("clean-deep"));
function serializeEvent(event) {
    return Object.assign(Object.assign({}, ramda_1.default.pick(['type', 'body', 'version', 'timestamp'], event)), { id: event.id.toString('hex'), aggregate: Object.assign(Object.assign({}, event.aggregate), { id: event.aggregate.id.toString('hex') }) });
}
exports.serializeEvent = serializeEvent;
function deserializeEvent(event) {
    return Object.assign(Object.assign({}, ramda_1.default.pick(['type', 'body', 'version', 'timestamp'], event)), { id: Buffer.from(event.id, 'hex'), aggregate: Object.assign(Object.assign({}, event.aggregate), { id: Buffer.from(event.aggregate.id, 'hex') }) });
}
exports.deserializeEvent = deserializeEvent;
class default_1 {
    constructor() {
        this.loki = new lokijs_1.default('EventStore', { adapter: new lokijs_1.LokiMemoryAdapter() });
        this.collection = this
            .loki
            .addCollection('events');
    }
    async saveEvent(event) {
        if (this.collection.findOne({
            'aggregate.id': event.aggregate.id.toString('hex'),
            'aggregate.version': event.aggregate.version,
        })) {
            throw new error_1.default('AGGREGATE_VERSION_EXISTS', 'Aggregate version already exists.');
        }
        this.collection.insertOne(serializeEvent(event));
    }
    async retrieveAggregateEvents(params) {
        let query = {
            'aggregate.id': params.aggregate.toString('hex'),
        };
        if (params.after) {
            query = Object.assign(Object.assign({}, query), { 'aggregate.version': {
                    $gt: params.after,
                } });
        }
        return this.collection
            .chain()
            .find(query)
            .sort(ramda_1.default.ascend(ramda_1.default.path(['aggregate', 'version'])))
            .limit(params.first || 1000)
            .data()
            .map(deserializeEvent);
    }
    async retrieveEvents(params) {
        const filters = ramda_1.default.map((filter) => {
            var _a;
            if (filter.aggregate) {
                return clean_deep_1.default(Object.assign(Object.assign({}, ramda_1.default.omit(['aggregate'], filter)), { 'aggregate.id': (_a = filter.aggregate.id) === null || _a === void 0 ? void 0 : _a.toString('hex'), 'aggregate.type': filter.aggregate.type }));
            }
            return filter;
        }, params.filters);
        if (filters.length === 0) {
            return [];
        }
        let query = {};
        if (params.after) {
            query = Object.assign(Object.assign({}, query), { id: {
                    $gt: params.after.toString('hex'),
                } });
        }
        if (ramda_1.default.isEmpty(query)) {
            query = {
                $or: filters,
            };
        }
        else {
            query = {
                $and: [
                    query,
                    {
                        $or: filters,
                    },
                ],
            };
        }
        return this.collection
            .chain()
            .find(query)
            .sort(ramda_1.default.ascend(ramda_1.default.prop('id')))
            .limit(params.first || 1000)
            .data()
            .map(deserializeEvent);
    }
}
exports.default = default_1;
//# sourceMappingURL=memory.js.map