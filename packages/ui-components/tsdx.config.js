const css = require('rollup-plugin-import-css');

module.exports = {
  rollup(config, options) {
    config.plugins = [css(), ...config.plugins];

    return config;
  },
};
