import assert from 'assert';
import hash from '../src';

describe('hash', () => {
  it('should hash given string', () => {
    const hashed = hash('Hello World!', {
      salt: 'pGs0U3zFHU0LG9JK1uF4',
    }).toString('base64');

    assert.ok(typeof hashed === 'string');
  });
});
