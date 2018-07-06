const rewireBundleAnalyzer = require('react-app-rewire-bundle-analyzer');
const rewireReactIntl = require('react-app-rewire-react-intl');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.devtool = false;
  }
  config =  rewireReactIntl(config, env, {
      messagesDir: './build/messages/',
  });

  return config;
};
