# @highoutput/hmac

## `hmac(message[,key][,algorithm])`
* `message` `(string|Buffer)` Input message
* `key` `(string|Buffer)`
* `algorithm` `(string)` Algorithm
* Returns: `(Promise<Buffer>)`

Generate hash.

### Examples
```javascript
import { hmac } from 'highoutput-utilities';

hash('The quick brown fox jumps over the lazy dog.', { key: 'secretkey' });
hash('The quick brown fox jumps over the lazy dog.', { key: 'secretkey', algorithm: 'sha256' });
```