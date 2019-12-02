const path = require('path');
const { performance } = require('perf_hooks');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');
const createCache = require('./cache');
const { getOptimizelyClient, getOptimizelyData } = require('./optimizely');

const [getFromCache, clearCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'render', { html: null, helmet: null, styleTags: null });

const watch = (location, entry, verb) => {
  let logTiming = true;
  const loadClient = () => {
    const startTime = performance.now();
    const required = require(entry);
    const endTime = performance.now();
    if (logTiming) {
      console.log(`SSR ${verb} took ${Math.round(endTime - startTime)}ms`);
      logTiming = false;
    }
    return required;
  };
  const dumpClient = () => {
    // clear changed files from the require cache
    Object.keys(require.cache).forEach((file) => {
      if (file.startsWith(location)) delete require.cache[file];
    });
    // clear the server rendering cache
    clearCache();
    // we're reloading off the disc, so print out the perf info again
    logTiming = true;
  };
  const watcher = require('chokidar').watch(location).on('ready', () => {
    // dump the client and ssr cache whenever the code changes, it'll reload on the next ssr render
    watcher.on('all', dumpClient);
    dumpClient(); // dump the client now, in case something changed during startup
    try {
      // try importing right away so we don't have to wait
      // but if it fails now it's probably because there are no past builds to use
      loadClient();
    } catch (error) {
      console.warn('Failed to load client code for ssr. This either means the initial build is not finished or there is a bug in the code');
      console.error(error.toString());
      captureException(error);
    }
  });
  return loadClient;
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
  tempRequireClient = watch(SRC, path.join(SRC, './server'), 'transpile');
} else if (process.env.BUILD_TYPE === 'watcher') {
  const BUILD = path.join(__dirname, '../build');
  tempRequireClient = watch(path.join(BUILD, './server.js'), path.join(BUILD, './server'), 'reload');
} else if (process.env.BUILD_TYPE === 'static') {
  // use the default requireClient and load the built file with no extra logic
}
const requireClient = tempRequireClient;

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

const render = async (url, { OPTIMIZELY_ID, ...context }) => {
  const { Page, resetState } = requireClient();
  resetState();
  const sheet = new ServerStyleSheet();
  const helmetContext = {};
  const routerContext = {};

  // don't use <ReactSyntax /> so babel can stay scoped to the src directory
  const page = React.createElement(Page, {
    ...context,
    OPTIMIZELY_ID,
    origin: url.origin,
    route: url.pathname + url.search + url.hash,
    optimizely: await getOptimizelyClient(),
    helmetContext,
    routerContext,
  });

  const html = ReactDOMServer.renderToString(sheet.collectStyles(page));
  const styleTags = sheet.getStyleTags();
  sheet.seal();

  // grab the latest optimizely again because we didn't use the one from context
  const OPTIMIZELY_DATA = await getOptimizelyData();
  // OPTIMIZELY_ID got extracted above, so it isn't in the result here
  // if it was we would send the id of the user that first requested this page to everyone after
  return { ...context, OPTIMIZELY_DATA, html, styleTags, helmet: helmetContext.helmet, redirect: routerContext.url };
};

module.exports = async (url, context) => {
  const optimizelyClient = await getOptimizelyClient();
  const optimizelyAttributes = { hasLogin: context.SSR_SIGNED_IN, hasProjects: false };
  const key = [
    context.SSR_SIGNED_IN ? 'signed-in' : 'signed-out',
    ...Object.entries(context.AB_TESTS).map(([test, assignment]) => `${test}=${assignment}`),
    ...optimizelyClient.getEnabledFeatures(String(context.OPTIMIZELY_ID), optimizelyAttributes),
    url,
  ];
  return getFromCache(key.join(' '), render, url, context);
};
