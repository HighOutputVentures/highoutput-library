/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable new-cap */

const delay = require('@highoutput/delay').default;
const Amqp = require('../build/index');

async function Client() {
  const amqp = new Amqp.default({});
  const client = await amqp.createPublisher('Reconnection', { timeout: 10000 });

  while (true) {
    console.log('Publishing...');
    await client({ num: Math.random() * 100000 });
    await delay(800);
  }
}

Client();
