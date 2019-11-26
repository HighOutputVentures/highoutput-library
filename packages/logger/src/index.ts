import debug, { Debugger } from 'debug';

class Logger {
  private loggers: { [key: string]: Debugger };
  private tags: string | string[];

  constructor(tags: string | string[]) {
    this.tags = tags;
    this.loggers = {};
  }

  tag(tags: string | [string]): Logger {
    return new Logger([
      ...(this.tags as string[] ),
      ...(typeof tags === 'string' ? [tags] : tags)
    ]);
  }

  log(level: string, ...args: string[]): void {
    const tags = [...this.tags].join(',');
    const scope = `${level}${tags ? `:${tags}` : ''}`;
    const logger = this.loggers[scope] ? this.loggers[scope] : debug(scope);

    this.loggers[scope] = logger;

    logger(
      null,
      ...args
        .map((item: String | Error) => {
          if (item instanceof Error) {
            const obj = { message: item.message };

            Object
              .getOwnPropertyNames(item)
              .forEach(property => {
                (obj as any)[property] = (item as any)[property];
              });

            return obj;
          }

          if (item instanceof String) {
            return item.replace(/\n/, '\\n');
          }

          return item;
        })
        .map(item => {
          if (typeof item === 'object') {
            return JSON.stringify(item);
          }

          return item;
        }) as string[]
    );
  }

  error(...args: string[]): void {
    this.log.apply(this, ['error', ...args]);
  }

  warn(...args: string[]): void {
    this.log.apply(this, ['warn', ...args]);
  }

  info(...args: string[]): void {
    this.log.apply(this, ['info', ...args]);
  }

  verbose(...args: string[]): void {
    this.log.apply(this, ['verbose', ...args]);
  }

  silly(...args: string[]): void {
    this.log.apply(this, ['silly', ...args]);
  }
}

export default Logger;
