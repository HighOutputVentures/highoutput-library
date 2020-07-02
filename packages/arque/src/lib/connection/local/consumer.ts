import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import Queue from './queue';

export default class {
  private credits: number;

  private group = new AsyncGroup();

  private stopping = false;

  private listener = () => {
    this.fetch();
  }

  private options: {
    concurrency: number;
  };

  private fetch() {
    if (this.credits === 0 || this.stopping) {
      return;
    }

    const messages = this.queue.dequeue(this.credits);
    this.credits -= messages.length;

    messages.forEach((message) => {
      this.group.add((async () => {
        try {
          await this.handler(message);
        } finally {
          this.credits += 1;
          this.fetch();
        }
      })());
    });
  }

  constructor(
    private queue: Queue,
    private handler: (...args: any[]) => Promise<any>,
    options: { concurrency?: number } = {},
  ) {
    this.options = R.mergeDeepLeft({
      concurrency: 1,
    }, options);

    this.credits = this.options.concurrency;

    this.queue.on('enqueue', this.listener);
  }

  async stop() {
    this.stopping = true;

    this.queue.removeListener('enqueue', this.listener);

    await this.group.wait();
  }
}
