<<<<<<< HEAD
function webpackBackgroundProcess() {
  // Launch webpack in a separate process because it blocks a bit
  const { spawn } = require('child_process');
  const env = { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' };
  spawn('webpack', ['--watch', '--info-verbosity', 'verbose'], { env, stdio: 'inherit' });
}

=======
>>>>>>> 56b0142b5c5fd5375dbee2c4dbaa853e79f65501
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
  switch (process.env.DEPLOY_ENV) {
    case 'production':
      // Production here is glitch.com/~community!
      // webpack --watch is running via prestart
      break;
    case 'ci':
      // Do not webpack, we have already built
      break;
    default:
      // Use webpack middleware for dev/staging/etc.
      app.use(webpackExpressMiddleware());
      break;
  }
};
