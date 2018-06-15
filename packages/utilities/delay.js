const ms = require('ms');

module.exports = duration => new Promise((resolve) => {
  setTimeout(resolve, (typeof duration === 'string') ? ms(duration) : duration);
});
