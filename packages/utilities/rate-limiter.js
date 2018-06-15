const { RateLimiter } = require('limiter');
const randomInt = require('random-int');
const delay = require('./delay');

module.exports = (params) => {
  const {
    tokensPerInterval, interval,
    maxRetry = 10, minInterval = 100,
  } = params;

  const limiter = new RateLimiter(tokensPerInterval, interval);

  async function consumer(consumeToken, cb) {
    if (consumeToken > tokensPerInterval) {
      throw new Error('Cannot consume more than the available token.');
    }

    const remaining = limiter.getTokensRemaining();
    if (consumeToken > remaining) {
      return (async () => {
        await delay(randomInt(minInterval, limiter.tokenBucket.interval));
        const retry = (this.retry || 0) + 1;
        if (retry >= maxRetry) {
          throw new Error(`Job failed after ${retry} retry.`);
        }

        return consumer.call({ ...consumer, retry }, consumeToken, cb);
      })();
    }

    limiter.removeTokens(consumeToken, cb);
    return Promise.resolve();
  }

  return consumer;
};
