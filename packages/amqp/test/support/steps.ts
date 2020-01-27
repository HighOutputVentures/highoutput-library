import { Before, After } from 'cucumber';
import Amqp from '../../src/index';

Before(async function () {
  this.amqp = new Amqp({
    username: 'ANONYMOUS',
  });
});

After(async function () {
  await this.amqp.stop();
});
