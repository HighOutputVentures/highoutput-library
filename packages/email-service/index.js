const Application = require('flowd');
const { KoaServer } = require('flowd-koa');

const RequestApplication = require('./application/request');

const Config = require('./config');

const applications = [RequestApplication];

const app = new Application();

app.addServer(new KoaServer(
  Config.Middleware,
  applications,
  Config.Server.host,
  Config.Server.port,
));

module.exports = {
  app,
  instance: app.start(),
};
