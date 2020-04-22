import debug, { Debugger } from 'debug';

type Argument = number | string | Error | object;

class Logger {
  private loggers: { [key: string]: Debugger };

  private tags: string | string[];

  constructor(tags: string | string[]) {
    if (tags instanceof Array) {
      this.tags = tags;
    } else {
      this.tags = [tags];
    }
    this.loggers = {};
  }

  tag(tags: string | string[]): Logger {
    return new Logger([
      ...(this.tags as string[]),
      ...(typeof tags === 'string' ? [tags] : tags),
    ]);
  }

  log(level: string, ...args: Argument[]): void {
    const tags = [...this.tags].join(',');
    const scope = `${level}${tags ? `:${tags}` : ''}`;
    const logger = this.loggers[scope] ? this.loggers[scope] : debug(scope);

    this.loggers[scope] = logger;

    const items = args
      .map((item: Argument) => {
        if (item instanceof Error) {
          const obj = { message: item.message };

          Object.getOwnPropertyNames(item).forEach(property => {
            (obj as any)[property] = (item as any)[property];
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
      }) as string[];

    logger(items[0], ...items.slice(1));
  }

  critical(...args: Argument[]): void {
    this.log.apply(this, ['critical', ...args]);
  }

  error(...args: Argument[]): void {
    this.log.apply(this, ['error', ...args]);
  }

  warn(...args: Argument[]): void {
    this.log.apply(this, ['warn', ...args]);
  }

  info(...args: Argument[]): void {
    this.log.apply(this, ['info', ...args]);
  }

  verbose(...args: Argument[]): void {
    this.log.apply(this, ['verbose', ...args]);
  }

  silly(...args: Argument[]): void {
    this.log.apply(this, ['silly', ...args]);
  }
}

export default Logger;
