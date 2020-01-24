# `async-group`

> Groups together multiple promises and allows us to 'wait' for all of them to settle.

## Usage

```
import delay from '@highoutput/delay';
import AsyncGroup from '@highoutput/async-group';

AsyncGroup.add(delay('2s'));
AsyncGroup.add(delay('3s'));

const timestamp = process.hrtime();
AsyncGroup.wait().then(() => console.log(process.hrtime(timestamp).shift())); // 5

delay('1s').then(() => AsyncGroup.add(delay('4s')));
```
