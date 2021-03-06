const express = require('express');
const helmet = require('helmet');
const enforce = require('express-sslify');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');
const punycode = require('punycode');

const { getProject, getTeam, getUser, getCollection } = require('./api');
const webpackExpressMiddleware = require('./webpack');
const constants = require('./constants');
const { allByKeys } = require('../shared/api');
const renderPage = require('./render');
const { getOptimizelyData, getOptimizelyId, optimizelyKey } = require('./optimizely');
const { getHomeData, reloadHomeData, getPupdates, reloadPupdates, getZinePosts, reloadZinePosts } = require('./curated');

module.exports = function(EXTERNAL_ROUTES) {
  const app = express.Router();

  // don't enforce HTTPS if building the site locally, not on glitch.com
  if (!process.env.RUNNING_LOCALLY) {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  // CORS - Allow pages from any domain to make requests to our API
  app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // security headers added by jenn to get mozilla observatory score up
    response.header('X-XSS-Protection', '1; mode=block');
    response.header('X-Content-Type-Options', 'nosniff');
    response.header('Strict-Transport-Security', 'max-age=15768000');
    return next();
  });

  // Use webpack middleware for dev/staging/etc.
  if ((!process.env.BUILD_TYPE || process.env.BUILD_TYPE === 'memory') && process.env.NODE_ENV !==  'production') {
    app.use(webpackExpressMiddleware());
  }
  const buildTime = dayjs();

  const ms = dayjs.convert(7, 'days', 'milliseconds');
  app.use(express.static('public', { index: false }));
  app.use(express.static('build', { index: false, maxAge: ms }));

  const readFilePromise = util.promisify(fs.readFile);

  async function render(req, res, API_CACHE = {}, wistiaVideoId = null) {
    let built = true;

    let scripts = [];
    let styles = [];

    if (wistiaVideoId) {
      scripts.push('//fast.wistia.com/assets/external/E-v1.js');
      scripts.push(`//fast.wistia.com/embed/medias/${wistiaVideoId}.jsonp`);
    }

    try {
      const stats = JSON.parse(await readFilePromise('build/stats.json'));
      for (const file of stats.entrypoints.client.assets) {
        if (file.match(/\.js(\?|$)/)) {
          scripts.push(`${stats.publicPath}${file}`);
        }
        if (file.match(/\.css(\?|$)/)) {
          styles.push(`${stats.publicPath}${file}`);
        }
      }
    } catch (error) {
      console.error("Failed to load webpack stats file. Unless you see a webpack error here, the initial build probably just isn't ready yet.");
      built = false;
    }

    const url = new URL(req.url, `${req.protocol}://${req.hostname}`);
    const currentContext = await allByKeys({
      API_CACHE,
      EXTERNAL_ROUTES,
      HOME_CONTENT: getHomeData(),
      OPTIMIZELY_KEY: optimizelyKey,
      OPTIMIZELY_DATA: getOptimizelyData(),
      OPTIMIZELY_ID: getOptimizelyId(req, res),
      PUPDATES_CONTENT: getPupdates(),
      SSR_SIGNED_IN: !!req.cookies.hasLogin,
      SSR_HAS_PROJECTS: !!req.cookies.hasProjects,
      SSR_IN_TESTING_TEAM: !!req.cookies.inTestingTeam,
      ZINE_POSTS: getZinePosts(),
    });

    const renderedContext = await renderPage(url, currentContext);
    
    if (renderedContext.redirect) {
      res.redirect(301, renderedContext.redirect);
    } else {
      res.render('index.ejs', {
        ...currentContext,
        ...renderedContext,
        scripts,
        styles,
        BUILD_COMPLETE: built,
        BUILD_TIMESTAMP: buildTime.toISOString(),
        PROJECT_DOMAIN: process.env.PROJECT_DOMAIN,
        ENVIRONMENT: process.env.NODE_ENV || 'dev',
        RUNNING_ON: process.env.RUNNING_ON,
      });
    }
  }

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        baseUri: ["'self'"],
        reportUri: 'https://csp-reporting-server.glitch.me/report',
      },
    }),
  );

  app.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache');
    return next();
  });

  app.get('/~:domain', async (req, res) => {
    const { domain } = req.params;
    const project = await getProject(punycode.toASCII(domain));
    const cache = project && { [`project:${domain}`]: project };
    await render(req, res, cache);
  });

  app.get('/@:name', async (req, res) => {
    const { name } = req.params;
    const team = await getTeam(name);
    if (team) {
      const cache = { [`team-or-user:${name}`]: { team } };
      await render(req, res, cache);
      return;
    }
    const user = await getUser(name);
    if (user) {
      const cache = { [`team-or-user:${name}`]: { user } };
      await render(req, res, cache);
      return;
    }
    await render(req, res);
  });

  app.get('/@:author/:url', async (req, res) => {
    const { author, url } = req.params;
    const collection = await getCollection(author, url);
    const cache = collection && { [`collection:${author}/${url}`]: collection };
    await render(req, res, cache);
  });

  app.get('/auth/:domain', async (req, res) => {
    const { domain } = req.params;

    res.render('api-auth.ejs', {
      domain: domain,
      CONSTANTS: constants,
      RUNNING_ON: process.env.RUNNING_ON,
    });
  });

  app.get('/api/:page', async (req, res) => {
    const { page } = req.params;
    if (page === 'home') {
      res.send(await getHomeData());
    } else if (page === 'pupdates') {
      res.send(await getPupdates());
    } else if (page === 'zine') {
      res.send(await getZinePosts());
    } else {
      res.sendStatus(400);
    }
  });

  app.post('/api/:page', async (req, res) => {
    const { page } = req.params;
    if (req.headers.authorization !== process.env.CMS_POST_SECRET) {
      res.sendStatus(403);
    } else if (page === 'home') {
      await reloadHomeData();
      res.sendStatus(200);
    } else if (page === 'pupdates') {
      await reloadPupdates();
      res.sendStatus(200);
    } else if (page === 'zine') {
      await reloadZinePosts();
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  });

  app.get(['/', '/index.html'], async (req, res) => {
    await render(req, res, {}, 'z2ksbcs34d');
  });

  app.get('/create', async (req, res) => {
    await render(req, res, {}, '2vcr60pnx9');
  });

  app.get('*', async (req, res) => {
    await render(req, res);
  });

  return app;
};
