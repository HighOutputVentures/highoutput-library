# @highoutput/logger

## Class: `Logger`
Generate logs that follow a certain format.

### `new Logger(tags)`
* `tags` `(Array<string>)`

### `logger.tag(tag)`-
* `tag` `(string)`
* Returns: `(Logger)`

### `logger.error(arg0[,arg1][,arg2]...)`
* `arg0` `(string|Object|)`
* `arg1` `(string|Object|)`
* `arg2` `(string|Object|)`

### `logger.warn(arg0[,arg1][,arg2]...)`
* `arg0` `(string|Object|)`
* `arg1` `(string|Object|)`
* `arg2` `(string|Object|)`

### `logger.info(arg0[,arg1][,arg2]...)`
* `arg0` `(string|Object|)`
* `arg1` `(string|Object|)`
* `arg2` `(string|Object|)`

### `logger.verbose(arg0[,arg1][,arg2]...)`
* `arg0` `(string|Object|)`
* `arg1` `(string|Object|)`
* `arg2` `(string|Object|)`

### `logger.silly(arg0[,arg1][,arg2]...)`
* `arg0` `(string|Object|)`
* `arg1` `(string|Object|)`
* `arg2` `(string|Object|)`

### Examples
```javascript
import { Logger } from 'highoutput-utilities';

const logger = new Logger(['api']);

logger.info('Read this!');
logger.error(new Error('A nasty error.'));
logger.silly('My dog will not bite you, probably.');
logger.verbose('You want some log?');
logger.warn('I kill you!');

logger.tag('http').verbose({ host: '127.0.0.1', pathname: '/' });
```
