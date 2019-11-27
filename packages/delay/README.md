# @highoutput/delay

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