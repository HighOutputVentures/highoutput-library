import assert from 'assert';
import hmac from '../src';

describe('hmac', () => {
  it('should hash given string', () => {
    const hashed = hmac('Hello World!', {
      key: 'pGs0U3zFHU0LG9JK1uF4',
    }).toString('base64');

    assert.ok(typeof hashed === 'string');
  });
});
