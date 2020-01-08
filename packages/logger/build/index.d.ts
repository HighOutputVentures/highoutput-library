declare class Logger {
    private loggers;
    private tags;
    constructor(tags: string | string[]);
    tag(tags: string | string[]): Logger;
    log(level: string, ...args: (string | Error | object)[]): void;
    error(...args: (string | Error | object)[]): void;
    warn(...args: (string | Error | object)[]): void;
    info(...args: (string | Error | object)[]): void;
    verbose(...args: (string | Error | object)[]): void;
    silly(...args: (string | Error | object)[]): void;
}
export default Logger;
//# sourceMappingURL=index.d.ts.map