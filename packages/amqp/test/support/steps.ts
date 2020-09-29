import { Before, After, AfterAll } from 'cucumber';
import Amqp from '../../src/index';

Before(async function () {
  this.amqp = new Amqp({
    hosts: ['tcp://primary', 'localhost'],
    ports: [1234, 2345, 5672],
  });
});

After(async function () {
  await this.amqp.stop();
});

AfterAll(() => {
  process.exit(0);
});
