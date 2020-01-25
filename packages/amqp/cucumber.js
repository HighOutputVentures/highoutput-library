const common = [
  'test/**/*.feature',
  '--require-module ts-node/register',
  '--require test/**/*.ts',
  '--format progress-bar',
  '--format node_modules/cucumber-pretty',
  '--tags "not @ignore"',
].join(' ');

module.exports = {
  default: common,
};
