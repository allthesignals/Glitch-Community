const path = require('path');
const { performance } = require('perf_hooks');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');
const createCache = require('./cache');
const { getOptimizelyClient, getOptimizelyData } = require('./optimizely');

const [getFromCache, clearCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'render', { html: null, helmet: null, styleTags: null });

const watch = (location, entry, verb) => {
  let logTiming = true;
  const requireClient = () => {
    const startTime = performance.now();
    const required = require(entry);
    const endTime = performance.now();
    if (logTiming) {
      console.log(`SSR ${verb} took ${Math.round(endTime - startTime)}ms`);
      logTiming = false;
    }
    return required;
  };
  const forceReload = () => {
    // clear changed files from the require cache
    Object.keys(require.cache).forEach((file) => {
      if (file.startsWith(location)) delete require.cache[file];
    });
    // clear the server rendering cache
    clearCache();
    // print out some perf info next time we call require
    logTiming = true;
  };
  // clear client code from the require cache whenever it gets changed
  // it'll get loaded off the disk again when the render calls require
  const watcher = require('chokidar').watch(location).on('ready', () => {
    watcher.on('all', forceReload);
    forceReload();
    // try importing right away so we don't have to wait
    // but if it fails now it's probably because there are no past builds to use
    try {
      requireClient();
    } catch (error) {
      console.warn('Failed to load client code for ssr. This either means the initial build is not finished or there is a bug in the code');
      console.error(error.toString());
      captureException(error);
    }
  });
  return requireClient;
};

let tempRequireClient = () => require('../src/server');

if ((!process.env.BUILD_TYPE || process.env.BUILD_TYPE === 'memory') && process.env.NODE_ENV !== 'production') {
  const SRC = path.join(__dirname, '../src');
  const stylus = require('stylus');
  require('@babel/register')({
    only: [(location) => location.startsWith(SRC)],
    configFile: path.join(__dirname, '../.babelrc.node.json'),
    plugins: [
      ['css-modules-transform', {
        preprocessCss: (data, filename) => stylus.render(data, { filename }),
        extensions: ['.styl'],
      }],
    ],
  });
  requireClient = watch(SRC, path.join(SRC, './server'), 'transpile');
} else if (process.env.BUILD_TYPE === 'watcher') {
  const BUILD = path.join(__dirname, '../build');
  requireClient = watch(path.join(BUILD, './server.js'), path.join(BUILD, './server'), 'reload');
} else if (process.env.BUILD_TYPE === 'static') {
  // use the default requireClient and load the built file with no extra logic
}

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

const render = async (url, { OPTIMIZELY_ID, ...context }) => {
  const { Page, resetState } = requireClient();
  resetState();
  const sheet = new ServerStyleSheet();
  const helmetContext = {};

  // don't use <ReactSyntax /> so babel can stay scoped to the src directory
  const page = React.createElement(Page, {
    ...context,
    OPTIMIZELY_ID,
    origin: url.origin,
    route: url.pathname + url.search + url.hash,
    optimizely: await getOptimizelyClient(),
    helmetContext,
  });

  const html = ReactDOMServer.renderToString(sheet.collectStyles(page));
  const styleTags = sheet.getStyleTags();
  sheet.seal();
  // grab the latest optimizely again because we didn't use the one from context
  const OPTIMIZELY_DATA = await getOptimizelyData();
  // OPTIMIZELY_ID got extracted above, so it isn't in the result here
  // if it was we would send the id of the user that first requested this page to everyone after
  return { ...context, OPTIMIZELY_DATA, html, helmet: helmetContext.helmet, styleTags };
};

module.exports = async (url, context) => {
  const optimizelyClient = await getOptimizelyClient();
  const key = [
    context.SSR_SIGNED_IN ? 'signed-in' : 'signed-out',
    ...Object.entries(context.AB_TESTS).map(([test, assignment]) => `${test}=${assignment}`),
    ...optimizelyClient.getEnabledFeatures(String(context.OPTIMIZELY_ID)),
    url,
  ];
  return getFromCache(key.join(' '), render, url, context);
};
