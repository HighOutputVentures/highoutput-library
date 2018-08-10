const debug = require('debug');

const loggers = {};
const globalTags = (process.env.LOGGER_TAGS) ? process.env.LOGGER_TAGS.split(',') : [];

class Logger {
  constructor(tags) {
    this.tags = tags;
  }

  tag(tags) {
    const newTags = typeof tags === 'string' ? [tags] : tags;
    return new Logger([...this.tags, ...newTags]);
  }

  log(level, ...args) {
    const tags = [...globalTags, ...this.tags].join(',');
    const scope = `${level}${(tags) ? `:${tags}` : ''}`;
    const logger = loggers[scope] ? loggers[scope] : debug(scope);
    loggers[scope] = logger;

    logger(...args.map((item) => {
      if (item instanceof Error) {
        const obj = {
          message: item.message,
        };

        Object.getOwnPropertyNames(item).forEach((property) => {
          obj[property] = item[property];
        });

        return obj;
      }

      if (item instanceof String) {
        return item.replace(/\n/, '\\n');
      }

      return item;
    }).map((item) => {
      if (typeof item === 'object') {
        return JSON.stringify(item);
      }

      return item;
    }));
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

module.exports = Logger;
