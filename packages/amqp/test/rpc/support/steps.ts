/* eslint-disable no-restricted-syntax */
import {
  Given, When, Then, Before, After,
} from 'cucumber';
import { expect } from 'chai';
import R from 'ramda';
import delay from '@highoutput/delay';
import crypto from 'crypto';
import Amqp from '../../../src/index';

Before(async function () {
  this.amqp = new Amqp();
});

After(async function () {
  await this.amqp.stop();
});

Given('a client and a worker', async function () {
  this.client = await this.amqp.createClient('test');
  this.worker = await this.amqp.createWorker('test', async (message: string) => {
    this.message = message;
    return this.response;
  });
});

Given('the worker responds with {}', function (response) {
  this.response = JSON.parse(response);
});

When('I send {} message from the client', async function (message) {
  this.response = await this.client(JSON.parse(message));
});

Then('I should receive {} on the worker', function (message) {
  expect(JSON.parse(message)).to.deep.equal(this.message);
});

Then('I should receive {} on the client', function (response) {
  expect(JSON.parse(response)).to.deep.equal(this.response);
});

Given('a single client and multiple workers', async function () {
  this.client = await this.amqp.createClient('test');

  this.workers = await Promise.all(R.times((index) => this.amqp.createWorker('test', async () => {
    this.workers[index].messagesReceivedCount = (this.workers[index].messagesReceivedCount || 0) + 1;
  }, { concurrency: 5 }), 3));
});

When('I send multiple messages from the client', async function () {
  await Promise.all(R.times((value) => this.client({ value }), 150));
});

Then('the messages should be distributed into all of the workers', function () {
  for (const worker of this.workers) {
    expect(worker.messagesReceivedCount).to.be.above(25);
  }
});

Given('multiple clients and a single worker', async function () {
  this.clients = await Promise.all(R.times(() => this.amqp.createClient('test'), 3));

  this.worker = await this.amqp.createWorker('test', async () => {
    this.worker.messagesReceivedCount = (this.worker.messagesReceivedCount || 0) + 1;
  }, { concurrency: 1000 });
});

When('I send multiple messages from each of the clients', async function () {
  await Promise.all(this.clients.map((client: any) => Promise.all(R.times((value) => client({ value }), 50))));
});

Then('the worker should receive all the messages sent by all the clients', function () {
  expect(this.worker.messagesReceivedCount).to.equal(150);
});

Given('a worker with a concurrency of {int}', async function (concurrency: number) {
  this.concurrency = concurrency;
  this.client = await this.amqp.createClient('test');
  this.worker = await this.amqp.createWorker('test', async () => {
    await this.handleMessage();
  }, {
    concurrency,
  });
});

Given('the worker handles each message for {int} milliseconds', async function (duration: number) {
  this.handleMessage = () => delay(duration);
});

When('I send {int} message\\(s) from the client', async function (messagesCount: number) {
  this.messagesCount = messagesCount;
  const timestamp = Date.now();
  await Promise.all(R.times((value) => this.client({ value }), messagesCount));
  this.duration = Date.now() - timestamp;
});

Then('all the messages should be handled in about {int} milliseconds', function (duration: number) {
  expect(this.duration).to.be.gte(duration);
  expect(this.duration).to.be.lt(duration + (150 / this.concurrency) * this.messagesCount);
});

Given('a message that contains class objects', async function () {
  this.examples = {
    Buffer: crypto.randomBytes(16),
    Set: new Set([1, 2, 3, 4, 5]),
    Map: new Set([['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5]]),
    Date: new Date(),
  };
});

When('I send a {} from the client', async function (type: string) {
  await this.client({ value: this.examples[type] });
});

Then('the worker should also receive a {}', async function (type: string) {
  expect(this.message).to.deep.equal({ value: this.examples[type] });
});
