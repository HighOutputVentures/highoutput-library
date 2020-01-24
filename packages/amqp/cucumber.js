const common = [
  'features/**/*.feature',
  '--require-module ts-node/register',
  '--require features/**/*.ts',
  '--format progress-bar',
  '--format node_modules/cucumber-pretty',
].join(' ');

module.exports = {
  default: common,
};
