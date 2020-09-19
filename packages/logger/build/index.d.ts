declare type Argument = number | string | Error | object;
declare class Logger {
    private loggers;
    private tags;
    constructor(tags: string | string[]);
    tag(tags: string | string[]): Logger;
    log(level: string, ...args: Argument[]): void;
    critical(...args: Argument[]): void;
    error(...args: Argument[]): void;
    warn(...args: Argument[]): void;
    info(...args: Argument[]): void;
    verbose(...args: Argument[]): void;
    silly(...args: Argument[]): void;
}
export default Logger;
//# sourceMappingURL=index.d.ts.map