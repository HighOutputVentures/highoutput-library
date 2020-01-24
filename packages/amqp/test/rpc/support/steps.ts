import {
  Given, When, Then, Before, After,
} from 'cucumber';
import { expect } from 'chai';
import Amqp from '../../../src/index';

Before(async function () {
  this.amqp = new Amqp();
});

After(async function () {
  await this.amqp.stop();
});

Given('a client and a worker in the same scope', async function () {
  this.client = await this.amqp.createClient('test');
  this.worker = await this.amqp.createWorker('test', async (message: string) => {
    this.message = message;
    return this.response;
  });
});

Given('the worker responds with {}', function (response) {
  this.response = JSON.parse(response);
});

When('I send {} from the client', async function (message) {
  this.response = await this.client(JSON.parse(message));
});

Then('I should receive {} on the worker', function (message) {
  expect(JSON.parse(message)).to.deep.equal(this.message);
});

Then('I should receive {} on the client', function (response) {
  expect(JSON.parse(response)).to.deep.equal(this.response);
});
