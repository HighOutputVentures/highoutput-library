/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable new-cap */

const delay = require('@highoutput/delay').default;
const Amqp = require('../build/index');
const config = require('./config');

async function Client() {
  const amqp = new Amqp.default(config);
  const client = await amqp.createClient('Reconnection', { timeout: 5000 });

  while (true) {
    console.log('Rpc: Sending...');
    (async () => {
      const response = await client({ num: Math.random() * 100000 });
      console.log('Response: ', response);
    })();
    await delay(800);
  }
}

Client();
