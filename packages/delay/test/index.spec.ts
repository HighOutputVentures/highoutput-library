import assert from 'assert';
import delay from '../src';

describe('delay', () => {
  it('should block on given duration', async () => {
    const start = new Date();
    await delay('4s');
    const end = new Date();

    assert.ok((end.getTime() - start.getTime()) / 1000 > 3);
  });
});
