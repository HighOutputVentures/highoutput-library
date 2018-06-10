const Middleware = require('./middleware');
const Server = require('./server');
const AWS = require('./aws');

module.exports = {
  Middleware,
  Server,
  AWS,
  TemplateDirectory: process.env.TEMPLATE_DIRECTORY,
};
