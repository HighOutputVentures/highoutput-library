# @highoutput/hash

## `hash(message[,algorithm][,salt])`
* `message` `(string|Buffer)` Input message
* `opts.algorithm` `(string)` Algorithm
* `opts.salt` `(string|Buffer)`
* `opts.salt` `(string|Buffer)`
* Returns: `(Promise<Buffer>)`

Generate hash.

### Examples
```javascript
import { hash } from 'highoutput-utilities';

hash('The quick brown fox jumps over the lazy dog.');
hash('The quick brown fox jumps over the lazy dog.', { algorithm: 'sha256' });
hash('The quick brown fox jumps over the lazy dog.', { algorithm: 'sha256', salt: 'secretsalt' });
```