const images = require('rollup-plugin-image-files');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      images({ incude: ['**/*.png', '**/*.jpg', '**/*.svg'] }),
      ...config.plugins,
    ];

    return config;
  },
};
