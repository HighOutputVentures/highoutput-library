# A collection of common tools

## `delay(duration)`
* `duration` `(number|string)` Amount of time to wait
* Returns: `(Promise)`

Wait for a given amount of time. The input can be a string compatible to the [`ms`](https://www.npmjs.com/package/ms) module.

### Examples
```javascript
import { delay } from 'highoutput-utilities';

async function main() {
  await delay(1000); // wait for 1 second

  await delay('1m'); // wait for 1 minute
}

main();
```

## `hash(message[,algorithm][,salt])`
* `message` `(string|Buffer)` Input message
* `algorithm` `(string)` Algorithm
* `salt` `(string|Buffer)`
* Returns: `(Promise<Buffer>)`

Generate hash.

### Examples
```javascript
import { hash } from 'highoutput-utilities';

hash('The quick brown fox jumps over the lazy dog.');
hash('The quick brown fox jumps over the lazy dog.', 'md5');
hash('The quick brown fox jumps over the lazy dog.', 'md5', 'secretsalt');
```

## `hmac(message[,key][,algorithm])`
* `message` `(string|Buffer)` Input message
* `key` `(string|Buffer)`
* `algorithm` `(string)` Algorithm
* Returns: `(Promise<Buffer>)`

Generate hash.

### Examples
```javascript
import { hmac } from 'highoutput-utilities';

hash('The quick brown fox jumps over the lazy dog.', 'secretkey');
hash('The quick brown fox jumps over the lazy dog.', 'secretkey', 'sha256');
```

## Class: `Logger`
Generate logs that follow a certain format.

### `new Logger(tags)`
* `tags` `(Array<string>)`

### `logger.tag(tag)`
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
