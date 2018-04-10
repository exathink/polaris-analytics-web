const rewireBundleAnalyzer = require('react-app-rewire-bundle-analyzer');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.devtool = false;
  }
  return config;
};
