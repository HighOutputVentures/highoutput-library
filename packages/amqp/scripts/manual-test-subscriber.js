/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable new-cap */
const Amqp = require('../build/index');
const config = require('./config');

async function Worker() {
  const amqp = new Amqp.default(config);

  await amqp.createSubscriber('Reconnection', (...args) => {
    console.log('PubSub: Received...');
    console.dir(args, { depth: null });
    return args;
  });
}

Worker();
