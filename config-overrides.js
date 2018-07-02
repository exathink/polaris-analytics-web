const rewireBundleAnalyzer = require('react-app-rewire-bundle-analyzer');
const {injectBabelPlugin} = require('react-app-rewired');
const rewireReactIntl = require('react-app-rewire-react-intl');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.devtool = false;
  }
  config =  rewireReactIntl(config, env, {
      messagesDir: './build/messages/',
  });
  // set up relay machinery
  config = injectBabelPlugin('babel-plugin-relay', config);
  return config;
};
