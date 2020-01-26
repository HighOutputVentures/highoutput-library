const common = [
  'test/**/*.feature',
  '--require-module ts-node/register',
  '--require test/**/*.ts',
  '--format progress-bar',
  '--format node_modules/cucumber-pretty',
];

module.exports = {
  default: [...common, '--tags "not @ignore and not @only"'].join(' '),
  only: [...common, '--tags "@only"'].join(' '),
};
