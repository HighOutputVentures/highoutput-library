/* eslint-disable no-restricted-syntax */
import { Given, When, Then } from 'cucumber';
import delay from '@highoutput/delay';
import { expect } from 'chai';

Given('a publisher and a worker with virtual topics', async function () {
  this.publisher = await this.amqp.createPublisher('test.virtual.one');
  this.worker = await this.amqp.createWorker('VirtualTopicConsumers.A.test.virtual.*', async (message: any) => {
    this.worker.message = message;
  });
});

When('I send a message from the publisher with the virtual topic', async function () {
  this.message = { value: Math.random() };
  this.publisher(this.message);
  await delay(200);
});

Then('the worker should receive the message', async function () {
  expect(this.worker.message).to.deep.equal(this.message);
});

Given(
  'a single publisher and multiple workers with queues that match the topic set by the publisher',
  async function () {
    this.publisher = await this.amqp.createPublisher('test.virtual.one');
    this.messages = {};
    this.workers = await Promise.all(
      ['test.virtual.one', 'test.virtual.*']
        .map((topic) => this.amqp.createWorker(
          `VirtualTopicConsumers.A.${topic}`,
          async (message: any) => {
            this.messages[topic] = message;
          },
        )),
    );
  },
);

Then('all the workers should receive the message', async function () {
  for (const [, value] of Object.entries(this.messages)) {
    expect(value).to.deep.equal(this.message);
  }
});
