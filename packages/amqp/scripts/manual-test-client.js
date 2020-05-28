/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable new-cap */

const R = require('ramda');
const delay = require('@highoutput/delay').default;
const Amqp = require('../build/index');
const config = require('./config');

async function Client() {
  const amqp = new Amqp.default(config);
  const client = await amqp.createClient('Re.connection', { timeout: '20s' });

  while (true) {
    console.log('Rpc: Sending...');
    (async () => {
      const response = await Promise.all(
        R.times(() => client({ num: Math.random() * 50000 }), Math.ceil(Math.random() * 20)),
      );
      console.log('Response: ', response);
    })();
    await delay(800 + Math.ceil(Math.random() * 5000));
  }
}

Client();
