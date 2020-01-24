import {
  Given, When, Then, Before, After,
} from 'cucumber';
import { expect } from 'chai';
import AMQP from '../../../src/index';

Before(async function () {
  const amqp = new AMQP();

  this.client = await amqp.createClient('test');
  this.worker = await amqp.createWorker('test', async () => this.response);
});

After(async () => {
  console.log('after');
});

Given('a client and a worker in the same scope', () => {
  expect(true);
});

Given('the worker responds with {}', function (response) {
  this.response = JSON.parse(response);
});

When('I send {} from the client', async function (message) {
  await this.client(JSON.parse(message));
});

Then('I should receive {} on the worker', function (message) {
  expect(JSON.parse(message)).to.deep.equal(this.message);
});

Then('I should receive {} on the client', function (response) {
  expect(JSON.parse(response)).to.deep.equal(this.response);
});
