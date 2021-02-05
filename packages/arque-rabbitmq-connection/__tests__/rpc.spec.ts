import * as R from 'ramda';
import delay from '@highoutput/delay';
import { nanoid } from 'nanoid';
import AMQP, { Worker } from '../src';
import { chance, expect } from './helper';

describe('RPC', () => {
  let amqp: AMQP;

  before(function () {
    amqp = new AMQP({ hostname: 'rabbitmq' });
  });

  after(function () {
    return amqp.stop();
  });

  describe('Simple RPC', () => {
    before(function () {
      this.workers = [];
      this.clients = [];
    });

    after(function () {
      return Promise.all([
        ...this.clients.map((client) => client.stop()),
        ...this.workers.map((worker) => worker.stop()),
      ]);
    });

    const examples = [
      { args: 'Hello World', response: null },
      { args: 25, response: null },
      { args: true, response: null },
      { args: { value: true }, response: null },
      { args: [1, 2, 3, 4, 5], response: null },
      { args: null, response: 'Hello World' },
      { args: null, response: 25 },
      { args: null, response: { value: true } },
      { args: null, response: [1, 2, 3, 4, 5] },
    ];

    it('should response correct data', async function () {
      await Promise.all(
        examples.map(async (data) => {
          const queue = nanoid();
          const client = await amqp.createClient(queue, {
            serialize: true,
          });
          this.clients.push(client);
          this.workers.push(
            await amqp.createWorker(queue, (args: any) => {
              expect(args).to.deep.equal(data.args);
              return data.response as any;
            }),
          );

          await expect(client(data.args)).to.eventually.deep.equal(
            data.response,
          );
        }),
      );
    });
  });

  describe('Multiple Worker ', () => {
    context('GIVEN a single client and multiple workers', () => {
      before(async function () {
        this.client = await amqp.createClient('test');
        this.workers = await Promise.all(
          R.times((index) =>
            amqp.createWorker(
              'test',
              async () => {
                this.workers[index].messagesReceivedCount =
                  (this.workers[index].messagesReceivedCount || 0) + 1;
              },
              {
                concurrency: 5,
              },
            ),
          )(3),
        );
      });

      after(function () {
        return Promise.all([
          this.client.stop(),
          ...this.workers.map((worker) => worker.stop()),
        ]);
      });

      context('When multiple messages sent from the client', () => {
        before(async function () {
          await Promise.all(R.times((value) => this.client({ value }))(150));
        });

        it('should be distributed into all of the worker', async function () {
          this.workers.forEach((worker) => {
            expect(worker.messagesReceivedCount).to.gte(25);
          });
        });
      });
    });
  });

  describe('Single Worker Failure', () => {
    context('Given a single client and multiple workers', () => {
      before(async function () {
        const queue = nanoid();
        this.client = await amqp.createClient(queue);
        this.workers = await Promise.all(
          R.times((index) =>
            amqp.createWorker(
              queue,
              async (message) => {
                this.workers[index].messagesReceivedCount =
                  (this.workers[index].messagesReceivedCount || 0) + 1;

                await delay(100 + 100 * Math.random());

                return {
                  message,
                  worker: index,
                };
              },
              {
                concurrency: 1,
              },
            ),
          )(3),
        );
      });

      after(function () {
        return Promise.all([
          this.client.stop(),
          ...this.workers.map((worker) => worker.stop()),
        ]);
      });

      context(
        'When client send multiple messages and one worker stopped',
        () => {
          before(async function () {
            this.promise = Promise.all(
              R.times((value) => this.client({ value }))(20),
            );

            await delay(250 + 250 * Math.random());

            await chance.pickone<Worker>(this.workers).stop();
          });

          it('should handled all messages', async function () {
            await this.promise;
            expect(
              R.sum(
                R.map<number, number>(
                  (item) => item || 0,
                  R.pluck('messagesReceivedCount' as any, this.workers),
                ),
              ),
            ).to.eq(20);
          });
        },
      );
    });
  });

  describe('All Workers Failure', () => {
    context(
      'Given a single client and multiple workers with delayed response',
      () => {
        before(async function () {
          this.queue = nanoid();
          this.client = await amqp.createClient(this.queue);
          this.workers = await Promise.all(
            R.times((index) =>
              amqp.createWorker(
                this.queue,
                async (message) => {
                  this.workers[index].messagesReceivedCount =
                    (this.workers[index].messagesReceivedCount || 0) + 1;

                  await delay(100 + 100 * Math.random());
                  return {
                    message,
                    worker: index,
                  };
                },
                {
                  concurrency: 1,
                },
              ),
            )(5),
          );
        });

        after(async function () {
          return Promise.all([
            this.client.stop(),
            ...this.workers.map((worker) => worker.stop()),
          ]);
        });

        context(
          'When client send multiple messages and all workers restarted',
          () => {
            before(async function () {
              this.promise = Promise.all(
                R.times((value) => this.client({ value }))(20),
              );

              await delay(250 + 250 * Math.random());

              await Promise.all(R.map((worker) => worker.stop(), this.workers));

              await Promise.all(
                R.times(async (index) => {
                  const worker: any = await amqp.createWorker(
                    this.queue,
                    async (message: any) => {
                      await delay(100 + 100 * Math.random());

                      worker.messagesReceivedCount =
                        (worker.messagesReceivedCount || 0) + 1;

                      return {
                        message,
                        worker: this.workers.length + index,
                      };
                    },
                    { concurrency: 1 },
                  );

                  this.workers.push(worker);
                }, 5),
              );
            });

            it('should handled all messages', async function () {
              await this.promise;
              expect(
                R.sum(
                  R.map<number, number>(
                    (item) => item || 0,
                    R.pluck('messagesReceivedCount' as any, this.workers),
                  ),
                ),
              ).to.eq(20);
            });
          },
        );
      },
    );
  });

  describe('Multiple Clients', () => {
    context('GIVEN multiple clients and a single worker', () => {
      before(async function () {
        const queue = nanoid();

        this.clients = await Promise.all(
          R.times(() => amqp.createClient(queue), 3),
        );

        this.worker = await amqp.createWorker(
          queue,
          async () => {
            this.worker.messagesReceivedCount =
              (this.worker.messagesReceivedCount || 0) + 1;
          },
          {
            concurrency: 1000,
          },
        );

        this.promise = await Promise.all(
          this.clients.map((client: any) =>
            Promise.all(R.times((value) => client({ value }), 50)),
          ),
        );
      });

      after(function () {
        return Promise.all([
          ...this.clients.map((client) => client.stop()),
          this.worker.stop(),
        ]);
      });

      it('should receive all the messages sent by all the clients', async function () {
        await this.promise;
        expect(this.worker.messagesReceivedCount).to.eq(150);
      });
    });
  });

  describe('Serialization', () => {
    before(function () {
      this.clients = [];
      this.workers = [];
    });

    after(function () {
      return Promise.all([
        ...this.clients.map((client) => client.stop()),
        ...this.workers.map((worker) => worker.stop()),
      ]);
    });

    const examples = {
      Buffer: Buffer.from('hello'),
      Set: new Set([1, 2, 3, 4, 5]),
      Map: new Map([
        ['one', 1],
        ['two', 2],
        ['three', 3],
        ['four', 4],
        ['five', 5],
      ]),
      Date: new Date(),
      Complex: {
        Buffer: Buffer.from('hello'),
        Set: new Set([1, 2, 3, 4, 5]),
        Map: new Map([
          ['one', 1],
          ['two', 2],
          ['three', 3],
          ['four', 4],
          ['five', 5],
        ]),
        Date: new Date(),
      },
    };

    it('should correclty serialize data', async function () {
      await Promise.all(
        Object.keys(examples).map(async (type) => {
          const queue = nanoid();
          const client = await amqp.createClient(queue, {
            serialize: true,
          });

          this.clients.push(client);
          this.workers.push(
            await amqp.createWorker(queue, (args: any) => {
              expect(args).to.deep.equal(examples[type]);
              return examples[type];
            }),
          );

          await expect(client(examples[type])).to.eventually.deep.equal(
            examples[type],
          );
        }),
      );
    });
  });
});
