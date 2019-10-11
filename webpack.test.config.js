/**
 * Webpack config for running the tests via mocha.
 */
const sharedConfig = require('./webpack.config');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// eslint-disable-next-line func-names
module.exports = function(env) {
  return {
    ...sharedConfig,

    mode: 'development',
    devtool: 'inline-source-map',
    target: 'node',
    optimization: {},
    output: {
      devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            compact: true,
            // we can't rely on babel's auto config loading for stuff in node_modules
            configFile: path.resolve(__dirname, './.babelrc.client.json'),
          },
        },
        {
          test: /\.styl/,
          use: [
            {
              loader: 'css-loader?modules',
              options: {
                onlyLocals: true,
                sourceMap: false, // no css source maps in production
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
            {
              loader: 'stylus-loader',
              options: {
                compress: false,
              },
            },
          ],
        }
        // ...
      ],
    },
  };
};
