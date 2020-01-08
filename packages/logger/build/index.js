"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
class Logger {
    constructor(tags) {
        this.tags = tags;
        this.loggers = {};
    }
    tag(tags) {
        return new Logger([
            ...this.tags,
            ...(typeof tags === 'string' ? [tags] : tags),
        ]);
    }
    log(level, ...args) {
        const tags = [...this.tags].join(',');
        const scope = `${level}${tags ? `:${tags}` : ''}`;
        const logger = this.loggers[scope] ? this.loggers[scope] : debug_1.default(scope);
        this.loggers[scope] = logger;
        const items = args
            .map((item) => {
            if (item instanceof Error) {
                const obj = { message: item.message };
                Object.getOwnPropertyNames(item).forEach(property => {
                    obj[property] = item[property];
                });
                return obj;
            }
            if (typeof item === 'string') {
                return item.replace(/\n/, '\\n');
            }
            return item;
        })
            .map(item => {
            if (typeof item === 'object') {
                return JSON.stringify(item);
            }
            return item;
        });
        logger(items[0], ...items.slice(1));
    }
    error(...args) {
        this.log.apply(this, ['error', ...args]);
    }
    warn(...args) {
        this.log.apply(this, ['warn', ...args]);
    }
    info(...args) {
        this.log.apply(this, ['info', ...args]);
    }
    verbose(...args) {
        this.log.apply(this, ['verbose', ...args]);
    }
    silly(...args) {
        this.log.apply(this, ['silly', ...args]);
    }
}
exports.default = Logger;
//# sourceMappingURL=index.js.map