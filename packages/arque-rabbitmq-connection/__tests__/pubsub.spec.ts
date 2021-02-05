import * as R from 'ramda';
import delay from '@highoutput/delay';
import AMQP from '../src';
import { chance, expect } from './helper';

describe('PubSub', () => {
  let amqp: AMQP;

  before(function () {
    amqp = new AMQP({
      hostname: process.env.CI ? 'rabbitmq' : 'localhost',
      port: process.env.CI ? 5672 : 5670,
    });
  });

  after(function () {
    return amqp.stop();
  });

  describe('Multiple Subscribers', () => {
    before(async function () {
      const topic = chance.first().toLowerCase();
      this.publisher = await amqp.createPublisher(topic);
      this.subscribers = await Promise.all(
        R.times((index) =>
          amqp.createSubscriber(topic, async (message) => {
            this.subscribers[index].message = message;
          }),
        )(3),
      );

      this.message = { value: Math.random() };

      await this.publisher(this.message);
      await delay(200);
    });

    after(function () {
      return Promise.all([
        this.publisher.stop(),
        ...this.subscribers.map((subscriber) => subscriber.stop()),
      ]);
    });

    it('it should receive the same message', async function () {
      this.subscribers.forEach((subscriber) => {
        expect(subscriber.message).to.deep.equal(this.message);
      });
    });
  });

  describe('General Topic', () => {
    before(async function () {
      const topic = chance.first().toLowerCase();
      this.publishers = await Promise.all(
        ['one', 'two', 'three', 'four'].map((t) =>
          amqp.createPublisher(`${topic}.${t}`),
        ),
      );
      this.subscriber = await amqp.createSubscriber(`${topic}.*`, async () => {
        this.subscriber.messagesReceivedCount =
          (this.subscriber.messagesReceivedCount || 0) + 1;
      });

      this.message = { value: Math.random() };
      await Promise.all(
        this.publishers.map((publisher) => publisher({ value: Math.random() })),
      );

      await delay(200);
    });

    after(function () {
      return Promise.all([
        this.subscriber.stop(),
        ...this.publishers.map((publisher) => publisher.stop()),
      ]);
    });

    it('should receive all message', async function () {
      expect(this.subscriber.messagesReceivedCount).to.equal(
        this.publishers.length,
      );
    });
  });

  describe('Specific Topic', () => {
    before(async function () {
      const topic = chance.first().toLowerCase();
      this.publishers = await Promise.all(
        ['one', 'two', 'three', 'four'].map((t) =>
          amqp.createPublisher(`${topic}.${t}`),
        ),
      );
      this.subscriber = await amqp.createSubscriber(
        `${topic}.one`,
        async () => {
          this.subscriber.messagesReceivedCount =
            (this.subscriber.messagesReceivedCount || 0) + 1;
        },
      );

      this.message = { value: Math.random() };
      await Promise.all(
        this.publishers.map((publisher) => publisher({ value: Math.random() })),
      );

      await delay(200);
    });

    after(function () {
      return Promise.all([
        this.subscriber.stop(),
        ...this.publishers.map((publisher) => publisher.stop()),
      ]);
    });

    it('should receive only the message sent by one of the publishers', async function () {
      expect(this.subscriber.messagesReceivedCount).to.eq(1);
    });
  });
});
