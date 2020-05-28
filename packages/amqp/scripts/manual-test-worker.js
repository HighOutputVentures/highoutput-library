/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable new-cap */
const Amqp = require('../build/index');
const config = require('./config');

async function Worker() {
  const amqp = new Amqp.default(config);

  await amqp.createWorker('Re.connection', (...args) => {
    console.log('Rpc: Received...');
    console.dir(args, { depth: null });
    return args;
  }, {
    concurrency: 100,
  });
}

Worker();
