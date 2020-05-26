import { Before, After, AfterAll } from 'cucumber';
import Amqp from '../../src/index';

Before(async function () {
  this.amqp = new Amqp();
});

After(async function () {
  await this.amqp.stop();
});

AfterAll(() => {
  process.exit(0);
});
