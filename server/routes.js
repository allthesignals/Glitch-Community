const express = require('express');
const helmet = require('helmet');
const enforce = require('express-sslify');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');
const punycode = require('punycode');

const { getProject, getTeam, getUser, getCollection, getZine } = require('./api');
const initWebpack = require('./webpack');
const constants = require('./constants');
const { allByKeys } = require('../shared/api');
const categories = require('../shared/categories');
const { APP_URL } = constants.current;
const renderPage = require('./render');
const getAssignments = require('./ab-tests');
const { getOptimizelyData, getOptimizelyId } = require('./optimizely');
const { readCuratedContent, writeCuratedContent } = require('./curated');
const rootTeams = require('../shared/teams');

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

  initWebpack(app);
  const buildTime = dayjs();

  const ms = dayjs.convert(7, 'days', 'milliseconds');
  app.use(express.static('public', { index: false }));
  app.use(express.static('build/client', { index: false, maxAge: ms }));

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
      const stats = JSON.parse(await readFilePromise('build/client/stats.json'));
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
      AB_TESTS: getAssignments(req, res),
      API_CACHE,
      EXTERNAL_ROUTES,
      HOME_CONTENT: readCuratedContent('home'),
      OPTIMIZELY_DATA: getOptimizelyData(),
      OPTIMIZELY_ID: getOptimizelyId(req, res),
      PUPDATES_CONTENT: readCuratedContent('pupdates'),
      SSR_SIGNED_IN: !!req.cookies.hasLogin,
      ZINE_POSTS: getZine(),
    });

    const renderedContext = await renderPage(url, currentContext);

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

  app.get('/~:domain/edit', async (req, res) => {
    const { domain } = req.params;
    const editorUrl = `${APP_URL}/edit/#!/${domain}`;

    res.redirect(editorUrl);
  });

  app.get('/~:domain/console', async (req, res) => {
    const { domain } = req.params;
    const consoleUrl = `${APP_URL}/edit/console.html?${domain}`;

    res.redirect(consoleUrl);
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

  categories.forEach((category) => {
    app.get(`/${category.url}`, (req, res) => {
      res.redirect(301, `/@glitch/${category.collectionName}`);
    });
  });

  // redirect legacy root team URLs to '@' URLs (eg. glitch.com/slack => glitch.com/@slack)
  Object.keys(rootTeams).forEach((teamName) => {
    app.get(`/${teamName}`, (req, res) => {
      res.redirect(301, `/@${teamName}`);
    });
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
    if (!['home', 'pupdates'].includes(page)) return res.sendStatus(400);

    const data = await readCuratedContent(page);
    res.send(data);
  });

  app.post('/api/:page', async (req, res) => {
    const { page } = req.params;
    if (!['home', 'pupdates'].includes(page)) return res.sendStatus(400);

    if (req.headers.authorization === process.env.CMS_POST_SECRET) {
      await writeCuratedContent({ page, data: req.body });
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
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
