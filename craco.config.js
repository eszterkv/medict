const CracoAntDesignPlugin = require('craco-antd');

process.env.BROWSER = 'none';

module.exports = {
  jest: {
    configure(config) {
      config.transformIgnorePatterns = [
        '/node_modules/(?!antd|rc-pagination|rc-calendar|rc-tooltip)/.+\\.js$',
      ];
      return config;
    },
  },
  plugins: [{ plugin: CracoAntDesignPlugin }],
};
