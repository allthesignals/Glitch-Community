const { captureException } = require('@sentry/node');
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
const { APP_URL } = constants.current;
const renderPage = require('./render');
const getAssignments = require('./ab-tests');
const { getData, saveDataToFile } = require('./home');

module.exports = function(external) {
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

  const ms = dayjs.convert(7, 'days', 'miliseconds');
  app.use(express.static('public', { index: false }));
  app.use(express.static('build/client', { index: false, maxAge: ms }));

  const readFilePromise = util.promisify(fs.readFile);

  async function render(req, res, cache = {}, wistiaVideoId = null) {
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

    const assignments = getAssignments(req, res);
    const signedIn = !!req.cookies.hasLogin;
    const [zine, homeContent] = await Promise.all([getZine(), getData('home')]);

    let ssr = { rendered: null, helmet: null, styleTags: '' };
    try {
      const url = new URL(req.url, `${req.protocol}://${req.hostname}`);
      const { html, context, helmet, styleTags } = await renderPage(url, {
        AB_TESTS: assignments,
        API_CACHE: cache,
        EXTERNAL_ROUTES: external,
        HOME_CONTENT: homeContent,
        SSR_SIGNED_IN: signedIn,
        ZINE_POSTS: zine || [],
      });
      ssr = {
        rendered: html,
        helmet,
        styleTags,
        ...context,
      };
    } catch (error) {
      console.error(`Failed to server render ${req.url}: ${error.toString()}`);
      captureException(error);
    }

    res.render('index.ejs', {
      scripts,
      styles,
      BUILD_COMPLETE: built,
      BUILD_TIMESTAMP: buildTime.toISOString(),
      API_CACHE: cache,
      EXTERNAL_ROUTES: external,
      ZINE_POSTS: zine || [],
      HOME_CONTENT: homeContent,
      SSR_SIGNED_IN: signedIn,
      AB_TESTS: assignments,
      PROJECT_DOMAIN: process.env.PROJECT_DOMAIN,
      ENVIRONMENT: process.env.NODE_ENV || 'dev',
      RUNNING_ON: process.env.RUNNING_ON,
      ...ssr,
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
    res.header('Cache-Control', 'public, max-age=1');
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

  app.get('/api/home', async (req, res) => {
    const data = await getData('home');
    res.send(data);
  });

  app.post('/api/home', async (req, res) => {
    const persistentToken = req.headers.authorization;
    const data = req.body;
    const page = 'home';
    try {
      await saveDataToFile({ page, persistentToken, data });
      res.sendStatus(200);
    } catch (e) {
      console.warn(e);
      res.sendStatus(403);
    }
  });

  app.get('/api/pupdate', async (req, res) => {
    const data = await getData('pupdates');
    res.send(data);
  });

  app.post('/api/pupdate', async (req, res) => {
    const persistentToken = req.headers.authorization;
    const data = req.body;
    const page = 'pupdates';
    try {
      await saveDataToFile({ page, persistentToken, data });
      res.sendStatus(200);
    } catch (e) {
      console.warn(e);
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
