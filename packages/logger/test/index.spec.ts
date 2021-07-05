import assert from 'assert';

import Logger from '../src';

describe('logger', () => {
  it('should accept strings', () => {
    const logger = new Logger('test');

    logger.log('info', 'Hello world!');
    logger.info('Hello world!');
    logger.error('Hello world!');
    logger.warn('Hello world!');
    logger.silly('Hello world!');
    logger.verbose('Hello world!');

    logger.tag('tag1').tag('tag2').log('info', 'Hello world!');
    logger.tag('tag1').tag('tag2').info('Hello world!');
    logger.tag('tag1').tag('tag2').error('Hello world!');
    logger.tag('tag1').tag('tag2').warn('Hello world!');
    logger.tag('tag1').tag('tag2').silly('Hello world!');
    logger.tag('tag1').tag('tag2').verbose('Hello world!');

    assert.ok(true);
  });

  it('should accept multiple logs', () => {
    const logger = new Logger('test');

    logger.info('Hello world!', { one: 1, two: 2 });

    assert.ok(true);
  });

  it('should accept objects', () => {
    const logger = new Logger('test');

    logger.log('info', { message: 'Hello world!' });
    logger.info({ message: 'Hello world!' });
    logger.error({ message: 'Hello world!' });
    logger.warn({ message: 'Hello world!' });
    logger.silly({ message: 'Hello world!' });
    logger.verbose({ message: 'Hello world!' });

    logger.log('info', { message: { another: 'Hello world!', one: { two: 'Hello world!' } } });
    logger.info({ message: { another: 'Hello world!', one: { two: 'Hello world!' } } });
    logger.error({ message: { another: 'Hello world!', one: { two: 'Hello world!' } } });
    logger.warn({ message: { another: 'Hello world!', one: { two: 'Hello world!' } } });
    logger.silly({ message: { another: 'Hello world!', one: { two: 'Hello world!' } } });
    logger.verbose({ message: { another: 'Hello world!', one: { two: 'Hello world!' } } });

    assert.ok(true);
  });

  it('should accept Error instance', () => {
    const logger = new Logger('test');

    logger.log('info', new Error('Hello world!'));
    logger.info(new Error('Hello world!'));
    logger.error(new Error('Hello world!'));
    logger.warn(new Error('Hello world!'));
    logger.silly(new Error('Hello world!'));
    logger.verbose(new Error('Hello world!'));

    assert.ok(true);
  });

  it('should accept complex Error instance', () => {
    const logger = new Logger('test');

    const error: any = new Error('Error');
    error.code = 'ERROR';

    logger.log('info', error);
    logger.info(error);
    logger.error(error);
    logger.warn(error);
    logger.silly(error);
    logger.verbose(error);

    assert.ok(true);
  });
});
