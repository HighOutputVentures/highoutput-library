import { EventEmitter } from 'events';

export default class extends EventEmitter {
  private queue: any[] = [];

  constructor() {
    super();
    this.setMaxListeners(Infinity);
  }

  enqueue(message: any) {
    this.queue.push(message);
    this.emit('enqueue');
  }

  dequeue(count = 1) {
    return this.queue.splice(0, Math.min(count, this.queue.length));
  }

  get size() {
    return this.queue.length;
  }
}
