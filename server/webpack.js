function webpackExpressMiddleware() {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  const compiler = webpack(webpackConfig);

  const webpackMiddleware = require('webpack-dev-middleware');
  const stats = { children: false };
  const middleware = webpackMiddleware(compiler, { stats, writeToDisk: true });

  let ready = false;
  middleware.waitUntilValid(() => {
    ready = true;
  });

  return function(request, response, next) {
    if (ready) {
      return middleware(request, response, next);
    }
    return next();
  };
}

module.exports = function(app) {
  if (!process.env.BUILD_TYPE || process.env.BUILD_TYPE === 'memory') {
    // Use webpack middleware for dev/staging/etc.
    app.use(webpackExpressMiddleware());
  }
};
