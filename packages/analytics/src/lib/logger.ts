import Logger from '@highoutput/logger';

export const logger = new Logger(['identifi']);
logger.info({
  version: '9.1.2',
});
