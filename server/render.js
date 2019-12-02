const path = require('path');
const { performance } = require('perf_hooks');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');
const createCache = require('./cache');
const { getOptimizelyClient, getOptimizelyData } = require('./optimizely');

const setup = () => {
  const src = path.join(__dirname, '../src');
  const build = path.join(__dirname, '../build/node/');
  if (!process.env.BUILD_TYPE || process.env.BUILD_TYPE === 'memory') {
    // transpile on render to ensure we always use the latest code
    require('@babel/register')({
      only: [(location) => location.startsWith(src)],
      configFile: path.join(__dirname, '../.babelrc.node.js'),
    });
    return { directory: src, verb: 'transpile' };
  }
  // use the build created either statically or by a watcher
  return { directory: build, verb: 'load' };
};
const { directory, verb } = setup();

const [getFromCache, clearCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'render', { html: null, helmet: null, styleTags: null });

let isFirstTranspile = true;
let needsTranspile = true;

// clear client code from the require cache whenever it gets changed
// it'll get loaded off the disk again when the render calls require
require('chokidar').watch(directory).on('change', () => {
  needsTranspile = true;
  clearCache(); // clear the server rendering cache
});

const requireClient = () => {
  if (needsTranspile) {
    // remove everything in the src directory
    Object.keys(require.cache).forEach((location) => {
      if (location.startsWith(directory)) delete require.cache[location];
    });
  }
  const startTime = performance.now();
  const required = require(path.join(directory, './server'));
  const endTime = performance.now();
  if (needsTranspile) console.log(`SSR ${isFirstTranspile ? '' : 're'}${verb} took ${Math.round(endTime - startTime)}ms`);
  isFirstTranspile = false;
  needsTranspile = false;
  return required;
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');
setImmediate(() => {
  try {
    requireClient();
  } catch (error) {
    // try importing right away so we don't have to wait
    // but if it fails now it's probably because there are no past builds to use
    console.warn('Failed to load client code for ssr. This either means the initial build is not finished or there is a bug in the code');
    console.error(error.toString());
    captureException(error);
  }
});

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
