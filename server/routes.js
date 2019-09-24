const { captureException } = require('@sentry/node');
const express = require('express');
const helmet = require('helmet');
const enforce = require('express-sslify');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');
const punycode = require('punycode');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const cheerio = require('cheerio');

const { getProject, getTeam, getUser, getCollection, getZine } = require('./api');
const initWebpack = require('./webpack');
const constants = require('./constants');
const renderPage = require('./render');
const getAssignments = require('./ab-tests');
const { getData, saveDataToFile } = require('./home');

const DEFAULT_USER_DESCRIPTION = (login, name) => `See what ${name} (@${login}) is up to on Glitch, the ${constants.tagline} `;
const DEFAULT_TEAM_DESCRIPTION = (login, name) => `See what Team ${name} (@${login}) is up to on Glitch, the ${constants.tagline} `;

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
  const imageDefault = 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fsocial-card%402x.png';

  async function render(req, res, { title, description, image = imageDefault, socialTitle, canonicalUrl = APP_URL, wistiaVideoId, cache = {} }, shouldRender = false) {
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
    if (shouldRender) {
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
    }

    res.render('index.ejs', {
      title,
      socialTitle,
      description,
      image,
      scripts,
      styles,
      canonicalUrl,
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

  const { CDN_URL, APP_URL } = constants.current;

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
    await render(req, res, { cache }, true);
  });

  app.get('/@:name', async (req, res) => {
    const { name } = req.params;
    const canonicalUrl = `${APP_URL}/@${name}`;
    const team = await getTeam(name);
    if (team) {
      // detect if team uses default description "an adjectivy team that does adjectivy things"
      // if so, don't include it
      const hasMaybeUpdatedDescription = team.createdAt !== team.updatedAt;
      let description = DEFAULT_TEAM_DESCRIPTION(team.url, team.name);

      if (team.description && hasMaybeUpdatedDescription) {
        description += cheerio.load(md.render(team.description)).text();
      }

      const cache = { [`team-or-user:${name}`]: { team } };
      const args = { title: team.name, description, canonicalUrl, cache };

      if (team.hasAvatarImage) {
        args.image = `${CDN_URL}/team-avatar/${team.id}/large`;
      } else {
        // default team avatar (need to use PNG version, social cards don't support SVG)
        args.image = `${CDN_URL}/76c73a5d-d54e-4c11-9161-ddec02bd7c67%2Fteam-avatar.png?1558031923766`;
      }

      await render(req, res, args, true);
      return;
    }
    const user = await getUser(name);
    if (user) {
      const description = DEFAULT_USER_DESCRIPTION(user.login, user.name) + cheerio.load(md.render(user.description)).text();

      await render(req, res, {
        title: user.name || `@${user.login}`,
        canonicalUrl,
        description,
        image: user.avatarThumbnailUrl || `${CDN_URL}/76c73a5d-d54e-4c11-9161-ddec02bd7c67%2Fanon-user-avatar.png?1558646496932`,
        cache: { [`team-or-user:${name}`]: { user } },
      }, true);
      return;
    }
    await render(req, res, { title: `@${name}`, description: `We couldn't find @${name}`, canonicalUrl });
  });

  app.get('/@:author/:url', async (req, res) => {
    const { author, url } = req.params;
    const collection = await getCollection(author, url);
    const cache = collection && { [`collection:${author}/${url}`]: collection };
    await render(req, res, { cache }, true);
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
    const socialTitle = 'Glitch: The friendly community where everyone builds the web';
    const description = 'Simple, powerful, free tools to create and use millions of apps.';
    const image = `${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fsocial-banner.png?v=1562683795781`;
    await render(req, res, { title: 'Glitch', socialTitle, description, image, wistiaVideoId: 'z2ksbcs34d' }, true);
  });

  app.get('/create', async (req, res) => {
    const title = 'Glitch - Create';
    const socialTitle = 'Get Started Creating on Glitch';
    const description = 'Glitch is a collaborative programming environment that lives in your browser and deploys code as you type.';
    const image = `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0/create-illustration.png?v=1562612212463`;
    const canonicalUrl = `${APP_URL}/create`;
    await render(req, res, { title, socialTitle, description, image, canonicalUrl, wistiaVideoId: '2vcr60pnx9' }, true);
  });

  app.get('/secret', async (req, res) => {
    const description = "It's a secret to everybody";
    const title = `Glitch - ${description}`;
    await render(req, res, { title, description }, true);
  });
  

  app.get('*', async (req, res) => {
    const title = 'Glitch';
    const socialTitle = 'Glitch: The friendly community where everyone builds the web';
    const description = 'Simple, powerful, free tools to create and use millions of apps.';
    const image = `${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fsocial-banner.png?v=1562683795781`;
    await render(req, res, { title, description, image, socialTitle });
  });

  return app;
};
