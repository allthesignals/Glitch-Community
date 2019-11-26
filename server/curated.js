const axios = require('axios');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');

const api = axios.create({
  baseURL: 'https://cms.glitch.me',
  timeout: 15000, // nice long timeout
});

async function getCuratedFile(name) {
  const response = await api.get(`/${name}.json`);
  return response.data;
}

async function getCultureZinePosts() {
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  const response = await api.get(url);
  return response.data.posts;
}

function createCuratedUpdater(label, get) {
  let promise = get();
  promise.then(() => console.log(`Loaded ${label}`));

  // call get() again, but only store the promise once the data is actually ready
  // don't block requests for fresh data, and never replace good data with an error
  const lazyReload = async () => {
    try {
      const value = await get();
      promise = Promise.resolve(value);
    } catch (error) {
      console.warn(`Failed to load ${label}: ${error.toString()}`);
      captureException(error);
    }
  };
  // get the latest promise, assuming the initial request on startup goes through this will never be an error
  const getValue = () => promise;

  // reload on a regular interval, but wait until the last request finishes before starting the timer for the next request
  const interval = dayjs.convert(5, 'minutes', 'ms');
  const cycle = async () => {
    await lazyReload();
    setTimeout(cycle, interval);
  };
  setTimeout(cycle, interval);

  return [getValue, lazyReload];
}

const [getHomeData, reloadHomeData] = createCuratedUpdater('home data', () => getCuratedFile('home'));
const [getPupdates, reloadPupdates] = createCuratedUpdater('pupdates', () => getCuratedFile('pupdates'));
const [getZine, reloadZine] = createCuratedUpdater('culture zine', () => getCultureZinePosts());

module.exports = { getHomeData, reloadHomeData, getPupdates, reloadPupdates, getZine, reloadZine };
