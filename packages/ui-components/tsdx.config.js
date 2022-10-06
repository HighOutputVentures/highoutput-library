const css = require('rollup-plugin-import-css');
const url = require('rollup-plugin-url');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      ...config.plugins,
      css(),
      url({
        include: ['**/*.ttf', '**/*.css'],
        limit: Infinity,
      }),
    ];

    return config;
  },
};
