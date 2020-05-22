/* eslint-disable no-restricted-syntax */
import { Given, When, Then } from 'cucumber';
import R from 'ramda';
import { expect } from 'chai';
import delay from '@highoutput/delay';

Given('a single publisher and multiple subscribers', async function () {
  this.publisher = await this.amqp.createPublisher('test');
  this.subscribers = await Promise.all(R.times((index) => this.amqp.createSubscriber('test', async (message: any) => {
    this.subscribers[index].message = message;
  }), 3));
});

When('I send a message from the publisher', async function () {
  this.message = { value: Math.random() };
  await this.publisher(this.message);
  await delay(200);
});

Then('all subscribers should receive the same message', async function () {
  for (const subscriber of this.subscribers) {
    expect(subscriber.message).to.deep.equal(this.message);
  }
});

Given([
  'multiple publishers with different topics and a subscriber',
  'with topic that matches all topics set by publishers',
].join(' '), async function () {
  this.publishers = await Promise.all(
    ['one', 'two', 'three'].map((topic) => this.amqp.createPublisher(`test.${topic}`)),
  );
  this.subscriber = await this.amqp.createSubscriber('test.*', async () => {
    this.subscriber.messagesReceivedCount = (this.subscriber.messagesReceivedCount || 0) + 1;
  });
});

When('I send a message from each of the publishers', async function () {
  await Promise.all(this.publishers.map(
    (publisher: (...args: any[]) => void) => publisher({ value: Math.random() }),
  ));

  await delay(200);
});

Then('the subscriber should receive all messages', async function () {
  expect(this.subscriber.messagesReceivedCount).to.equal(this.publishers.length);
});

Given([
  'multiple publishers with different topics and a subscriber',
  'with topic that matches the topic set by one of the publishers',
].join(' '), async function () {
  this.publishers = await Promise.all(
    ['one', 'two', 'three'].map((topic) => this.amqp.createPublisher(`test.${topic}`)),
  );
  this.subscriber = await this.amqp.createSubscriber('test.one', async () => {
    this.subscriber.messagesReceivedCount = (this.subscriber.messagesReceivedCount || 0) + 1;
  });
});

Then('the subscriber should receive only the message sent by one of the publishers', async function () {
  expect(this.subscriber.messagesReceivedCount).to.equal(1);
});
