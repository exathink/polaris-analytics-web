const { injectBabelPlugin } = require('react-app-rewired');
const rewireBundleAnalyzer = require('react-app-rewire-bundle-analyzer');
const rewireReactIntl = require('react-app-rewire-react-intl');
const rewireInlineImportGraphqlAst = require('react-app-rewire-inline-import-graphql-ast');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.devtool = false;
  }
  config =  rewireReactIntl(config, env, {
      messagesDir: './build/messages/',
  });

  config =  rewireInlineImportGraphqlAst(config, env);

  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    config
  );

  config = injectBabelPlugin(['import', {libraryName: 'lodash', libraryDirectory: "", camel2DashComponentName: false }],
    config
  );

  // uncomment this to launch bundle analyzer after build.
  //config = rewireBundleAnalyzer(config, env);

  return config;
};
